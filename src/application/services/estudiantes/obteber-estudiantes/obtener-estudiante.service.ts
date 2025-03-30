import {
  Injectable,
  Inject,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Estudiante } from '../../../../domain/estudiante/entity/estudiante.entity';
import { Contact } from '../../../../domain/contact/entity/contact.entity';
import { Homologacion } from '../../../../domain/homologaciones/entity/homologacion.entity';
import { Documents } from '../../../../domain/documents/entity/documents.entity';
import { EstudianteService } from '../estudiante.service';
import { HomologacionService } from '../../homologacion/homologacion.service';
import { DocumentsService } from '../../documentos/documents.service';
import { ContactRepository } from '../../../../domain/contact/repository/contact.repository';

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
  private readonly logger = new Logger(ObtenerEstudianteUseCase.name);

  constructor(
    private readonly estudianteService: EstudianteService,
    private readonly homologacionService: HomologacionService,
    private readonly documentsService: DocumentsService,
    @Inject('ContactRepository')
    private readonly contactRepository: ContactRepository,
  ) {}

  async execute(id: string): Promise<EstudianteDetalleDto | null> {
    try {
      const result = await this.estudianteService.obtenerEstudiantePorId(id);
      if (!result || !result.data) {
        return null;
      }
      const estudiante = result.data as unknown as Estudiante;

      const contact = await this.contactRepository.findByEstudianteId(id);

      const resultHomologaciones =
        await this.homologacionService.obtenerHomologacionesPorEstudianteId(id);
      const homologaciones = (resultHomologaciones?.data ||
        []) as Homologacion[];

      const homologacionesConDocumentos = await Promise.all(
        homologaciones.map(async (homologacion) => {
          let documents: Documents | null = null;
          try {
            const resultDocuments =
              await this.documentsService.obtenerDocumentosPorHomologacionId(
                homologacion.id,
              );
            if (resultDocuments?.data) {
              documents = resultDocuments.data as unknown as Documents;
            }
          } catch (error) {
            this.logger.warn(
              `No se encontraron documentos para la homologación ${homologacion.id}`,
            );
          }
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
    } catch (error) {
      this.logger.error(
        `Error al obtener detalles del estudiante: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
