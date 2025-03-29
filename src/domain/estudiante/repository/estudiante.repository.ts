import { Estudiante } from '../entity/estudiante.entity';

export interface EstudianteRepository {
  findById(id: string): Promise<Estudiante | null>;
  findByNumeroIdentificacion(numeroIdentificacion: string): Promise<Estudiante | null>;
  create(estudiante: Estudiante): Promise<Estudiante>;
  update(id: string, estudiante: Partial<Estudiante>): Promise<Estudiante>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<Estudiante[]>;
}