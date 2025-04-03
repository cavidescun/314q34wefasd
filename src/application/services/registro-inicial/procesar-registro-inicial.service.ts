import {
  Inject,
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Estudiante } from '../../../domain/estudiante/entity/estudiante.entity';
import { Contact } from '../../../domain/contact/entity/contact.entity';
import {
  Homologacion,
  EstatusHomologacion,
} from '../../../domain/homologaciones/entity/homologacion.entity';
import { Documents } from '../../../domain/documents/entity/documents.entity';
import { CollectDataContact } from '../../../domain/collect_data_contact/entity/collect_data_contact.entity';
import { EstudianteRepository } from '../../../domain/estudiante/repository/estudiante.repository';
import { ContactRepository } from '../../../domain/contact/repository/contact.repository';
import { HomologacionRepository } from '../../../domain/homologaciones/repository/homologacion.repository';
import { DocumentsRepository } from '../../../domain/documents/repository/documents.repository';
import { CollectDataContactRepository } from '../../../domain/collect_data_contact/repository/collect_data_contact.repository';

interface StorageService {
  subirDocumento(
    numeroIdentificacion: string,
    tipoDocumento: string,
    buffer: Buffer,
    contentType?: string,
  ): Promise<string>;
}

interface DocumentValidationService {
  validarDocumento(documento: Buffer): Promise<{
    status: 'valid' | 'invalid' | 'error';
    message: string;
    documentData?: {
      nombreCompleto?: string;
      numeroDocumento?: string;
      [key: string]: any;
    };
  }>;
}

@Injectable()
export class ProcesarRegistroInicialUseCase {
  private readonly logger = new Logger(ProcesarRegistroInicialUseCase.name);

  constructor(
    @Inject('EstudianteRepository')
    private readonly estudianteRepository: EstudianteRepository,
    @Inject('ContactRepository')
    private readonly contactRepository: ContactRepository,
    @Inject('HomologacionRepository')
    private readonly homologacionRepository: HomologacionRepository,
    @Inject('DocumentsRepository')
    private readonly documentsRepository: DocumentsRepository,
    @Inject('CollectDataContactRepository')
    private readonly collectDataContactRepository: CollectDataContactRepository,
    @Inject('StorageService')
    private readonly storageService: StorageService,
    @Inject('DocumentValidationService')
    private readonly documentValidationService: DocumentValidationService,
  ) {}

  async execute(
    registroDto: { celular: string; numFijo?: string; email: string },
    documentoBuffer: Buffer,
  ): Promise<{
    success: boolean;
    message: string;
    data?: {
      estudiante?: Estudiante;
      contact?: Contact;
      homologacion?: Homologacion;
      ocr_result?: {
        nombreCompleto: string;
        numeroIdentificacion: string;
      };
      procesoExistente?: boolean;
    };
    error?: string;
  }> {
    try {
      const collectDataContact = new CollectDataContact({
        celular: registroDto.celular,
        email: registroDto.email,
      });

      await this.collectDataContactRepository.create(collectDataContact);

      const resultadoOcr =
        await this.documentValidationService.validarDocumento(documentoBuffer);

      if (resultadoOcr.status !== 'valid' || !resultadoOcr.documentData) {
        this.logger.error(
          `Error en OCR: ${resultadoOcr.message}`,
          'STATUS: ' + resultadoOcr.status,
        );
        return {
          success: false,
          message: 'No se pudo extraer la información del documento',
          error: resultadoOcr.message,
        };
      }

      const nombreCompleto = resultadoOcr.documentData.nombresCompletos;
      const numeroIdentificacion = resultadoOcr.documentData.numeroDocumento;

      if (!nombreCompleto || !numeroIdentificacion) {
        this.logger.error(
          'Error: Información incompleta en el documento OCR',
          `nombreCompleto: ${nombreCompleto}, numeroIdentificacion: ${numeroIdentificacion}`,
        );
        return {
          success: false,
          message: 'Información incompleta en el documento',
          error:
            'No se pudo extraer el nombre completo o número de identificación',
        };
      }
      let estudianteExistente =
        await this.estudianteRepository.findByNumeroIdentificacion(
          numeroIdentificacion,
        );
      let contactoExistente: Contact | null = null;
      let procesoExistente = false;

      if (estudianteExistente) {
        const homologacionesExistentes =
          await this.homologacionRepository.findByEstudianteId(
            estudianteExistente.id,
          );

        if (homologacionesExistentes && homologacionesExistentes.length > 0) {
          const homologacionPendiente = homologacionesExistentes.find(
            (h) => h.estatus === EstatusHomologacion.PENDIENTE,
          );

          if (homologacionPendiente) {
            contactoExistente = await this.contactRepository.findByEstudianteId(
              estudianteExistente.id,
            );

            return {
              success: true,
              message:
                'Ya existe un proceso de homologación pendiente para este estudiante',
              data: {
                estudiante: estudianteExistente,
                contact: contactoExistente || undefined,
                homologacion: homologacionPendiente,
                ocr_result: {
                  nombreCompleto,
                  numeroIdentificacion,
                },
                procesoExistente: true,
              },
            };
          }
          contactoExistente = await this.contactRepository.findByEstudianteId(
            estudianteExistente.id,
          );
          if (contactoExistente) {
            contactoExistente = await this.contactRepository.update(
              contactoExistente.id,
              estudianteExistente.id,
              {
                celular: registroDto.celular,
                numFijo: registroDto.numFijo,
                email: registroDto.email,
                updatedAt: new Date(),
              },
            );
          }

          procesoExistente = true;
        }
      }

      let estudiante: Estudiante;
      let contact: Contact;
      let homologacion: Homologacion;

      if (!estudianteExistente) {
        estudiante = new Estudiante({
          nombreCompleto,
          numeroIdentificacion,
        });
        estudiante = await this.estudianteRepository.create(estudiante);
      } else {
        estudiante = estudianteExistente;
      }

      if (!contactoExistente) {
        contact = new Contact({
          celular: registroDto.celular,
          numFijo: registroDto.numFijo,
          email: registroDto.email,
          estudianteId: estudiante.id,
        });
        contact = await this.contactRepository.create(contact);
      } else {
        contact = contactoExistente;
      }

      homologacion = new Homologacion({
        estudianteId: estudiante.id,
        estatus: EstatusHomologacion.SIN_DOCUMENTOS,
      });
      homologacion = await this.homologacionRepository.create(homologacion);

      const urlDocumento = await this.storageService.subirDocumento(
        numeroIdentificacion,
        'doc_identificacion',
        documentoBuffer,
        'application/pdf',
      );

      const documents = new Documents({
        homologacionId: homologacion.id,
        urlDocIdentificacion: urlDocumento,
      });
      await this.documentsRepository.create(documents);

      return {
        success: true,
        message: procesoExistente
          ? 'Se ha creado un nuevo proceso de homologación con los datos actualizados'
          : 'Registro inicial procesado exitosamente',
        data: {
          estudiante,
          contact,
          homologacion,
          ocr_result: {
            nombreCompleto,
            numeroIdentificacion,
          },
          procesoExistente,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error en el proceso de registro inicial: ${error.message}`,
        error.stack,
      );

      throw new HttpException(
        {
          success: false,
          message: 'Error al procesar el registro inicial',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
