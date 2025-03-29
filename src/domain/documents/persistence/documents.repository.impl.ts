import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DocumentsTypeORM } from './typeorm/documents.entity';
import { DocumentsRepository } from '../repository/documents.repository';
import { Documents } from '../entity/documents.entity';

@Injectable()
export class DocumentsRepositoryImpl implements DocumentsRepository {
  constructor(
    @InjectRepository(DocumentsTypeORM)
    private readonly documentsRepository: Repository<DocumentsTypeORM>,
  ) {}

  private toEntity(orm: DocumentsTypeORM): Documents {
    return new Documents({
      id: orm.id,
      urlDocBachiller:
        orm.urlDocBachiller === null ? undefined : orm.urlDocBachiller,
      urlDocIdentificacion:
        orm.urlDocIdentificacion === null
          ? undefined
          : orm.urlDocIdentificacion,
      urlDocTituloHomologar:
        orm.urlDocTituloHomologar === null
          ? undefined
          : orm.urlDocTituloHomologar,
      urlSabanaNotas:
        orm.urlSabanaNotas === null ? undefined : orm.urlSabanaNotas,
      urlCartaHomologacion:
        orm.urlCartaHomologacion === null
          ? undefined
          : orm.urlCartaHomologacion,
      urlContenidosProgramaticos:
        orm.urlContenidosProgramaticos === null
          ? undefined
          : orm.urlContenidosProgramaticos,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      homologacionId: orm.homologacionId,
    });
  }

  private toORM(entity: Documents): DocumentsTypeORM {
    const orm = new DocumentsTypeORM();
    if (entity.id) {
      orm.id = entity.id;
    }
    orm.urlDocBachiller = entity.urlDocBachiller || null;
    orm.urlDocIdentificacion = entity.urlDocIdentificacion || null;
    orm.urlDocTituloHomologar = entity.urlDocTituloHomologar || null;
    orm.urlSabanaNotas = entity.urlSabanaNotas || null;
    orm.urlCartaHomologacion = entity.urlCartaHomologacion || null;
    orm.urlContenidosProgramaticos = entity.urlContenidosProgramaticos || null;
    orm.createdAt = entity.createdAt;
    orm.updatedAt = entity.updatedAt;
    orm.homologacionId = entity.homologacionId;
    return orm;
  }

  async findById(id: number): Promise<Documents | null> {
    const orm = await this.documentsRepository.findOne({ where: { id } });
    return orm ? this.toEntity(orm) : null;
  }

  async findByHomologacionId(
    homologacionId: string,
  ): Promise<Documents | null> {
    const orm = await this.documentsRepository.findOne({
      where: { homologacionId },
    });
    return orm ? this.toEntity(orm) : null;
  }

  async create(documents: Documents): Promise<Documents> {
    const ormEntity = this.toORM(documents);
    const savedEntity = await this.documentsRepository.save(ormEntity);
    return this.toEntity(savedEntity);
  }

  async update(id: number, documents: Partial<Documents>): Promise<Documents> {
    await this.documentsRepository.update(id, {
      ...documents,
      updatedAt: new Date(),
    });

    const updated = await this.documentsRepository.findOne({ where: { id } });
    if (!updated) {
      throw new Error(`No existen documentos con id ${id}`);
    }

    return this.toEntity(updated);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.documentsRepository.delete(id);
    return (
      result.affected !== undefined &&
      result.affected !== null &&
      result.affected > 0
    );
  }

  async updateDocumentUrl(
    id: number,
    field: string,
    url: string,
  ): Promise<Documents> {
    const document = await this.documentsRepository.findOne({ where: { id } });

    if (!document) {
      throw new Error(`No existen documentos con id ${id}`);
    }

    const fieldMapping: Record<string, keyof DocumentsTypeORM> = {
      urlDocBachiller: 'urlDocBachiller',
      urlDocIdentificacion: 'urlDocIdentificacion',
      urlDocTituloHomologar: 'urlDocTituloHomologar',
      urlSabanaNotas: 'urlSabanaNotas',
      urlCartaHomologacion: 'urlCartaHomologacion',
      urlContenidosProgramaticos: 'urlContenidosProgramaticos',
    };

    let docField = field;
    if (field === 'URL_DOC_BACHILLER') docField = 'urlDocBachiller';
    else if (field === 'URL_DOC_IDENTIFICACION')
      docField = 'urlDocIdentificacion';
    else if (field === 'URL_DOC_TITULO_HOMOLOGAR')
      docField = 'urlDocTituloHomologar';
    else if (field === 'URL_SABANA_NOTAS') docField = 'urlSabanaNotas';
    else if (field === 'URL_CARTA_HOMOLOGACION')
      docField = 'urlCartaHomologacion';
    else if (field === 'URL_CONTENIDOS_PROGRAMATICOS')
      docField = 'urlContenidosProgramaticos';

    if (!fieldMapping[docField]) {
      throw new Error(`El campo ${field} no es válido para actualizar`);
    }

    const updateData: Partial<DocumentsTypeORM> = {
      updatedAt: new Date(),
    };

    const targetField = fieldMapping[docField];

    const updateObject: Partial<DocumentsTypeORM> = {
      updatedAt: new Date(),
    };

    if (targetField === 'urlDocBachiller') updateObject.urlDocBachiller = url;
    else if (targetField === 'urlDocIdentificacion')
      updateObject.urlDocIdentificacion = url;
    else if (targetField === 'urlDocTituloHomologar')
      updateObject.urlDocTituloHomologar = url;
    else if (targetField === 'urlSabanaNotas')
      updateObject.urlSabanaNotas = url;
    else if (targetField === 'urlCartaHomologacion')
      updateObject.urlCartaHomologacion = url;
    else if (targetField === 'urlContenidosProgramaticos')
      updateObject.urlContenidosProgramaticos = url;

    await this.documentsRepository.update(id, updateObject);

    const updated = await this.documentsRepository.findOne({ where: { id } });
    return this.toEntity(updated!);
  }
}
