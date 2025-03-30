import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SenaTypeORM } from './typeorm/reconocimiento-titulo.entity';
import { SenaRepository } from '../repository/reconocimiento-titulo.repository';
import { Sena } from '../entity/reconocimiento-titulo.entity';

@Injectable()
export class SenaRepositoryImpl implements SenaRepository {
  constructor(
    @InjectRepository(SenaTypeORM)
    private readonly senaRepository: Repository<SenaTypeORM>,
  ) {}

  private toEntity(orm: SenaTypeORM): Sena {
    return new Sena({
      id: orm.id,
      nit_institucion: orm.nit_institucion || '',
      institucion_externa: orm.institucion_externa || '',
      snies: orm.snies || '',
      nivel_ies: orm.nivel_ies || '',
      programa_ies: orm.programa_ies || '',
      id_seccional: orm.id_seccional || '',
      nom_seccional: orm.nom_seccional || '',
      id_sede: orm.id_sede || '',
      nom_sede: orm.nom_sede || '',
      cod_unidad: orm.cod_unidad || '',
      cod_pensum: orm.cod_pensum || '',
      nom_unidad: orm.nom_unidad || '',
      fec_ini_vigencia: orm.fec_ini_vigencia || '',
      fec_fin_vigencia: orm.fec_fin_vigencia || '',
      nom_tabla_met: orm.nom_tabla_met || '',
      nom_tabla_niv: orm.nom_tabla_niv || '',
      id_dependencia: orm.id_dependencia || '',
      nom_dependencia: orm.nom_dependencia || '',
      sem_nivel: orm.sem_nivel || '',
      estado: orm.estado || ''
    });
  }

  private toORM(entity: Sena): SenaTypeORM {
    const orm = new SenaTypeORM();
    orm.id = entity.id;
    orm.nit_institucion = entity.nit_institucion;
    orm.institucion_externa = entity.institucion_externa;
    orm.snies = entity.snies;
    orm.nivel_ies = entity.nivel_ies;
    orm.programa_ies = entity.programa_ies;
    orm.id_seccional = entity.id_seccional;
    orm.nom_seccional = entity.nom_seccional;
    orm.id_sede = entity.id_sede;
    orm.nom_sede = entity.nom_sede;
    orm.cod_unidad = entity.cod_unidad;
    orm.cod_pensum = entity.cod_pensum;
    orm.nom_unidad = entity.nom_unidad;
    orm.fec_ini_vigencia = entity.fec_ini_vigencia;
    orm.fec_fin_vigencia = entity.fec_fin_vigencia;
    orm.nom_tabla_met = entity.nom_tabla_met;
    orm.nom_tabla_niv = entity.nom_tabla_niv;
    orm.id_dependencia = entity.id_dependencia;
    orm.nom_dependencia = entity.nom_dependencia;
    orm.sem_nivel = entity.sem_nivel;
    orm.estado = entity.estado;
    return orm;
  }

  async findById(id: number): Promise<Sena | null> {
    const orm = await this.senaRepository.findOne({
      where: { id },
    });
    return orm ? this.toEntity(orm) : null;
  }

  async findAll(): Promise<Sena[]> {
    const orms = await this.senaRepository.find();
    return orms.map((orm) => this.toEntity(orm));
  }

  async findByInstitucionExterna(institucionExterna: string): Promise<Sena[]> {
    const orms = await this.senaRepository.find({
      where: { institucion_externa: institucionExterna },
    });
    return orms.map((orm) => this.toEntity(orm));
  }

  async findBySNIES(snies: string): Promise<Sena[]> {
    const orms = await this.senaRepository.find({
      where: { snies },
    });
    return orms.map((orm) => this.toEntity(orm));
  }

  async findByNivelIES(nivelIES: string): Promise<Sena[]> {
    const orms = await this.senaRepository.find({
      where: { nivel_ies: nivelIES },
    });
    return orms.map((orm) => this.toEntity(orm));
  }

  async findByPrograma(programaIES: string): Promise<Sena[]> {
    const orms = await this.senaRepository.find({
      where: { programa_ies: programaIES },
    });
    return orms.map((orm) => this.toEntity(orm));
  }

  async findByEstado(estado: string): Promise<Sena[]> {
    const orms = await this.senaRepository.find({
      where: { estado },
    });
    return orms.map((orm) => this.toEntity(orm));
  }

  async create(sena: Sena): Promise<Sena> {
    const ormEntity = this.toORM(sena);
    const savedEntity = await this.senaRepository.save(ormEntity);
    return this.toEntity(savedEntity);
  }

  async update(id: number, data: Partial<Sena>): Promise<Sena> {
    await this.senaRepository.update(id, data);
    const updated = await this.senaRepository.findOne({
      where: { id },
    });
    if (!updated) {
      throw new Error(`No existe un registro SENA con id ${id}`);
    }
    return this.toEntity(updated);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.senaRepository.delete(id);
    return (
      result.affected !== undefined &&
      result.affected !== null &&
      result.affected > 0
    );
  }
}