import { Injectable, Inject, HttpStatus, HttpException, Logger } from '@nestjs/common';
import {
  Homologacion,
  EstatusHomologacion,
} from '../../../domain/homologaciones/entity/homologacion.entity';
import { HomologacionRepository } from '../../../domain/homologaciones/repository/homologacion.repository';
import { EstudianteRepository } from '../../../domain/estudiante/repository/estudiante.repository';
import { DocumentsRepository } from '../../../domain/documents/repository/documents.repository';
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
    @Inject('DocumentsRepository')
    private readonly documentsRepository: DocumentsRepository,
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

  async actualizarEstatusHomologacion(id: string, estatus: EstatusHomologacion, observaciones?: string) {
    try {
      const homologacion = await this.homologacionRepository.findById(id);

      if (!homologacion) {
        throw new Error(`No se encontró la homologación con id ${id}`);
      }

      if (homologacion.estatus === EstatusHomologacion.SIN_DOCUMENTOS && 
          estatus !== EstatusHomologacion.PENDIENTE) {
        throw new Error(`No se puede cambiar de estado 'Sin Documentos' a '${estatus}'. Primero debe pasar a 'Pendiente'`);
      }

      const homologacionActualizada = await this.homologacionRepository.updateEstatus(id, estatus, observaciones);

      return {
        success: true,
        message: `Estatus de homologación actualizado exitosamente a '${estatus}'`,
        data: {
          homologacion: homologacionActualizada,
          observaciones: observaciones || 'No se proporcionaron observaciones',
          cambioRealizado: {
            estatusAnterior: homologacion.estatus,
            nuevoEstatus: estatus,
            fecha: new Date()
          }
        }
      };
    } catch (error) {
      this.logger.error(`Error al actualizar estatus: ${error.message}`, error.stack);
      
      if (error.message.includes('No se encontró la homologación')) {
        throw new HttpException({
          success: false,
          message: error.message,
          error: error.message,
        }, HttpStatus.NOT_FOUND);
      }

      throw new HttpException({
        success: false,
        message: `Error al actualizar estatus de homologación: ${error.message}`,
        error: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async agregarDocumentos(homologacionId: string, documentosDto: Omit<DocumentosDto, 'homologacionId'>) {
    try {
      throw new Error('Método no implementado');
    } catch (error) {
      this.logger.error(`Error al agregar documentos: ${error.message}`, error.stack);
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async obtenerDetallesHomologaciones() {
    try {
      const homologaciones = await this.homologacionRepository.findAll();

      const detalles = await Promise.all(homologaciones.map(async (homologacion) => {
        const estudiante = await this.estudianteRepository.findById(homologacion.estudianteId);
        if (!estudiante) {
          this.logger.warn(`No se encontró estudiante con ID ${homologacion.estudianteId} para homologación ${homologacion.id}`);
          return null;
        }

        let documentos = await this.documentsRepository.findByHomologacionId(homologacion.id);
        let urlsDocumentos: string[] = [];
        
        if (documentos) {
          urlsDocumentos = [
            documentos.urlDocBachiller,
            documentos.urlDocIdentificacion,
            documentos.urlDocTituloHomologar,
            documentos.urlSabanaNotas,
            documentos.urlCartaHomologacion,
            documentos.urlContenidosProgramaticos
          ].filter(url => url != null && url !== undefined);
        }
        
        return {
          fecha: homologacion.createdAt,
          numeroDocumento: estudiante.numeroIdentificacion,
          nombreCompleto: estudiante.nombreCompleto,
          nivelEstudio: homologacion.nivelEstudio || 'No especificado',
          carreraHom: homologacion.carreraHom || 'No especificada',
          carreraCun: homologacion.carreraCun || 'No especificada',
          estado: homologacion.estatus,
          documentos: urlsDocumentos,
          observaciones: homologacion.observaciones || 'Sin observaciones'
        };
      }));
      const detallesFiltrados = detalles.filter(detalle => detalle !== null);
      return {
        message: 'Detalles de homologaciones recuperados exitosamente',
        data: detallesFiltrados,
      };
    } catch (error) {
      this.logger.error(`Error al obtener detalles de homologaciones: ${error.message}`, error.stack);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}