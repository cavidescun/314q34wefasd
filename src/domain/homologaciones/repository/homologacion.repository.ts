import { Homologacion, EstatusHomologacion } from '../entity/homologacion.entity';

export interface HomologacionRepository {
  findById(id: string): Promise<Homologacion | null>;
  findByEstudianteId(estudianteId: string): Promise<Homologacion[]>;
  findByEstatus(estatus: EstatusHomologacion): Promise<Homologacion[]>;
  create(homologacion: Homologacion): Promise<Homologacion>;
  update(id: string, homologacion: Partial<Homologacion>): Promise<Homologacion>;
  delete(id: string): Promise<boolean>;
  updateEstatus(id: string, estatus: EstatusHomologacion, observaciones?: string): Promise<Homologacion>;
  updateIdTicket(id: string): Promise<Homologacion>;
  findAll(): Promise<Homologacion[]>;
}