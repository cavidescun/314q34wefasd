import { Injectable, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SenaTypeORM } from 'src/domain/sena/reconocimiento-titulos/persistence/typeorm/reconocimiento-titulo.entity';
import { JornadasPensumResponseDto } from 'src/domain/jornadas/dto/jornadas.dto';

@Injectable()
export class JornadasPensumService {
  private readonly logger = new Logger(JornadasPensumService.name);
  
  constructor(
    @InjectRepository(SenaTypeORM)
    private readonly senaTypeormRepository: Repository<SenaTypeORM>,
  ) {}

  async obtenerJornadasPensum(nombreCarrera: string, modalidad: string): Promise<JornadasPensumResponseDto> {
    try {
      if (!nombreCarrera || nombreCarrera.trim() === '') {
        throw new HttpException(
          'El nombre de la carrera es requerido',
          HttpStatus.BAD_REQUEST
        );
      }

      if (!modalidad || modalidad.trim() === '') {
        throw new HttpException(
          'La modalidad es requerida',
          HttpStatus.BAD_REQUEST
        );
      }

      const resultados = await this.senaTypeormRepository
        .createQueryBuilder('sena')
        .select('DISTINCT sena.cod_pensum', 'codigoPensum')
        .where('UPPER(sena.nom_unidad) LIKE UPPER(:carrera)', { 
          carrera: `%${nombreCarrera}%` 
        })
        .andWhere('UPPER(sena.nom_tabla_met) LIKE UPPER(:modalidad)', {
          modalidad: `%${modalidad}%`
        })
        .orderBy('sena.cod_pensum')
        .getRawMany();
      
      if (!resultados || resultados.length === 0) {
        return {
          success: true,
          message: 'No se encontraron pensums para la carrera y modalidad especificadas',
          data: {
            carrera: nombreCarrera,
            modalidad: modalidad,
            jornadas: []
          }
        };
      }
      const jornadasUnicas = new Set<string>();
      resultados.forEach(item => {
        const codigoPensum = item.codigoPensum;
        
        if (codigoPensum && typeof codigoPensum === 'string') {
          if (codigoPensum.endsWith('N')) {
            jornadasUnicas.add('NOCTURNA');
          } else if (codigoPensum.endsWith('D')) {
            jornadasUnicas.add('DIURNA');
          }
        }
      });
      
      return {
        success: true,
        message: 'Jornadas de pensum recuperadas exitosamente',
        data: {
          carrera: nombreCarrera,
          modalidad: modalidad,
          jornadas: Array.from(jornadasUnicas)
        }
      };
    } catch (error) {
      this.logger.error(`Error al obtener jornadas de pensum: ${error.message}`, error.stack);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException({
        success: false,
        message: 'Error al obtener jornadas de pensum',
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}