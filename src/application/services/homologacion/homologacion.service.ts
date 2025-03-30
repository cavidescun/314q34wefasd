import { Injectable, Inject, HttpStatus, HttpException, Logger } from '@nestjs/common';
import {
  Homologacion,
  EstatusHomologacion,
} from '../../../domain/homologaciones/entity/homologacion.entity';
import { HomologacionRepository } from '../../../domain/homologaciones/repository/homologacion.repository';
import { EstudianteRepository } from '../../../domain/estudiante/repository/estudiante.repository';
import { HomologacionDto } from 'src/domain/homologaciones/dto/homologacion.dto';
import { DocumentosDto } from 'src/domain/documents/dto/documentos.dto';

@Injectable()
export class HomologacionService {
  private readonly logger = new Logger(HomologacionService.name);
  
  constructor(
    @Inject('HomologacionRepository')
    private readonly homologacionRepository: HomologacionRepository,
    @Inject('EstudianteRepository')
    private readonly estudianteRepository: EstudianteRepository,
  ) {}

  async crearHomologacion(homologacionDto: HomologacionDto) {
    try {
      const estudiante = await this.estudianteRepository.findById(
        homologacionDto.estudianteId,
      );

      if (!estudiante) {
        throw new Error(
          `No existe un estudiante con el id ${homologacionDto.estudianteId}`,
        );
      }

      const homologacion = new Homologacion({
        estudianteId: homologacionDto.estudianteId,
        carreraCun: homologacionDto.carreraCun,
        estatus: homologacionDto.estatus,
        jornada: homologacionDto.jornada,
        modalidad: homologacionDto.modalidad,
        ciudad: homologacionDto.ciudad,
        institucion: homologacionDto.institucion,
        carreraHom: homologacionDto.carreraHom,
        fechaGrado: homologacionDto.fechaGrado,
        nivelEstudio: homologacionDto.nivelEstudio,
      });

      const nuevaHomologacion = await this.homologacionRepository.create(homologacion);

      return {
        message: 'Homologación creada exitosamente',
        data: nuevaHomologacion,
      };
    } catch (error) {
      this.logger.error(`Error al crear homologación: ${error.message}`, error.stack);
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async obtenerHomologacionPorId(id: string) {
    try {
      const homologacion = await this.homologacionRepository.findById(id);

      if (!homologacion) {
        throw new Error(`No existe una homologación con el id ${id}`);
      }

      return {
        message: 'Homologación recuperada exitosamente',
        data: homologacion,
      };
    } catch (error) {
      this.logger.error(`Error al obtener homologación por ID: ${error.message}`, error.stack);
      
      if (error.message.includes('No existe una homologación')) {
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

  async obtenerHomologacionesPorEstudianteId(estudianteId: string) {
    try {
      const homologaciones = await this.homologacionRepository.findByEstudianteId(estudianteId);

      return {
        message: 'Homologaciones recuperadas exitosamente',
        data: homologaciones,
      };
    } catch (error) {
      this.logger.error(`Error al obtener homologaciones por estudiante: ${error.message}`, error.stack);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async obtenerHomologacionesPorEstatus(estatus?: EstatusHomologacion) {
    try {
      if (!estatus) {
        throw new Error('Debe especificar un estatus para filtrar las homologaciones');
      }

      const homologaciones = await this.homologacionRepository.findByEstatus(estatus);

      return {
        message: 'Homologaciones recuperadas exitosamente',
        data: homologaciones,
      };
    } catch (error) {
      this.logger.error(`Error al obtener homologaciones por estatus: ${error.message}`, error.stack);
      
      if (error.message.includes('Debe especificar un estatus')) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        }, HttpStatus.BAD_REQUEST);
      }

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async actualizarHomologacion(id: string, homologacionDto: HomologacionDto) {
    try {
      const homologacion = await this.homologacionRepository.findById(id);

      if (!homologacion) {
        throw new Error(`No se encontró la homologación con id ${id}`);
      }

      const homologacionActualizada = await this.homologacionRepository.update(id, homologacionDto);

      return {
        message: 'Homologación actualizada exitosamente',
        data: homologacionActualizada,
      };
    } catch (error) {
      this.logger.error(`Error al actualizar homologación: ${error.message}`, error.stack);
      
      if (error.message.includes('No se encontró la homologación')) {
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

  async actualizarEstatusHomologacion(id: string, estatus: EstatusHomologacion) {
    try {
      const homologacion = await this.homologacionRepository.findById(id);

      if (!homologacion) {
        throw new Error(`No se encontró la homologación con id ${id}`);
      }

      const homologacionActualizada = await this.homologacionRepository.updateEstatus(id, estatus);

      return {
        message: 'Estatus de homologación actualizado exitosamente',
        data: homologacionActualizada,
      };
    } catch (error) {
      this.logger.error(`Error al actualizar estatus: ${error.message}`, error.stack);
      
      if (error.message.includes('No se encontró la homologación')) {
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

  async agregarDocumentos(homologacionId: string, documentosDto: Omit<DocumentosDto, 'homologacionId'>) {
    try {
      // Este método debe ser implementado usando ValidarDocumentosUseCase
      // Para evitar dependencias circulares, es mejor llamar a este servicio desde el controlador
      throw new Error('Método no implementado');
    } catch (error) {
      this.logger.error(`Error al agregar documentos: ${error.message}`, error.stack);
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }
}