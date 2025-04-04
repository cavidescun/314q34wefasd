import {
  Injectable,
  Inject,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EstatusHomologacion } from '../../../../domain/homologaciones/entity/homologacion.entity';
import { HomologacionRepository } from '../../../../domain/homologaciones/repository/homologacion.repository';
import { EstudianteRepository } from '../../../../domain/estudiante/repository/estudiante.repository';
import { ContactRepository } from '../../../../domain/contact/repository/contact.repository';
import { ZeptoMailService } from '../../../../infrastructure/external-services/email/zeptomail.service';
import { ZohoService } from '../../../../infrastructure/external-services/zoho/zoho.service';

@Injectable()
export class FinalizarHomologacionService {
  private readonly logger = new Logger(FinalizarHomologacionService.name);

  constructor(
    @Inject('HomologacionRepository')
    private readonly homologacionRepository: HomologacionRepository,
    @Inject('EstudianteRepository')
    private readonly estudianteRepository: EstudianteRepository,
    @Inject('ContactRepository')
    private readonly contactRepository: ContactRepository,
    @Inject(ZeptoMailService)
    private readonly zeptoMailService: ZeptoMailService,
    @Inject(ZohoService)
    private readonly zohoService: ZohoService,
  ) {}

  async execute(numeroDocumento: string, observaciones?: string) {
    try {
      const estudiante =
        await this.estudianteRepository.findByNumeroIdentificacion(
          numeroDocumento,
        );

      if (!estudiante) {
        throw new HttpException(
          `No se encontró un estudiante con el número de documento: ${numeroDocumento}`,
          HttpStatus.NOT_FOUND,
        );
      }
      const homologaciones =
        await this.homologacionRepository.findByEstudianteId(estudiante.id);

      if (!homologaciones || homologaciones.length === 0) {
        throw new HttpException(
          `No se encontraron homologaciones para el estudiante con documento: ${numeroDocumento}`,
          HttpStatus.NOT_FOUND,
        );
      }

      const homologacion = homologaciones[0];

      if (homologacion.estatus === EstatusHomologacion.PENDIENTE) {
        throw new HttpException(
          'La homologación ya se encuentra en estado Pendiente',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (homologacion.estatus === EstatusHomologacion.SIN_DOCUMENTOS) {
        throw new HttpException(
          'No se puede finalizar una homologación sin documentos',
          HttpStatus.BAD_REQUEST,
        );
      }

      const contacto = await this.contactRepository.findByEstudianteId(
        estudiante.id,
      );
      if (!contacto || !contacto.email) {
        throw new HttpException(
          `No se encontró información de contacto válida para el estudiante`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // Crear ticket en ZOHO - Esta operación debe ser exitosa para continuar
      let zohoTicketId = '';
      let zohoTicketCreated = false;
      try {
        // Preparar datos para ZOHO
        const studentData = {
          nombres: 'TEST',
          numeroDocumento: estudiante.numeroIdentificacion,
          telefono: 'TEST',
          correoInstitucional: 'camilov370@gmail.com',
          correoPersonal:  'camilov370@gmail.com',
          programa: 'TEST',
          modalidad: 'TEST',
          periodo:'TEST',
          sede: 'TEST',
        };

        const requestData = {
          asunto: 'TEST',
          solicitud: 'TEST',
          categoria: 'TEST',
          categoria_2: 'TEST',
          categoria_3: 'TEST',
          descripcion: 'TEST',
        };

        const zohoResponse = await this.zohoService.createTicket(studentData, requestData);
        this.logger.log(`Ticket creado en ZOHO: ${JSON.stringify(zohoResponse)}`);
        
        if (zohoResponse && zohoResponse.status && zohoResponse.ticket) {
          // Obtenemos específicamente el ticketNumber de la respuesta
          zohoTicketId = zohoResponse.ticket.ticketNumber || '';
          if (zohoTicketId) {
            zohoTicketCreated = true;
            this.logger.log(`Número de ticket ZOHO obtenido: ${zohoTicketId}`);
          } else {
            throw new Error('Respuesta de ZOHO no contiene ticketNumber válido');
          }
        } else {
          throw new Error('Respuesta de ZOHO no contiene datos de ticket válidos');
        }
      } catch (zohoError) {
        this.logger.error(`Error al crear ticket en ZOHO: ${zohoError.message}`, zohoError.stack);
        throw new HttpException(
          `No se pudo crear el ticket en ZOHO: ${zohoError.message}. El proceso de homologación no puede continuar sin un ticket válido.`,
          HttpStatus.SERVICE_UNAVAILABLE
        );
      }

      // Si llegamos aquí, significa que el ticket ZOHO se creó exitosamente
      // Ahora podemos proceder a enviar el correo electrónico

      // Enviar correo a través de Zepto
      const emailResult =
        await this.zeptoMailService.sendHomologacionConfirmation(
          contacto.email,
          estudiante.nombreCompleto,
          homologacion.institucion || 'No especificada',
          homologacion.carreraHom || 'No especificada',
        );

      if (!emailResult.success) {
        this.logger.warn(`Error al enviar correo: ${emailResult.message}`);
        // No detenemos el proceso si el correo falla, solo lo registramos
      }

      // Actualizar el estado de la homologación y guardar el ticket
      const updateData: any = {
        estatus: EstatusHomologacion.PENDIENTE,
        updatedAt: new Date(),
        id_ticket: zohoTicketId
      };

      if (observaciones) {
        updateData.observaciones = observaciones;
      }

      await this.homologacionRepository.update(homologacion.id, updateData);
      this.logger.log(`Homologación actualizada a estado Pendiente con ticket: ${zohoTicketId}`);

      const homologacionActualizada =
        await this.homologacionRepository.findById(homologacion.id);

      return {
        success: true,
        message: 'Proceso de homologación finalizado exitosamente',
        data: {
          homologacion: homologacionActualizada,
          email: {
            enviado: emailResult.success,
            destinatario: contacto.email,
            mensaje: emailResult.success
              ? 'Correo enviado exitosamente'
              : emailResult.message,
          },
          zoho: {
            enviado: true,
            ticketNumber: zohoTicketId,
            mensaje: 'Ticket creado exitosamente en ZOHO'
          }
        },
      };
    } catch (error) {
      this.logger.error(
        `Error en finalizar homologación: ${error.message}`,
        error.stack,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          success: false,
          message: 'Error al finalizar el proceso de homologación',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}