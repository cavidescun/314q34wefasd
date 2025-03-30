import { Injectable, Inject, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { Documents } from '../../../domain/documents/entity/documents.entity';
import { DocumentsRepository } from '../../../domain/documents/repository/documents.repository';
import { HomologacionRepository } from '../../../domain/homologaciones/repository/homologacion.repository';
import { EstudianteRepository } from '../../../domain/estudiante/repository/estudiante.repository';
import { DocumentosDto } from 'src/domain/documents/dto/documentos.dto';
import { DocumentUrlDto, DocumentTipoEnum } from 'src/domain/documents/document_url/dto/document_url.dto';

interface StorageService {
  subirDocumento(
    numeroIdentificacion: string,
    tipoDocumento: string,
    buffer: Buffer,
    contentType?: string,
  ): Promise<string>;
}

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);
  
  constructor(
    @Inject('DocumentsRepository')
    private readonly documentsRepository: DocumentsRepository,
    @Inject('HomologacionRepository')
    private readonly homologacionRepository: HomologacionRepository,
    @Inject('EstudianteRepository')
    private readonly estudianteRepository: EstudianteRepository,
    @Inject('StorageService')
    private readonly storageService: StorageService,
  ) {}

  async createDocuments(documents: Documents): Promise<Documents> {
    try {
      const homologacion = await this.homologacionRepository.findById(
        documents.homologacionId,
      );

      if (!homologacion) {
        throw new Error(
          `No existe una homologación con el id ${documents.homologacionId}`,
        );
      }
      
      const existingDocuments =
        await this.documentsRepository.findByHomologacionId(
          documents.homologacionId,
        );

      if (existingDocuments) {
        throw new Error(
          `Ya existen documentos para la homologación con id ${documents.homologacionId}`,
        );
      }

      documents.createdAt = new Date();
      documents.updatedAt = new Date();

      return this.documentsRepository.create(documents);
    } catch (error) {
      this.logger.error(`Error al crear documentos: ${error.message}`, error.stack);
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async obtenerDocumentosPorId(id: number) {
    try {
      const documents = await this.documentsRepository.findById(id);

      if (!documents) {
        throw new Error(`No existen documentos con el id ${id}`);
      }

      return {
        message: 'Documentos recuperados exitosamente',
        data: documents,
      };
    } catch (error) {
      this.logger.error(`Error al obtener documentos por ID: ${error.message}`, error.stack);
      
      if (error.message.includes('No existen documentos')) {
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

  async obtenerDocumentosPorHomologacionId(homologacionId: string) {
    try {
      const documents = await this.documentsRepository.findByHomologacionId(homologacionId);

      if (!documents) {
        throw new Error(`No existen documentos para la homologación con id ${homologacionId}`);
      }

      return {
        message: 'Documentos recuperados exitosamente',
        data: documents,
      };
    } catch (error) {
      this.logger.error(`Error al obtener documentos por homologación: ${error.message}`, error.stack);
      
      if (error.message.includes('No existen documentos')) {
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

  async actualizarDocumentos(id: number, data: Partial<Documents>) {
    try {
      const documents = await this.documentsRepository.findById(id);

      if (!documents) {
        throw new Error(`No se encontraron los documentos con id ${id}`);
      }

      const updatedData = { 
        ...data,
        updatedAt: new Date(),
      };

      const documentsActualizados = await this.documentsRepository.update(id, updatedData);

      return {
        message: 'Documentos actualizados exitosamente',
        data: documentsActualizados,
      };
    } catch (error) {
      this.logger.error(`Error al actualizar documentos: ${error.message}`, error.stack);
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async actualizarUrlDocumento(id: number, documentUrlDto: DocumentUrlDto) {
    try {
      if (!Object.values(DocumentTipoEnum).includes(documentUrlDto.tipo)) {
        throw new Error(`El tipo de documento '${documentUrlDto.tipo}' no es válido`);
      }

      const documents = await this.documentsRepository.findById(id);

      if (!documents) {
        throw new Error(`No se encontraron los documentos con id ${id}`);
      }

      // Obtenemos la homologación para obtener el estudiante asociado
      const homologacion = await this.homologacionRepository.findById(documents.homologacionId);
      if (!homologacion) {
        throw new Error(`No se encontró la homologación asociada a los documentos`);
      }

      // Obtenemos el estudiante para obtener el número de identificación
      const estudiante = await this.estudianteRepository.findById(homologacion.estudianteId);
      if (!estudiante) {
        throw new Error(`No se encontró el estudiante asociado a la homologación`);
      }

      const documentsActualizados = await this.documentsRepository.updateDocumentUrl(
        id,
        documentUrlDto.tipo,
        documentUrlDto.url,
      );

      return {
        message: 'Documento actualizado exitosamente',
        data: documentsActualizados,
      };
    } catch (error) {
      this.logger.error(`Error al actualizar URL de documento: ${error.message}`, error.stack);
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }
  
  // Nuevo método para subir un documento
  async subirDocumento(id: number, tipoDocumento: DocumentTipoEnum, archivo: Buffer) {
    try {
      const documents = await this.documentsRepository.findById(id);

      if (!documents) {
        throw new Error(`No se encontraron los documentos con id ${id}`);
      }

      // Obtenemos la homologación para obtener el estudiante asociado
      const homologacion = await this.homologacionRepository.findById(documents.homologacionId);
      if (!homologacion) {
        throw new Error(`No se encontró la homologación asociada a los documentos`);
      }

      // Obtenemos el estudiante para obtener el número de identificación
      const estudiante = await this.estudianteRepository.findById(homologacion.estudianteId);
      if (!estudiante) {
        throw new Error(`No se encontró el estudiante asociado a la homologación`);
      }

      // Mapear el tipo de documento a un nombre de archivo
      let tipoArchivo = '';
      switch (tipoDocumento) {
        case DocumentTipoEnum.URL_DOC_BACHILLER:
          tipoArchivo = 'titulo_bachiller';
          break;
        case DocumentTipoEnum.URL_DOC_IDENTIFICACION:
          tipoArchivo = 'doc_identificacion';
          break;
        case DocumentTipoEnum.URL_DOC_TITULO_HOMOLOGAR:
          tipoArchivo = 'titulo_homologar';
          break;
        case DocumentTipoEnum.URL_SABANA_NOTAS:
          tipoArchivo = 'sabana_notas';
          break;
        case DocumentTipoEnum.URL_CARTA_HOMOLOGACION:
          tipoArchivo = 'carta_homologacion';
          break;
        case DocumentTipoEnum.URL_CONTENIDOS_PROGRAMATICOS:
          tipoArchivo = 'contenidos_programaticos';
          break;
        default:
          tipoArchivo = 'documento';
      }

      // Subir el documento a S3
      const url = await this.storageService.subirDocumento(
        estudiante.numeroIdentificacion,
        tipoArchivo,
        archivo,
        'application/pdf'
      );

      // Actualizar la URL en la base de datos
      const documentsActualizados = await this.documentsRepository.updateDocumentUrl(
        id,
        tipoDocumento,
        url,
      );

      return {
        message: 'Documento subido y registrado exitosamente',
        data: documentsActualizados,
      };
    } catch (error) {
      this.logger.error(`Error al subir documento: ${error.message}`, error.stack);
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }
}