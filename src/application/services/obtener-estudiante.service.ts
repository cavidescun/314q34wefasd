import { Injectable, Inject } from '@nestjs/common';
import { Estudiante } from '../../domain/estudiante/entity/estudiante.entity';
import { Contact } from '../../domain/contact/entity/contact.entity';
import { Homologacion } from '../../domain/homologaciones/entity/homologacion.entity';
import { Documents } from '../../domain/documents/entity/documents.entity';
import { EstudianteService } from './estudiante.service';
import { HomologacionService } from './homologacion.service';
import { DocumentsService } from './documents.service';
import { ContactRepository } from '../../domain/contact/repository/contact.repository';

export interface EstudianteDetalleDto {
  estudiante: Estudiante;
  contact: Contact | null;
  homologaciones: Array<{
    homologacion: Homologacion;
    documents: Documents | null;
  }>;
}

@Injectable()
export class ObtenerEstudianteUseCase {
  constructor(
    private readonly estudianteService: EstudianteService,
    private readonly homologacionService: HomologacionService,
    private readonly documentsService: DocumentsService,
    @Inject('ContactRepository')
    private readonly contactRepository: ContactRepository,
  ) {}

  async execute(id: string): Promise<EstudianteDetalleDto | null> {
    const estudiante = await this.estudianteService.getEstudianteById(id);

    if (!estudiante) {
      return null;
    }

    const contact = await this.contactRepository.findByEstudianteId(id);

    const homologaciones =
      await this.homologacionService.getHomologacionesByEstudianteId(id);

    const homologacionesConDocumentos = await Promise.all(
      homologaciones.map(async (homologacion) => {
        const documents =
          await this.documentsService.getDocumentsByHomologacionId(
            homologacion.id,
          );
        return {
          homologacion,
          documents,
        };
      }),
    );

    return {
      estudiante,
      contact,
      homologaciones: homologacionesConDocumentos,
    };
  }
}