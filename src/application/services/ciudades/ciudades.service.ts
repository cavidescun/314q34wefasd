import { Injectable, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SenaTypeORM } from 'src/domain/sena/reconocimiento-titulos/persistence/typeorm/reconocimiento-titulo.entity';
import { SedesCarrerasResponseDto } from 'src/domain/ciudades/dto/ciudades.dto';

@Injectable()
export class SedesCarrerasService {
  private readonly logger = new Logger(SedesCarrerasService.name);

  constructor(
    @InjectRepository(SenaTypeORM)
    private readonly senaTypeormRepository: Repository<SenaTypeORM>,
  ) {}

  async obtenerSedesPorCarreraModalidadJornada(
    nombreCarrera: string,
    modalidad: string,
    jornada: string,
  ): Promise<SedesCarrerasResponseDto> {
    try {
      if (!nombreCarrera || nombreCarrera.trim() === '') {
        throw new HttpException(
          'El nombre de la carrera es requerido',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!modalidad || modalidad.trim() === '') {
        throw new HttpException(
          'La modalidad es requerida',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!jornada || jornada.trim() === '') {
        throw new HttpException(
          'La jornada es requerida',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (jornada !== 'DIURNA' && jornada !== 'NOCTURNA') {
        throw new HttpException(
          'La jornada debe ser DIURNA o NOCTURNA',
          HttpStatus.BAD_REQUEST,
        );
      }

      const sufijoPensum = jornada === 'NOCTURNA' ? 'N' : 'D';

      const query = this.senaTypeormRepository
        .createQueryBuilder('sena')
        .select('DISTINCT sena.nom_sede', 'nomSede')
        .where('UPPER(sena.nom_unidad) LIKE UPPER(:carrera)', {
          carrera: `%${nombreCarrera}%`,
        })
        .andWhere('UPPER(sena.nom_tabla_met) LIKE UPPER(:modalidad)', {
          modalidad: `%${modalidad}%`,
        })
        .andWhere('sena.cod_pensum LIKE :sufijo', {
          sufijo: `%${sufijoPensum}`,
        })
        .orderBy('sena.nom_sede');

      const resultados = await query.getRawMany();

      if (!resultados || resultados.length === 0) {
        return {
          success: true,
          message: 'No se encontraron sedes para los criterios especificados',
          data: {
            carrera: nombreCarrera,
            modalidad: modalidad,
            jornada: jornada,
            ciudades: [],
          },
        };
      }

      const ciudades = resultados
        .map((item) => {
          let ciudad = item.nomSede || '';

          ciudad = ciudad.replace(/REGIONAL\s*/gi, '').trim();

          return ciudad;
        })
        .filter((ciudad) => ciudad !== '');

      return {
        success: true,
        message: 'Sedes recuperadas exitosamente',
        data: {
          carrera: nombreCarrera,
          modalidad: modalidad,
          jornada: jornada,
          ciudades: ciudades,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error al obtener sedes: ${error.message}`,
        error.stack,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          success: false,
          message: 'Error al obtener sedes',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
