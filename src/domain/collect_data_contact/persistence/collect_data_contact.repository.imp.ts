import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CollectDataContactTypeORM } from './typeorm/collect_data_contact.entity';
import { CollectDataContactRepository } from 'src/domain/collect_data_contact/repository/collect_data_contact.repository';
import { CollectDataContact } from 'src/domain/collect_data_contact/entity/collect_data_contact.entity';

@Injectable()
export class CollectDataContactRepositoryImpl
  implements CollectDataContactRepository
{
  constructor(
    @InjectRepository(CollectDataContactTypeORM)
    private readonly collectDataContactRepository: Repository<CollectDataContactTypeORM>,
  ) {}

  private toEntity(orm: CollectDataContactTypeORM): CollectDataContact {
    return new CollectDataContact({
      id: orm.id,
      celular: orm.celular,
      email: orm.email,
    });
  }

  private toORM(entity: CollectDataContact): CollectDataContactTypeORM {
    const orm = new CollectDataContactTypeORM();
    if (entity.id) {
      orm.id = entity.id;
    }
    orm.celular = entity.celular;
    orm.email = entity.email;
    return orm;
  }

  async findById(id: number): Promise<CollectDataContact | null> {
    const orm = await this.collectDataContactRepository.findOne({
      where: { id },
    });
    return orm ? this.toEntity(orm) : null;
  }

  async findByCelular(celular: string): Promise<CollectDataContact | null> {
    const orm = await this.collectDataContactRepository.findOne({
      where: { celular },
    });
    return orm ? this.toEntity(orm) : null;
  }

  async findByEmail(email: string): Promise<CollectDataContact | null> {
    const orm = await this.collectDataContactRepository.findOne({
      where: { email },
    });
    return orm ? this.toEntity(orm) : null;
  }

  async create(
    collectDataContact: CollectDataContact,
  ): Promise<CollectDataContact> {
    const ormEntity = this.toORM(collectDataContact);
    const savedEntity = await this.collectDataContactRepository.save(ormEntity);
    return this.toEntity(savedEntity);
  }

  async update(
    id: number,
    collectDataContact: Partial<CollectDataContact>,
  ): Promise<CollectDataContact> {
    await this.collectDataContactRepository.update(id, collectDataContact);

    const updated = await this.collectDataContactRepository.findOne({
      where: { id },
    });
    if (!updated) {
      throw new Error(`No existe un registro de contacto con id ${id}`);
    }

    return this.toEntity(updated);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.collectDataContactRepository.delete(id);
    return (
      result.affected !== undefined &&
      result.affected !== null &&
      result.affected > 0
    );
  }

  async findAll(): Promise<CollectDataContact[]> {
    const orms = await this.collectDataContactRepository.find();
    return orms.map((orm) => this.toEntity(orm));
  }
}
