import { Injectable, Inject } from '@nestjs/common';
import { Estudiante } from '../../domain/estudiante/entity/estudiante.entity';
import { EstudianteRepository } from '../../domain/estudiante/repository/estudiante.repository';

@Injectable()
export class EstudianteService {
  constructor(
    @Inject('EstudianteRepository')
    private readonly estudianteRepository: EstudianteRepository,
  ) {}

  async createEstudiante(estudiante: Estudiante): Promise<Estudiante> {
    const existingEstudiante =
      await this.estudianteRepository.findByNumeroIdentificacion(
        estudiante.numeroIdentificacion,
      );

    if (existingEstudiante) {
      throw new Error(
        `Ya existe un estudiante con el número de identificación ${estudiante.numeroIdentificacion}`,
      );
    }

    return this.estudianteRepository.create(estudiante);
  }

  async getEstudianteById(id: string): Promise<Estudiante | null> {
    return this.estudianteRepository.findById(id);
  }

  async getEstudianteByIdentificacion(
    numeroIdentificacion: string,
  ): Promise<Estudiante | null> {
    return this.estudianteRepository.findByNumeroIdentificacion(
      numeroIdentificacion,
    );
  }

  async updateEstudiante(
    id: string,
    data: Partial<Estudiante>,
  ): Promise<Estudiante> {
    const estudiante = await this.estudianteRepository.findById(id);

    if (!estudiante) {
      throw new Error(`No se encontró el estudiante con id ${id}`);
    }

    return this.estudianteRepository.update(id, data);
  }

  async getAllEstudiantes(): Promise<Estudiante[]> {
    return this.estudianteRepository.findAll();
  }
}
