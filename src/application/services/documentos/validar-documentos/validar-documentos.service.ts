import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Documents } from '../../../../domain/documents/entity/documents.entity';
import { DocumentsService } from '../documents.service';
import { HomologacionService } from '../../homologacion/homologacion.service';
import { DocumentosDto } from 'src/domain/documents/dto/documentos.dto';
import { EstatusHomologacion } from '../../../../domain/homologaciones/entity/homologacion.entity';

@Injectable()
export class ValidarDocumentosUseCase {
  private readonly logger = new Logger(ValidarDocumentosUseCase.name);

  constructor(
    private readonly documentsService: DocumentsService,
    private readonly homologacionService: HomologacionService,
  ) {}

  async execute(documentosDto: DocumentosDto): Promise<Documents> {
    try {
      let existingDocuments: Documents | null = null;
      try {
        const result = await this.documentsService.obtenerDocumentosPorHomologacionId(
          documentosDto.homologacionId
        );
        if (result && result.data) {
          existingDocuments = result.data as Documents;
        }
      } catch (error) {
        
      }

      let documents: Documents;
      if (existingDocuments) {
        const updateData = {
          homologacionId: documentosDto.homologacionId,
          urlDocBachiller: documentosDto.urlDocBachiller,
          urlDocIdentificacion: documentosDto.urlDocIdentificacion,
          urlDocTituloHomologar: documentosDto.urlDocTituloHomologar,
          urlSabanaNotas: documentosDto.urlSabanaNotas,
          urlCartaHomologacion: documentosDto.urlCartaHomologacion,
          urlContenidosProgramaticos: documentosDto.urlContenidosProgramaticos,
        };
        const result = await this.documentsService.actualizarDocumentos(existingDocuments.id, updateData);
        documents = result.data as Documents;
      } else {
        const newDocuments = new Documents({
          homologacionId: documentosDto.homologacionId,
          urlDocBachiller: documentosDto.urlDocBachiller,
          urlDocIdentificacion: documentosDto.urlDocIdentificacion,
          urlDocTituloHomologar: documentosDto.urlDocTituloHomologar,
          urlSabanaNotas: documentosDto.urlSabanaNotas,
          urlCartaHomologacion: documentosDto.urlCartaHomologacion,
          urlContenidosProgramaticos: documentosDto.urlContenidosProgramaticos,
        });
        const result = await this.documentsService.createDocuments(newDocuments);
        documents = result as Documents;
      }

      // Usando el método corregido para actualizar estatus
      await this.homologacionService.actualizarEstatusHomologacion(
        documentosDto.homologacionId,
        EstatusHomologacion.PENDIENTE,
      );

      return documents;
    } catch (error) {
      this.logger.error(`Error al validar documentos: ${error.message}`, error.stack);
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }
}