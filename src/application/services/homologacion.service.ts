import { Injectable, Inject } from '@nestjs/common';
import {
  Homologacion,
  EstatusHomologacion,
} from '../../domain/homologaciones/entity/homologacion.entity';
import { HomologacionRepository } from '../../domain/homologaciones/repository/homologacion.repository';
import { EstudianteRepository } from '../../domain/estudiante/repository/estudiante.repository';

@Injectable()
export class HomologacionService {
  constructor(
    @Inject('HomologacionRepository')
    private readonly homologacionRepository: HomologacionRepository,
    @Inject('EstudianteRepository')
    private readonly estudianteRepository: EstudianteRepository,
  ) {}

  async createHomologacion(homologacion: Homologacion): Promise<Homologacion> {
    const estudiante = await this.estudianteRepository.findById(
      homologacion.estudianteId,
    );

    if (!estudiante) {
      throw new Error(
        `No existe un estudiante con el id ${homologacion.estudianteId}`,
      );
    }

    if (!homologacion.estatus) {
      homologacion.estatus = EstatusHomologacion.SIN_DOCUMENTOS;
    }

    homologacion.createdAt = new Date();
    homologacion.updatedAt = new Date();

    return this.homologacionRepository.create(homologacion);
  }

  async getHomologacionById(id: string): Promise<Homologacion | null> {
    return this.homologacionRepository.findById(id);
  }

  async getHomologacionesByEstudianteId(
    estudianteId: string,
  ): Promise<Homologacion[]> {
    return this.homologacionRepository.findByEstudianteId(estudianteId);
  }

  async updateHomologacion(
    id: string,
    data: Partial<Homologacion>,
  ): Promise<Homologacion> {
    const homologacion = await this.homologacionRepository.findById(id);

    if (!homologacion) {
      throw new Error(`No se encontró la homologación con id ${id}`);
    }

    data.updatedAt = new Date();

    return this.homologacionRepository.update(id, data);
  }

  async updateEstatusHomologacion(
    id: string,
    estatus: EstatusHomologacion,
  ): Promise<Homologacion> {
    const homologacion = await this.homologacionRepository.findById(id);

    if (!homologacion) {
      throw new Error(`No se encontró la homologación con id ${id}`);
    }

    return this.homologacionRepository.updateEstatus(id, estatus);
  }

  async getHomologacionesByEstatus(
    estatus: EstatusHomologacion,
  ): Promise<Homologacion[]> {
    return this.homologacionRepository.findByEstatus(estatus);
  }
}
