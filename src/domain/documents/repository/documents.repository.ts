import { Documents } from '../entity/documents.entity';

export interface DocumentsRepository {
  findById(id: number): Promise<Documents | null>;
  findByHomologacionId(homologacionId: string): Promise<Documents | null>;
  create(documents: Documents): Promise<Documents>;
  update(id: number, documents: Partial<Documents>): Promise<Documents>;
  delete(id: number): Promise<boolean>;
  updateDocumentUrl(id: number, field: string, url: string): Promise<Documents>;
}