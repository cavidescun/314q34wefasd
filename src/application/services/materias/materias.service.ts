import { Injectable, Logger, HttpStatus, HttpException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as oracledb from 'oracledb';
import { MateriaPensum } from 'src/domain/materias/entity/materias.entity';
import { ConsultaMateriasDto } from 'src/domain/materias/dto/materias.dto';
import { MateriasResponseDto } from 'src/domain/materias/materia-response/dto/meteria-response.dto';
import { EstudianteRepository } from '../../../domain/estudiante/repository/estudiante.repository';
import { HomologacionRepository } from '../../../domain/homologaciones/repository/homologacion.repository';

@Injectable()
export class MateriasHomologacionService {
  private readonly logger = new Logger(MateriasHomologacionService.name);
  private oracleConfig: any;

  constructor(
    private readonly configService: ConfigService,
    @Inject('EstudianteRepository')
    private readonly estudianteRepository: EstudianteRepository,
    @Inject('HomologacionRepository')
    private readonly homologacionRepository: HomologacionRepository
  ) {
    this.oracleConfig = {
      user: configService.get<string>('ORACLE_USERNAME'),
      password: configService.get<string>('ORACLE_PASSWORD'),
      connectString: `${configService.get<string>('ORACLE_HOST')}:${configService.get<number>('ORACLE_PORT')}/${configService.get<string>('ORACLE_SID')}`
    };
  }

  async obtenerMateriasPorParametros(
    params: ConsultaMateriasDto,
  ): Promise<MateriasResponseDto> {
    let connection;

    try {
      this.logger.log(`Intentando conectar a Oracle con: ${this.oracleConfig.connectString}`);
      
      connection = await oracledb.getConnection(this.oracleConfig);

      const query = `
        SELECT MP.COD_UNIDAD, MP.COD_PENSUM, MP.COD_MATERIA, MP.NUM_NIVEL, MP.NOM_MATERIA, MP.UNI_TEORICA 
        FROM SINU.SRC_MAT_PENSUM MP
        WHERE MP.COD_UNIDAD = :codUnidad
        AND MP.COD_PENSUM = :codPensum
        AND MP.NUM_NIVEL <= :semestre
        ORDER BY MP.NUM_NIVEL ASC
      `;

      const binds = {
        codUnidad: params.codUnidad,
        codPensum: params.codPensum,
        semestre: params.semestre,
      };

      const options = {
        autoCommit: true,
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      };

      const result = await connection.execute(query, binds, options);
      const rows = result.rows || [];

      if (rows.length === 0) {
        this.logger.warn(
          'No se encontraron materias con los parámetros proporcionados',
        );

        return {
          success: true,
          message:
            'No se encontraron materias para los parámetros proporcionados',
          parametros: {
            codUnidad: params.codUnidad,
            codPensum: params.codPensum,
            semestre: params.semestre,
          },
          data: [],
        };
      }

      this.logger.log(`Se encontraron ${rows.length} materias`);

      const materias = rows.map(
        (row) =>
          new MateriaPensum({
            codUnidad: row.COD_UNIDAD,
            codPensum: row.COD_PENSUM,
            codMateria: row.COD_MATERIA,
            numNivel: row.NUM_NIVEL,
            nomMateria: row.NOM_MATERIA,
            uniTeorica: row.UNI_TEORICA,
          }),
      );

      return {
        success: true,
        message: 'Materias recuperadas exitosamente',
        parametros: {
          codUnidad: params.codUnidad,
          codPensum: params.codPensum,
          semestre: params.semestre,
        },
        data: materias,
      };
    } catch (error) {
      this.logger.error(
        `Error al consultar materias: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        {
          success: false,
          message: 'Error al consultar materias en la base de datos',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          this.logger.error('Error al cerrar la conexión a Oracle', err);
        }
      }
    }
  }

  async obtenerMateriasPorDocumento(
    numeroIdentificacion: string,
  ): Promise<MateriasResponseDto> {
    let connection;

    try {
      this.logger.log(`Buscando datos académicos para el estudiante con número de identificación: ${numeroIdentificacion}`);

      const estudiante = await this.estudianteRepository.findByNumeroIdentificacion(numeroIdentificacion);
      
      if (!estudiante) {
        throw new HttpException(
          `No se encontró un estudiante con número de identificación: ${numeroIdentificacion}`,
          HttpStatus.NOT_FOUND
        );
      }

      const homologaciones = await this.homologacionRepository.findByEstudianteId(estudiante.id);
      
      if (!homologaciones || homologaciones.length === 0) {
        throw new HttpException(
          `No se encontraron homologaciones para el estudiante con ID: ${estudiante.id}`,
          HttpStatus.NOT_FOUND
        );
      }
      
      const homologacion = homologaciones[0];
      
      if (!homologacion.codUnidad || !homologacion.codPensum || !homologacion.semestre) {
        throw new HttpException(
          'El estudiante no tiene información académica completa (codUnidad, codPensum, semestre)',
          HttpStatus.BAD_REQUEST
        );
      }

      const params = {
        codUnidad: homologacion.codUnidad,
        codPensum: homologacion.codPensum,
        semestre: homologacion.semestre
      };

      connection = await oracledb.getConnection(this.oracleConfig);

      const query = `
        SELECT MP.COD_UNIDAD, MP.COD_PENSUM, MP.COD_MATERIA, MP.NUM_NIVEL, MP.NOM_MATERIA, MP.UNI_TEORICA 
        FROM SINU.SRC_MAT_PENSUM MP
        WHERE MP.COD_UNIDAD = :codUnidad
        AND MP.COD_PENSUM = :codPensum
        AND MP.NUM_NIVEL <= :semestre
        ORDER BY MP.NUM_NIVEL ASC
      `;

      const binds = {
        codUnidad: params.codUnidad,
        codPensum: params.codPensum,
        semestre: params.semestre,
      };

      const options = {
        autoCommit: true,
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      };

      const result = await connection.execute(query, binds, options);
      const rows = result.rows || [];

      if (rows.length === 0) {
        this.logger.warn(
          'No se encontraron materias con los parámetros proporcionados',
        );

        return {
          success: true,
          message:
            'No se encontraron materias para los parámetros proporcionados',
          parametros: {
            codUnidad: params.codUnidad,
            codPensum: params.codPensum,
            semestre: params.semestre,
          },
          data: [],
        };
      }

      const materias = rows.map(
        (row) =>
          new MateriaPensum({
            codUnidad: row.COD_UNIDAD,
            codPensum: row.COD_PENSUM,
            codMateria: row.COD_MATERIA,
            numNivel: row.NUM_NIVEL,
            nomMateria: row.NOM_MATERIA,
            uniTeorica: row.UNI_TEORICA,
          }),
      );

      return {
        success: true,
        message: 'Materias recuperadas exitosamente',
        parametros: {
          codUnidad: params.codUnidad,
          codPensum: params.codPensum,
          semestre: params.semestre,
          estudiante: {
            id: estudiante.id,
            nombreCompleto: estudiante.nombreCompleto,
            numeroIdentificacion: estudiante.numeroIdentificacion
          }
        },
        data: materias,
      };
    } catch (error) {
      this.logger.error(
        `Error al consultar materias por documento: ${error.message}`,
        error.stack,
      );
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          success: false,
          message: 'Error al consultar materias en la base de datos',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          this.logger.error('Error al cerrar la conexión a Oracle', err);
        }
      }
    }
  }
}