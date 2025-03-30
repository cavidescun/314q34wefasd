import { Inject, Injectable, Logger } from '@nestjs/common';
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
    nombreArchivo: string,
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

      const estudiante = new Estudiante({
        nombreCompleto,
        numeroIdentificacion,
      });

      const estudianteCreado =
        await this.estudianteRepository.create(estudiante);

      const contact = new Contact({
        celular: registroDto.celular,
        numFijo: registroDto.numFijo,
        email: registroDto.email,
        estudianteId: estudianteCreado.id,
      });

      const contactCreado = await this.contactRepository.create(contact);

      const homologacion = new Homologacion({
        estudianteId: estudianteCreado.id,
        estatus: EstatusHomologacion.SIN_DOCUMENTOS,
      });

      const homologacionCreada =
        await this.homologacionRepository.create(homologacion);

      const nombreArchivo = `${numeroIdentificacion}/documento-identidad.pdf`;

      const urlDocumento = await this.storageService.subirDocumento(
        nombreArchivo,
        documentoBuffer,
        'application/pdf',
      );

      const documents = new Documents({
        homologacionId: homologacionCreada.id,
        urlDocIdentificacion: urlDocumento,
      });

      await this.documentsRepository.create(documents);

      return {
        success: true,
        message: 'Registro inicial procesado exitosamente',
        data: {
          estudiante: estudianteCreado,
          contact: contactCreado,
          homologacion: homologacionCreada,
          ocr_result: {
            nombreCompleto,
            numeroIdentificacion,
          },
        },
      };
    } catch (error) {
      this.logger.error(
        `Error en el proceso de registro inicial: ${error.message}`,
        error.stack,
      );
      return {
        success: false,
        message: 'Error al procesar el registro inicial',
        error: error.message,
      };
    }
  }
}
