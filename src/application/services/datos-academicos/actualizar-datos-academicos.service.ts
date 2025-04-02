// src/application/services/datos-academicos/actualizar-datos-academicos.service.ts
import { Inject, Injectable, Logger, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as mssql from 'mssql';

import { EstudianteRepository } from '../../../domain/estudiante/repository/estudiante.repository';
import { HomologacionRepository } from '../../../domain/homologaciones/repository/homologacion.repository';
import { ActualizarDatosAcademicosDto } from 'src/domain/datos-academicos/dto/actualizar-datos-academicos.dto';
import { SenaTypeORM } from 'src/domain/sena/reconocimiento-titulos/persistence/typeorm/reconocimiento-titulo.entity';

@Injectable()
export class ActualizarDatosAcademicosUseCase {
  private readonly logger = new Logger(ActualizarDatosAcademicosUseCase.name);
  private sqlConfig: mssql.config;

  constructor(
    @Inject('EstudianteRepository')
    private readonly estudianteRepository: EstudianteRepository,
    @Inject('HomologacionRepository')
    private readonly homologacionRepository: HomologacionRepository,
    @InjectRepository(SenaTypeORM)
    private readonly senaTypeormRepository: Repository<SenaTypeORM>,
    private readonly configService: ConfigService,
  ) {
  
    this.sqlConfig = {
      user: this.configService.get<string>('SQLSERVER_USERNAME'),
      password: this.configService.get<string>('SQLSERVER_PASSWORD'),
      database: this.configService.get<string>('SQLSERVER_DATABASE'),
      server: this.configService.get<string>('SQLSERVER_HOST'),
      port: Number(this.configService.get<number>('SQLSERVER_PORT')),
      options: {
        encrypt: false,
        trustServerCertificate: true
      }
    };
  }

  async execute(dto: ActualizarDatosAcademicosDto) {
    try {
      const estudiante = await this.estudianteRepository.findByNumeroIdentificacion(
        dto.numeroIdentificacion,
      );

      if (!estudiante) {
        this.logger.error(
          `Estudiante no encontrado con identificación: ${dto.numeroIdentificacion}`,
        );
        throw new Error(`No se encontró un estudiante con número de identificación: ${dto.numeroIdentificacion}`);
      }
      const homologaciones = await this.homologacionRepository.findByEstudianteId(estudiante.id);

      if (!homologaciones || homologaciones.length === 0) {
        this.logger.error(
          `No se encontraron homologaciones para el estudiante: ${estudiante.id}`,
        );
        throw new Error('No se encontraron homologaciones para este estudiante');
      }

      const homologacion = homologaciones[0];
      const senaData = await this.obtenerCodigosDesdeTabla(
        dto.carreraCun, 
        dto.modalidad, 
        dto.jornada
      );

      let periodo: string | undefined = undefined;
      if (senaData.codUnidad) {
        periodo = await this.obtenerPeriodo(senaData.codUnidad);
      }

      let semestre: string | undefined = undefined;
      if (senaData.codPensum) {
        semestre = await this.obtenerSemestre(senaData.codPensum);
      }

      const homologacionActualizada = await this.homologacionRepository.update(
        homologacion.id,
        {
          carreraCun: dto.carreraCun,
          jornada: dto.jornada,
          modalidad: dto.modalidad,
          ciudad: dto.ciudad,
          codPensum: senaData.codPensum,
          codUnidad: senaData.codUnidad,
          periodo: periodo,
          semestre: semestre,
          updatedAt: new Date(),
        },
      );

      return {
        success: true,
        message: 'Datos académicos actualizados correctamente',
        data: {
          estudiante,
          homologacion: homologacionActualizada,
        },
      };
    } catch (error) {
      this.logger.error(`Mensaje de error: ${error.message}`);
      this.logger.error(`Stack trace: ${error.stack}`);

      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      
      if (error.message.includes('No se encontró un estudiante') || 
          error.message.includes('No se encontraron homologaciones')) {
        status = HttpStatus.NOT_FOUND;
      } else {
        status = HttpStatus.BAD_REQUEST;
      }

      throw new HttpException({
        success: false,
        message: error.message || 'Error al actualizar los datos académicos',
        error: error.message,
      }, status);
    }
  }

  private async obtenerCodigosDesdeTabla(carreraCun: string, modalidad: string, jornada: string): Promise<{ codPensum: string | undefined, codUnidad: string | undefined }> {
    try {
      let queryBuilder = this.senaTypeormRepository.createQueryBuilder('sena');

      if (modalidad.toUpperCase() === 'VIRTUAL') {
        queryBuilder = queryBuilder
          .where('UPPER(sena.nom_unidad) LIKE UPPER(:carrera)', {
            carrera: `%${carreraCun}%`,
          })
          .andWhere('UPPER(sena.nom_tabla_met) LIKE UPPER(:modalidad)', {
            modalidad: `%VIRTUAL%`,
          });
      } else {

        const sufijoPensum = jornada === 'NOCTURNA' ? 'N' : 'D';
        
        queryBuilder = queryBuilder
          .where('UPPER(sena.nom_unidad) LIKE UPPER(:carrera)', {
            carrera: `%${carreraCun}%`,
          })
          .andWhere('UPPER(sena.nom_tabla_met) LIKE UPPER(:modalidad)', {
            modalidad: `%${modalidad}%`,
          })
          .andWhere('sena.cod_pensum LIKE :sufijo', {
            sufijo: `%${sufijoPensum}`,
          });
      }

      const senaData = await queryBuilder.getOne();
      if (!senaData) {
        this.logger.warn('No se encontraron datos en la tabla SENA');
        return { codPensum: undefined, codUnidad: undefined };
      }
      
      this.logger.log(`Datos encontrados: cod_pensum=${senaData.cod_pensum}, cod_unidad=${senaData.cod_unidad}`);
      
      return { 
        codPensum: senaData.cod_pensum || undefined, 
        codUnidad: senaData.cod_unidad || undefined 
      };
    } catch (error) {
      this.logger.error(`Error al obtener códigos desde tabla SENA: ${error.message}`);
      return { codPensum: undefined, codUnidad: undefined };
    }
  }

  private async obtenerPeriodo(codUnidad: string): Promise<string | undefined> {
    try {

      let pool = await mssql.connect(this.sqlConfig);
      const query = `
        DECLARE @FechaActual DATE = CAST(GETDATE() AS DATE),
        @AnioActual VARCHAR(4),
        @CodigoPrograma VARCHAR(50) = @codUnidad;
        SET @AnioActual = CAST(YEAR(GETDATE()) AS VARCHAR(4));
        SELECT TOP 1 PERIODO
        FROM CUN.MATRIZ_CALENDARIO AS M
        WHERE Estado_Periodo = 'Activo'
        AND AÑO >= @AnioActual
        AND @FechaActual <= TRY_CONVERT(DATE, FF_CONV, 103)
        AND PERIODO NOT LIKE '%24T%'
        AND MODALIDAD NOT LIKE '%CONTINUADA%'
        AND MODALIDAD NOT LIKE '%IDIOMAS%'
        AND MODALIDAD NOT LIKE '%ESPECIALIZACION%'
        AND (
          (MODALIDAD <> 'PRESENCIAL' AND @CodigoPrograma LIKE '%v%') OR
          (MODALIDAD <> 'VIRTUAL' AND @CodigoPrograma NOT LIKE '%v%')
        )
        ORDER BY M.PERIODO ASC;
      `;
      
      const request = pool.request();
      request.input('codUnidad', mssql.VarChar, codUnidad);
      
      const result = await request.query(query);
      
      if (result && result.recordset && result.recordset.length > 0) {
        return result.recordset[0].PERIODO;
      }
      
      return undefined;
    } catch (error) {
      this.logger.error(`Error al obtener periodo desde SQL Server: ${error.message}`);
      return undefined;
    } finally {
      try {
        await mssql.close();
      } catch (err) {
      }
    }
  }

  private async obtenerSemestre(codPensum: string): Promise<string | undefined> {
    try {
      let pensumParam = codPensum;
      if (pensumParam && (pensumParam.endsWith('N') || pensumParam.endsWith('D'))) {
        pensumParam = pensumParam.slice(0, -1);
      }
      let pool = await mssql.connect(this.sqlConfig);
      const query = `
        SELECT TOP 1 SEMESTRES
        FROM CUN.MALLASCun m
        WHERE NIVEL = 'TECNOLOGO'
        AND ESTADO = 'VIGENTE'
        AND PENSUM = @codPensum
      `;
      const request = pool.request();
      request.input('codPensum', mssql.VarChar, pensumParam);
      const result = await request.query(query); 
      if (result && result.recordset && result.recordset.length > 0) {
        return result.recordset[0].SEMESTRES;
      }
      
      return undefined;
    } catch (error) {
      this.logger.error(`Error al obtener semestre desde SQL Server: ${error.message}`);
      return undefined;
    } finally {
      try {
        await mssql.close();
      } catch (err) {

      }
    }
  }
}