import {
  Inject,
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
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
    numeroIdentificacion: string,
    tipoDocumento: string,
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
      this.logger.log(
        `Iniciando actualización de homologación para estudiante con ID: ${dto.numeroIdentificacion}`,
      );

      const hayArchivos = !!(
        archivos.tituloBachiller ||
        archivos.titulo ||
        archivos.sabanaNotas ||
        archivos.cartaHomologacion ||
        archivos.contenidosProgramaticos
      );

      if (!hayArchivos) {
        this.logger.warn('No se han proporcionado archivos para subir');
      } else {
        this.logger.log(
          'Se han detectado archivos para subir. El estatus de homologación se actualizará a Pendiente si se suben correctamente.',
        );
      }
      const estudiante =
        await this.estudianteRepository.findByNumeroIdentificacion(
          dto.numeroIdentificacion,
        );

      if (!estudiante) {
        this.logger.error(
          `Estudiante no encontrado con identificación: ${dto.numeroIdentificacion}`,
        );
        throw new Error(
          `No se encontró un estudiante con número de identificación: ${dto.numeroIdentificacion}`,
        );
      }

      const homologaciones =
        await this.homologacionRepository.findByEstudianteId(estudiante.id);

      if (!homologaciones || homologaciones.length === 0) {
        throw new Error(
          'No se encontraron homologaciones para este estudiante',
        );
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
        this.logger.log('Subiendo título de bachiller...');
        try {
          const urlDocBachiller = await this.storageService.subirDocumento(
            dto.numeroIdentificacion,
            'doc_bachiller',
            archivos.tituloBachiller,
            'application/pdf',
          );
          documentosData.urlDocBachiller = urlDocBachiller;
          archivosSubidos.push('título de bachiller');
          this.logger.log(
            `Título de bachiller subido. URL: ${urlDocBachiller}`,
          );
        } catch (error) {
          this.logger.error(
            `Error al subir título de bachiller: ${error.message}`,
            error.stack,
          );
          throw new Error(
            `Error al subir título de bachiller: ${error.message}`,
          );
        }
      }

      if (archivos.titulo) {
        this.logger.log('Subiendo título a homologar...');
        try {
          const urlDocTituloHomologar =
            await this.storageService.subirDocumento(
              dto.numeroIdentificacion,
              'doc_titulo_homologar',
              archivos.titulo,
              'application/pdf',
            );
          documentosData.urlDocTituloHomologar = urlDocTituloHomologar;
          archivosSubidos.push('título a homologar');
          this.logger.log(
            `Título a homologar subido. URL: ${urlDocTituloHomologar}`,
          );
        } catch (error) {
          this.logger.error(
            `Error al subir título a homologar: ${error.message}`,
            error.stack,
          );
          throw new Error(
            `Error al subir título a homologar: ${error.message}`,
          );
        }
      }

      if (archivos.sabanaNotas) {
        this.logger.log('Subiendo sábana de notas...');
        try {
          const urlSabanaNotas = await this.storageService.subirDocumento(
            dto.numeroIdentificacion,
            'sabana_notas',
            archivos.sabanaNotas,
            'application/pdf',
          );
          documentosData.urlSabanaNotas = urlSabanaNotas;
          archivosSubidos.push('sabana de notas');
          this.logger.log(`Sábana de notas subida. URL: ${urlSabanaNotas}`);
        } catch (error) {
          this.logger.error(
            `Error al subir sábana de notas: ${error.message}`,
            error.stack,
          );
          throw new Error(`Error al subir sábana de notas: ${error.message}`);
        }
      }

      if (archivos.cartaHomologacion) {
        this.logger.log('Subiendo carta de homologación...');
        try {
          const urlCartaHomologacion = await this.storageService.subirDocumento(
            dto.numeroIdentificacion,
            'carta_homologacion',
            archivos.cartaHomologacion,
            'application/pdf',
          );
          documentosData.urlCartaHomologacion = urlCartaHomologacion;
          archivosSubidos.push('carta de homologación');
          this.logger.log(
            `Carta de homologación subida. URL: ${urlCartaHomologacion}`,
          );
        } catch (error) {
          this.logger.error(
            `Error al subir carta de homologación: ${error.message}`,
            error.stack,
          );
          throw new Error(
            `Error al subir carta de homologación: ${error.message}`,
          );
        }
      }

      if (archivos.contenidosProgramaticos) {
        this.logger.log('Subiendo contenidos programáticos...');
        try {
          const urlContenidosProgramaticos =
            await this.storageService.subirDocumento(
              dto.numeroIdentificacion,
              'contenidos_programaticos',
              archivos.contenidosProgramaticos,
              'application/pdf',
            );
          documentosData.urlContenidosProgramaticos =
            urlContenidosProgramaticos;
          archivosSubidos.push('contenidos programáticos');
          this.logger.log(
            `Contenidos programáticos subidos. URL: ${urlContenidosProgramaticos}`,
          );
        } catch (error) {
          this.logger.error(
            `Error al subir contenidos programáticos: ${error.message}`,
            error.stack,
          );
          throw new Error(
            `Error al subir contenidos programáticos: ${error.message}`,
          );
        }
      }
      let documentosActualizados;
      if (documents) {
        this.logger.log(
          `Actualizando documentos existentes con ID: ${documents.id}`,
        );
        documentosActualizados = await this.documentsRepository.update(
          documents.id,
          documentosData,
        );
      } else {
        this.logger.log('Creando nuevo registro de documentos');
        documentosActualizados = await this.documentsRepository.create(
          new Documents({
            ...(documentosData as any),
            createdAt: new Date(),
          }),
        );
      }

      if (archivosSubidos.length > 0) {
        this.logger.log(
          `Actualizando estatus de homologación a: ${EstatusHomologacion.PENDIENTE}`,
        );
        try {
          await this.homologacionRepository.updateEstatus(
            homologacion.id,
            EstatusHomologacion.PENDIENTE,
          );
          this.logger.log(
            `Estatus de homologación actualizado exitosamente a: ${EstatusHomologacion.PENDIENTE}`,
          );
        } catch (updateError) {
          this.logger.error(
            `Error al actualizar estatus de homologación: ${updateError.message}`,
            updateError.stack,
          );
          throw new Error(
            `Error al actualizar estatus de homologación: ${updateError.message}`,
          );
        }
      } else {
        this.logger.log(
          'No se subieron archivos, el estatus de homologación no será actualizado',
        );
      }

      this.logger.log('Actualización de homologación completada exitosamente');

      let mensaje = `Homologación actualizada correctamente.`;

      if (archivosSubidos.length > 0) {
        mensaje += ` Archivos procesados: ${archivosSubidos.join(', ')}.`;
        mensaje += ` El estado de la homologación ha sido actualizado a "${EstatusHomologacion.PENDIENTE}".`;
      }

      return {
        success: true,
        message: mensaje,
        data: {
          homologacion: homologacionActualizada,
          documents: documentosActualizados,
          estatusActualizado:
            archivosSubidos.length > 0 ? EstatusHomologacion.PENDIENTE : null,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error en actualización de homologación: ${error.message}`,
      );
      this.logger.error(`Stack trace: ${error.stack}`);

      let status = HttpStatus.INTERNAL_SERVER_ERROR;

      if (
        error.message.includes('No se encontró un estudiante') ||
        error.message.includes('No se encontraron homologaciones')
      ) {
        status = HttpStatus.NOT_FOUND;
      } else {
        status = HttpStatus.BAD_REQUEST;
      }

      throw new HttpException(
        {
          success: false,
          message: error.message || 'Error al actualizar la homologación',
          error: error.message,
        },
        status,
      );
    }
  }
}
