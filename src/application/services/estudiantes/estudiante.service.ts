import { Injectable, Inject, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { Estudiante } from '../../../domain/estudiante/entity/estudiante.entity';
import { EstudianteRepository } from '../../../domain/estudiante/repository/estudiante.repository';
import { EstudianteUpdateDto } from 'src/domain/estudiante/dto/estudiante.dto';

@Injectable()
export class EstudianteService {
  private readonly logger = new Logger(EstudianteService.name);
  
  constructor(
    @Inject('EstudianteRepository')
    private readonly estudianteRepository: EstudianteRepository,
  ) {}

  async createEstudiante(estudiante: Estudiante): Promise<Estudiante> {
    try {
      const existingEstudiante =
        await this.estudianteRepository.findByNumeroIdentificacion(
          estudiante.numeroIdentificacion,
        );

      if (existingEstudiante) {
        throw new Error(
          `Ya existe un estudiante con el número de identificación ${estudiante.numeroIdentificacion}`,
        );
      }

      return this.estudianteRepository.create(estudiante);
    } catch (error) {
      this.logger.error(`Error al crear estudiante: ${error.message}`, error.stack);
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async obtenerEstudiantePorId(id: string) {
    try {
      const estudiante = await this.estudianteRepository.findById(id);

      if (!estudiante) {
        throw new Error(`No existe un estudiante con el id ${id}`);
      }

      return {
        message: 'Estudiante recuperado exitosamente',
        data: estudiante,
      };
    } catch (error) {
      this.logger.error(`Error al obtener estudiante por ID: ${error.message}`, error.stack);
      
      if (error.message.includes('No existe un estudiante')) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: error.message,
        }, HttpStatus.NOT_FOUND);
      }

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async obtenerEstudiantePorIdentificacion(numeroIdentificacion: string) {
    try {
      const estudiante = await this.estudianteRepository.findByNumeroIdentificacion(numeroIdentificacion);

      if (!estudiante) {
        throw new Error(`No existe un estudiante con el número de identificación ${numeroIdentificacion}`);
      }

      return {
        message: 'Estudiante recuperado exitosamente',
        data: estudiante,
      };
    } catch (error) {
      this.logger.error(`Error al obtener estudiante por identificación: ${error.message}`, error.stack);
      
      if (error.message.includes('No existe un estudiante')) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: error.message,
        }, HttpStatus.NOT_FOUND);
      }

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async actualizarEstudiante(id: string, data: EstudianteUpdateDto) {
    try {
      const estudiante = await this.estudianteRepository.findById(id);

      if (!estudiante) {
        throw new Error(`No se encontró el estudiante con id ${id}`);
      }

      const estudianteActualizado = await this.estudianteRepository.update(id, data);

      return {
        message: 'Estudiante actualizado exitosamente',
        data: estudianteActualizado,
      };
    } catch (error) {
      this.logger.error(`Error al actualizar estudiante: ${error.message}`, error.stack);
      
      if (error.message.includes('No se encontró el estudiante')) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: error.message,
        }, HttpStatus.NOT_FOUND);
      }

      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async obtenerTodosLosEstudiantes() {
    try {
      const estudiantes = await this.estudianteRepository.findAll();
      
      return {
        message: 'Estudiantes recuperados exitosamente',
        data: estudiantes,
      };
    } catch (error) {
      this.logger.error(`Error al obtener todos los estudiantes: ${error.message}`, error.stack);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}