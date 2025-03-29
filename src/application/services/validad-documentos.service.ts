import { Injectable } from '@nestjs/common';
import { Documents } from '../../domain/documents/entity/documents.entity';
import { DocumentsService } from './documents.service';
import { HomologacionService } from './homologacion.service';
import { DocumentosDto } from 'src/domain/documents/dto/documentos.dto';
import { EstatusHomologacion } from '../../domain/homologaciones/entity/homologacion.entity';

@Injectable()
export class ValidarDocumentosUseCase {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly homologacionService: HomologacionService,
  ) {}

  async execute(documentosDto: DocumentosDto): Promise<Documents> {
    const existingDocuments =
      await this.documentsService.getDocumentsByHomologacionId(
        documentosDto.homologacionId,
      );

    if (existingDocuments) {
      return this.documentsService.updateDocuments(existingDocuments.id, {
        urlDocBachiller: documentosDto.urlDocBachiller,
        urlDocIdentificacion: documentosDto.urlDocIdentificacion,
        urlDocTituloHomologar: documentosDto.urlDocTituloHomologar,
        urlSabanaNotas: documentosDto.urlSabanaNotas,
        urlCartaHomologacion: documentosDto.urlCartaHomologacion,
        urlContenidosProgramaticos: documentosDto.urlContenidosProgramaticos,
        updatedAt: new Date(),
      });
    }

    const documents = await this.documentsService.createDocuments(
      new Documents({
        homologacionId: documentosDto.homologacionId,
        urlDocBachiller: documentosDto.urlDocBachiller,
        urlDocIdentificacion: documentosDto.urlDocIdentificacion,
        urlDocTituloHomologar: documentosDto.urlDocTituloHomologar,
        urlSabanaNotas: documentosDto.urlSabanaNotas,
        urlCartaHomologacion: documentosDto.urlCartaHomologacion,
        urlContenidosProgramaticos: documentosDto.urlContenidosProgramaticos,
      }),
    );

    await this.homologacionService.updateEstatusHomologacion(
      documentosDto.homologacionId,
      EstatusHomologacion.PENDIENTE,
    );

    return documents;
  }
}
