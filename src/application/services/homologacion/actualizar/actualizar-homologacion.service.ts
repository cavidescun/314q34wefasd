import { Inject, Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import {
  Homologacion,
  EstatusHomologacion,
} from '../../../../domain/homologaciones/entity/homologacion.entity';
import { Documents } from '../../../../domain/documents/entity/documents.entity';
import { EstudianteRepository } from '../../../../domain/estudiante/repository/estudiante.repository';
import { HomologacionRepository } from '../../../../domain/homologaciones/repository/homologacion.repository';
import { DocumentsRepository } from '../../../../domain/documents/repository/documents.repository';
import { ActualizarHomologacionDto } from 'src/domain/homologaciones/actualizar-homologacion/dto/actualizar-homologacion.dto';

interface StorageService {
  subirDocumento(
    nombreArchivo: string,
    buffer: Buffer,
    contentType?: string,
  ): Promise<string>;
}

interface ArchivosHomologacion {
  tituloBachiller?: Buffer;
  titulo?: Buffer;
  sabanaNotas?: Buffer;
  cartaHomologacion?: Buffer;
  contenidosProgramaticos?: Buffer;
}

@Injectable()
export class ActualizarHomologacionUseCase {
  private readonly logger = new Logger(ActualizarHomologacionUseCase.name);

  constructor(
    @Inject('EstudianteRepository')
    private readonly estudianteRepository: EstudianteRepository,
    @Inject('HomologacionRepository')
    private readonly homologacionRepository: HomologacionRepository,
    @Inject('DocumentsRepository')
    private readonly documentsRepository: DocumentsRepository,
    @Inject('StorageService')
    private readonly storageService: StorageService,
  ) {}

  async execute(
    dto: ActualizarHomologacionDto,
    archivos: ArchivosHomologacion,
  ) {
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
        throw new Error('No se encontraron homologaciones para este estudiante');
      }

      const homologacion = homologaciones[0];

      const homologacionActualizada = await this.homologacionRepository.update(
        homologacion.id,
        {
          institucion: dto.institucion,
          carreraHom: dto.carreraHom,
          fechaGrado: new Date(dto.fechaGrado),
          updatedAt: new Date(),
        },
      );

      let documents = await this.documentsRepository.findByHomologacionId(
        homologacion.id,
      );

      const documentosData: Partial<Documents> = {
        homologacionId: homologacion.id,
        updatedAt: new Date(),
      };

      const archivosSubidos: string[] = [];

      if (archivos.tituloBachiller) {
        const nombreArchivo = `${dto.numeroIdentificacion}/titulo-bachiller.pdf`;
        const urlDocBachiller = await this.storageService.subirDocumento(
          nombreArchivo,
          archivos.tituloBachiller,
          'application/pdf',
        );
        documentosData.urlDocBachiller = urlDocBachiller;
        archivosSubidos.push('título de bachiller');
      }

      if (archivos.titulo) {
        const nombreArchivo = `${dto.numeroIdentificacion}/titulo-homologar.pdf`;
        const urlDocTituloHomologar = await this.storageService.subirDocumento(
          nombreArchivo,
          archivos.titulo,
          'application/pdf',
        );
        documentosData.urlDocTituloHomologar = urlDocTituloHomologar;
        archivosSubidos.push('título a homologar');
      }

      if (archivos.sabanaNotas) {
        const nombreArchivo = `${dto.numeroIdentificacion}/sabana-notas.pdf`;
        const urlSabanaNotas = await this.storageService.subirDocumento(
          nombreArchivo,
          archivos.sabanaNotas,
          'application/pdf',
        );
        documentosData.urlSabanaNotas = urlSabanaNotas;
        archivosSubidos.push('sabana de notas');
      }

      if (archivos.cartaHomologacion) {
        const nombreArchivo = `${dto.numeroIdentificacion}/carta-homologacion.pdf`;
        const urlCartaHomologacion = await this.storageService.subirDocumento(
          nombreArchivo,
          archivos.cartaHomologacion,
          'application/pdf',
        );
        documentosData.urlCartaHomologacion = urlCartaHomologacion;
        archivosSubidos.push('carta de homologación');
      }

      if (archivos.contenidosProgramaticos) {
        const nombreArchivo = `${dto.numeroIdentificacion}/contenidos-programaticos.pdf`;
        const urlContenidosProgramaticos = await this.storageService.subirDocumento(
          nombreArchivo,
          archivos.contenidosProgramaticos,
          'application/pdf',
        );
        documentosData.urlContenidosProgramaticos = urlContenidosProgramaticos;
        archivosSubidos.push('contenidos programáticos');
      }

      if (documents) {
        documents = await this.documentsRepository.update(
          documents.id,
          documentosData,
        );
      } else {
        documents = await this.documentsRepository.create(
          new Documents({
            ...(documentosData as any),
            createdAt: new Date(),
          }),
        );
      }

      if (archivosSubidos.length > 0) {
        await this.homologacionRepository.updateEstatus(
          homologacion.id,
          EstatusHomologacion.PENDIENTE,
        );
        this.logger.log(
          `Estatus de homologación actualizado a: ${EstatusHomologacion.PENDIENTE}`,
        );
      }
      
      return {
        success: true,
        message: `Homologación actualizada correctamente. Archivos procesados: ${archivosSubidos.join(', ')}`,
        data: {
          homologacion: homologacionActualizada,
          documents,
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
        message: error.message || 'Error al actualizar la homologación',
        error: error.message,
      }, status);
    }
  }
}