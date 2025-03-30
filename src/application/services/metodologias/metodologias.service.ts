import { Injectable, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SenaTypeORM } from 'src/domain/sena/reconocimiento-titulos/persistence/typeorm/reconocimiento-titulo.entity';
import { MetodologiasCarreraResponseDto } from 'src/domain/metodologias/dto/metodologias.dto';

@Injectable()
export class MetodologiasCarrerasService {
  private readonly logger = new Logger(MetodologiasCarrerasService.name);
  
  constructor(
    @InjectRepository(SenaTypeORM)
    private readonly senaTypeormRepository: Repository<SenaTypeORM>,
  ) {}

  async obtenerMetodologiasPorCarrera(nombreCarrera: string): Promise<MetodologiasCarreraResponseDto> {
    try {
      if (!nombreCarrera || nombreCarrera.trim() === '') {
        throw new HttpException(
          'El nombre de la carrera es requerido',
          HttpStatus.BAD_REQUEST
        );
      }

      // Buscar metodologías relacionadas con la carrera en la tabla SENA
      const metodologias = await this.senaTypeormRepository
        .createQueryBuilder('sena')
        .select('DISTINCT sena.nom_tabla_met', 'metodologia')
        .where('UPPER(sena.nom_unidad) LIKE UPPER(:carrera)', { 
          carrera: `%${nombreCarrera}%` 
        })
        .orderBy('sena.nom_tabla_met')
        .getRawMany();
      
      if (!metodologias || metodologias.length === 0) {
        return {
          success: true,
          message: 'No se encontraron metodologías para la carrera especificada',
          data: {
            carrera: nombreCarrera,
            metodologias: []
          }
        };
      }
      
      return {
        success: true,
        message: 'Metodologías recuperadas exitosamente',
        data: {
          carrera: nombreCarrera,
          metodologias: metodologias.map(item => item.metodologia)
        }
      };
    } catch (error) {
      this.logger.error(`Error al obtener metodologías por carrera: ${error.message}`, error.stack);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException({
        success: false,
        message: 'Error al obtener metodologías',
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}