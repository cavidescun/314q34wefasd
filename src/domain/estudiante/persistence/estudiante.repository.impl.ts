import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { EstudianteTypeORM } from './typeorm/estudiante.entity';
import { EstudianteRepository } from 'src/domain/estudiante/repository/estudiante.repository';
import { Estudiante } from 'src/domain/estudiante/entity/estudiante.entity';

@Injectable()
export class EstudianteRepositoryImpl implements EstudianteRepository {
  constructor(
    @InjectRepository(EstudianteTypeORM)
    private readonly estudianteRepository: Repository<EstudianteTypeORM>,
  ) {}

  private toEntity(orm: EstudianteTypeORM): Estudiante {
    return new Estudiante({
      id: orm.id,
      nombreCompleto: orm.nombreCompleto,
      numeroIdentificacion: orm.numeroIdentificacion,
    });
  }

  private toORM(entity: Estudiante): EstudianteTypeORM {
    const orm = new EstudianteTypeORM();
    orm.id = entity.id || uuidv4();
    orm.nombreCompleto = entity.nombreCompleto;
    orm.numeroIdentificacion = entity.numeroIdentificacion;
    return orm;
  }

  async findById(id: string): Promise<Estudiante | null> {
    const orm = await this.estudianteRepository.findOne({ where: { id } });
    return orm ? this.toEntity(orm) : null;
  }

  async findByNumeroIdentificacion(
    numeroIdentificacion: string,
  ): Promise<Estudiante | null> {
    const orm = await this.estudianteRepository.findOne({
      where: { numeroIdentificacion },
    });
    return orm ? this.toEntity(orm) : null;
  }

  async create(estudiante: Estudiante): Promise<Estudiante> {
    const ormEntity = this.toORM(estudiante);
    const savedEntity = await this.estudianteRepository.save(ormEntity);
    return this.toEntity(savedEntity);
  }

  async update(
    id: string,
    estudiante: Partial<Estudiante>,
  ): Promise<Estudiante> {
    await this.estudianteRepository.update(id, estudiante);
    const updated = await this.estudianteRepository.findOne({ where: { id } });
    if (!updated) {
      throw new Error(`No existe un estudiante con id ${id}`);
    }
    return this.toEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.estudianteRepository.delete(id);
    return (
      result.affected !== undefined &&
      result.affected !== null &&
      result.affected > 0
    );
  }

  async findAll(): Promise<Estudiante[]> {
    const orms = await this.estudianteRepository.find();
    return orms.map((orm) => this.toEntity(orm));
  }
}
