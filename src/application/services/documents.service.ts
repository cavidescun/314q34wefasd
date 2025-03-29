import { Injectable, Inject } from '@nestjs/common';
import { Documents } from '../../domain/documents/entity/documents.entity';
import { DocumentsRepository } from '../../domain/documents/repository/documents.repository';
import { HomologacionRepository } from '../../domain/homologaciones/repository/homologacion.repository';

@Injectable()
export class DocumentsService {
  constructor(
    @Inject('DocumentsRepository')
    private readonly documentsRepository: DocumentsRepository,
    @Inject('HomologacionRepository')
    private readonly homologacionRepository: HomologacionRepository,
  ) {}

  async createDocuments(documents: Documents): Promise<Documents> {
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
  }

  async getDocumentsById(id: number): Promise<Documents | null> {
    return this.documentsRepository.findById(id);
  }

  async getDocumentsByHomologacionId(
    homologacionId: string,
  ): Promise<Documents | null> {
    return this.documentsRepository.findByHomologacionId(homologacionId);
  }

  async updateDocuments(
    id: number,
    data: Partial<Documents>,
  ): Promise<Documents> {
    const documents = await this.documentsRepository.findById(id);

    if (!documents) {
      throw new Error(`No se encontraron los documentos con id ${id}`);
    }

    data.updatedAt = new Date();

    return this.documentsRepository.update(id, data);
  }

  async updateDocumentUrl(
    id: number,
    documentType: string,
    url: string,
  ): Promise<Documents> {
    const documents = await this.documentsRepository.findById(id);

    if (!documents) {
      throw new Error(`No se encontraron los documentos con id ${id}`);
    }

    return this.documentsRepository.updateDocumentUrl(id, documentType, url);
  }
}
