import { Injectable, Inject, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SenaTypeORM } from 'src/domain/sena/reconocimiento-titulos/persistence/typeorm/reconocimiento-titulo.entity';
import { HomologacionRepository } from 'src/domain/homologaciones/repository/homologacion.repository';
import { EstudianteRepository } from 'src/domain/estudiante/repository/estudiante.repository';
import { CarrerasAfinesResponseDto } from 'src/domain/carreras-afines/dto/carreras-afines.dto';

@Injectable()
export class CarrerasAfinesService {
  private readonly logger = new Logger(CarrerasAfinesService.name);
  
  constructor(
    @InjectRepository(SenaTypeORM)
    private readonly senaTypeormRepository: Repository<SenaTypeORM>,
    @Inject('HomologacionRepository')
    private readonly homologacionRepository: HomologacionRepository,
    @Inject('EstudianteRepository')
    private readonly estudianteRepository: EstudianteRepository,
  ) {}

  async obtenerCarrerasAfinesPorDocumento(numeroDocumento: string) {
    try {
      const estudiante = await this.estudianteRepository.findByNumeroIdentificacion(numeroDocumento);
      if (!estudiante) {
        throw new HttpException(
          `No se encontró un estudiante con número de identificación: ${numeroDocumento}`,
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
      
      if (!homologacion.institucion || !homologacion.carreraHom) {
        throw new HttpException(
          'La homologación no tiene información de institución o carrera',
          HttpStatus.BAD_REQUEST
        );
      }
      const carrerasAfines = await this.senaTypeormRepository
        .createQueryBuilder('sena')
        .select('DISTINCT sena.nom_unidad', 'carreraAfin')
        .where('UPPER(sena.programa_ies) LIKE UPPER(:carrera)', { 
          carrera: `%${homologacion.carreraHom}%` 
        })
        .orderBy('sena.nom_unidad')
        .getRawMany();
      
      return {
        success: true,
        message: 'Carreras afines recuperadas exitosamente',
        data: {
          estudianteId: estudiante.id,
          nombreEstudiante: estudiante.nombreCompleto,
          institucion: homologacion.institucion,
          carreraHomologacion: homologacion.carreraHom,
          carrerasAfines: carrerasAfines.map(item => item.carreraAfin)
        }
      };
    } catch (error) {
      this.logger.error(`Error al obtener carreras afines: ${error.message}`, error.stack);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException({
        success: false,
        message: 'Error al obtener carreras afines',
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}