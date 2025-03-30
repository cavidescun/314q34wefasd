import { Sena } from "../entity/reconocimiento-titulo.entity";

export interface SenaRepository {
  findById(id: number): Promise<Sena | null>;
  findAll(): Promise<Sena[]>;
  findByInstitucionExterna(institucionExterna: string): Promise<Sena[]>;
  findBySNIES(snies: string): Promise<Sena[]>;
  findByNivelIES(nivelIES: string): Promise<Sena[]>;
  findByPrograma(programaIES: string): Promise<Sena[]>;
  findByEstado(estado: string): Promise<Sena[]>;
  create(sena: Sena): Promise<Sena>;
  update(id: number, sena: Partial<Sena>): Promise<Sena>;
  delete(id: number): Promise<boolean>;
}