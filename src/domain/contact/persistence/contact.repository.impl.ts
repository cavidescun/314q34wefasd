import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContactTypeORM } from './typeorm/contact.entity';
import { ContactRepository } from '../repository/contact.repository';
import { Contact } from '../entity/contact.entity';

@Injectable()
export class ContactRepositoryImpl implements ContactRepository {
  constructor(
    @InjectRepository(ContactTypeORM)
    private readonly contactRepository: Repository<ContactTypeORM>,
  ) {}

  private toEntity(orm: ContactTypeORM): Contact {
    return new Contact({
      id: orm.id,
      celular: orm.celular,
      numFijo: orm.numFijo === null ? undefined : orm.numFijo,
      email: orm.email,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      estudianteId: orm.estudianteId,
    });
  }

  private toORM(entity: Contact): ContactTypeORM {
    const orm = new ContactTypeORM();
    orm.id = entity.id;
    orm.celular = entity.celular;
    orm.numFijo = entity.numFijo || null;
    orm.email = entity.email;
    orm.createdAt = entity.createdAt;
    orm.updatedAt = entity.updatedAt;
    orm.estudianteId = entity.estudianteId;
    return orm;
  }

  async findById(id: number, estudianteId: string): Promise<Contact | null> {
    const orm = await this.contactRepository.findOne({
      where: { id, estudianteId },
    });
    return orm ? this.toEntity(orm) : null;
  }

  async findByEstudianteId(estudianteId: string): Promise<Contact | null> {
    const orm = await this.contactRepository.findOne({
      where: { estudianteId },
    });
    return orm ? this.toEntity(orm) : null;
  }

  async create(contact: Contact): Promise<Contact> {
    const maxIdResult = await this.contactRepository
      .createQueryBuilder('contact')
      .select('MAX(contact.id_contact)', 'maxId')
      .getRawOne();

    const nextId = maxIdResult && maxIdResult.maxId ? maxIdResult.maxId + 1 : 1;

    const ormEntity = this.toORM(contact);
    ormEntity.id = nextId;

    const savedEntity = await this.contactRepository.save(ormEntity);
    return this.toEntity(savedEntity);
  }

  async update(
    id: number,
    estudianteId: string,
    contact: Partial<Contact>,
  ): Promise<Contact> {
    await this.contactRepository.update({ id, estudianteId }, contact);

    const updated = await this.contactRepository.findOne({
      where: { id, estudianteId },
    });

    if (!updated) {
      throw new Error(
        `No existe un contacto con id ${id} y estudianteId ${estudianteId}`,
      );
    }

    return this.toEntity(updated);
  }

  async delete(id: number, estudianteId: string): Promise<boolean> {
    const result = await this.contactRepository.delete({ id, estudianteId });
    return (
      result.affected !== undefined &&
      result.affected !== null &&
      result.affected > 0
    );
  }
}
