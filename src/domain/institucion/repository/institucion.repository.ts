
import { Institucion } from '../entity/institucion.entity';

export interface InstitucionRepository {
  findById(idInstitucion: number): Promise<Institucion | null>;
  findAll(): Promise<Institucion[]>;
  create(institucion: Institucion): Promise<Institucion>;
  update(idInstitucion: number, institucion: Partial<Institucion>): Promise<Institucion>;
  delete(idInstitucion: number): Promise<boolean>;
}