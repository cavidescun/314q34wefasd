import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { InstitucionTypeORM } from './typeorm/institucion.entity';
import { InstitucionRepository } from '../repository/institucion.repository';
import { Institucion } from '../entity/institucion.entity';

@Injectable()
export class InstitucionRepositoryImpl implements InstitucionRepository {
  constructor(
    @InjectRepository(InstitucionTypeORM)
    private readonly institucionRepository: Repository<InstitucionTypeORM>,
  ) {}

  private toEntity(orm: InstitucionTypeORM): Institucion {
    return new Institucion({
      idInstitucion: orm.idInstitucion,
      nombreInst: orm.nombreInst,
    });
  }

  private toORM(entity: Institucion): InstitucionTypeORM {
    const orm = new InstitucionTypeORM();
    orm.idInstitucion = entity.idInstitucion;
    orm.nombreInst = entity.nombreInst;
    return orm;
  }

  async findById(idInstitucion: number): Promise<Institucion | null> {
    const orm = await this.institucionRepository.findOne({
      where: { idInstitucion },
    });
    return orm ? this.toEntity(orm) : null;
  }

  async findAll(): Promise<Institucion[]> {
    const orms = await this.institucionRepository.find();
    return orms.map((orm) => this.toEntity(orm));
  }

  async create(institucion: Institucion): Promise<Institucion> {
    const ormEntity = this.toORM(institucion);
    const savedEntity = await this.institucionRepository.save(ormEntity);
    return this.toEntity(savedEntity);
  }

  async update(
    idInstitucion: number,
    institucion: Partial<Institucion>,
  ): Promise<Institucion> {
    await this.institucionRepository.update(idInstitucion, institucion);
    const updated = await this.institucionRepository.findOne({
      where: { idInstitucion },
    });
    if (!updated) {
      throw new Error(`No existe una institución con id ${idInstitucion}`);
    }
    return this.toEntity(updated);
  }

  async delete(idInstitucion: number): Promise<boolean> {
    const result = await this.institucionRepository.delete(idInstitucion);
    return (
      result.affected !== undefined &&
      result.affected !== null &&
      result.affected > 0
    );
  }
}