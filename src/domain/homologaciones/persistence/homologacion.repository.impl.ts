import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { HomologacionTypeORM } from './typeorm/homologaciones.entity';
import { HomologacionRepository } from '../repository/homologacion.repository';
import {
  Homologacion,
  EstatusHomologacion,
} from '../entity/homologacion.entity';

@Injectable()
export class HomologacionRepositoryImpl implements HomologacionRepository {
  constructor(
    @InjectRepository(HomologacionTypeORM)
    private readonly homologacionRepository: Repository<HomologacionTypeORM>,
  ) {}

  private toEntity(orm: HomologacionTypeORM): Homologacion {
    return new Homologacion({
      id: orm.id,
      numeroHomologacion: orm.numeroHomologacion,
      estudianteId: orm.estudianteId,
      carreraCun: orm.carreraCun === null ? undefined : orm.carreraCun,
      estatus: orm.estatus as EstatusHomologacion,
      jornada: orm.jornada === null ? undefined : orm.jornada,
      modalidad: orm.modalidad === null ? undefined : orm.modalidad,
      ciudad: orm.ciudad === null ? undefined : orm.ciudad,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      institucion: orm.institucion === null ? undefined : orm.institucion,
      carreraHom: orm.carreraHom === null ? undefined : orm.carreraHom,
      fechaGrado: orm.fechaGrado === null ? undefined : orm.fechaGrado,
      nivelEstudio: orm.nivelEstudio === null ? undefined : orm.nivelEstudio,
      observaciones: orm.observaciones === null ? undefined : orm.observaciones,
      // Nuevos campos
      codPensum: orm.codPensum === null ? undefined : orm.codPensum,
      codUnidad: orm.codUnidad === null ? undefined : orm.codUnidad,
      periodo: orm.periodo === null ? undefined : orm.periodo,
      semestre: orm.semestre === null ? undefined : orm.semestre,
    });
  }

  private toORM(entity: Homologacion): HomologacionTypeORM {
    const orm = new HomologacionTypeORM();
    orm.id = entity.id || uuidv4();
    orm.estudianteId = entity.estudianteId;
    orm.carreraCun = entity.carreraCun || null;
    orm.estatus = entity.estatus;
    orm.jornada = entity.jornada || null;
    orm.modalidad = entity.modalidad || null;
    orm.ciudad = entity.ciudad || null;
    orm.createdAt = entity.createdAt;
    orm.updatedAt = entity.updatedAt;
    orm.institucion = entity.institucion || null;
    orm.carreraHom = entity.carreraHom || null;
    orm.fechaGrado = entity.fechaGrado || null;
    orm.nivelEstudio = entity.nivelEstudio || null;
    orm.observaciones = entity.observaciones || null;
    // Nuevos campos
    orm.codPensum = entity.codPensum || null;
    orm.codUnidad = entity.codUnidad || null;
    orm.periodo = entity.periodo || null;
    orm.semestre = entity.semestre || null;
    return orm;
  }

  async findById(id: string): Promise<Homologacion | null> {
    const orm = await this.homologacionRepository.findOne({ where: { id } });
    return orm ? this.toEntity(orm) : null;
  }

  async findByEstudianteId(estudianteId: string): Promise<Homologacion[]> {
    const orms = await this.homologacionRepository.find({
      where: { estudianteId },
    });
    return orms.map((orm) => this.toEntity(orm));
  }

  async findByEstatus(estatus: EstatusHomologacion): Promise<Homologacion[]> {
    const orms = await this.homologacionRepository.find({
      where: { estatus },
    });
    return orms.map((orm) => this.toEntity(orm));
  }

  async create(homologacion: Homologacion): Promise<Homologacion> {
    const ormEntity = this.toORM(homologacion);
    const savedEntity = await this.homologacionRepository.save(ormEntity);
    return this.toEntity(savedEntity);
  }

  async update(
    id: string,
    homologacion: Partial<Homologacion>,
  ): Promise<Homologacion> {
    await this.homologacionRepository.update(id, homologacion);
    const updated = await this.homologacionRepository.findOne({
      where: { id },
    });
    if (!updated) {
      throw new Error(`No existe una homologación con id ${id}`);
    }
    return this.toEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.homologacionRepository.delete(id);
    return (
      result.affected !== undefined &&
      result.affected !== null &&
      result.affected > 0
    );
  }

  async updateEstatus(
    id: string,
    estatus: EstatusHomologacion,
    observaciones?: string,
  ): Promise<Homologacion> {
    const updateData: any = {
      estatus,
      updatedAt: new Date(),
    };

    if (observaciones !== undefined) {
      updateData.observaciones = observaciones;
    }

    await this.homologacionRepository.update(id, updateData);

    const updated = await this.homologacionRepository.findOne({
      where: { id },
    });
    if (!updated) {
      throw new Error(`No existe una homologación con id ${id}`);
    }
    return this.toEntity(updated);
  }

  async findAll(): Promise<Homologacion[]> {
    const orms = await this.homologacionRepository.find();
    return orms.map((orm) => this.toEntity(orm));
  }
}
