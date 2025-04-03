import { Injectable, Inject, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { EstatusHomologacion } from '../../../../domain/homologaciones/entity/homologacion.entity';
import { HomologacionRepository } from '../../../../domain/homologaciones/repository/homologacion.repository';
import { EstudianteRepository } from '../../../../domain/estudiante/repository/estudiante.repository';
import { ContactRepository } from '../../../../domain/contact/repository/contact.repository';
import { ZeptoMailService } from '../../../../infrastructure/external-services/email/zeptomail.service';

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
    private readonly zeptoMailService: ZeptoMailService
  ) {}

  async execute(numeroDocumento: string, observaciones?: string) {
    try {
      const estudiante = await this.estudianteRepository.findByNumeroIdentificacion(numeroDocumento);
      
      if (!estudiante) {
        throw new HttpException(
          `No se encontró un estudiante con el número de documento: ${numeroDocumento}`,
          HttpStatus.NOT_FOUND
        );
      }
      const homologaciones = await this.homologacionRepository.findByEstudianteId(estudiante.id);
      
      if (!homologaciones || homologaciones.length === 0) {
        throw new HttpException(
          `No se encontraron homologaciones para el estudiante con documento: ${numeroDocumento}`,
          HttpStatus.NOT_FOUND
        );
      }

      const homologacion = homologaciones[0];

      if (homologacion.estatus === EstatusHomologacion.PENDIENTE) {
        throw new HttpException(
          'La homologación ya se encuentra en estado Pendiente',
          HttpStatus.BAD_REQUEST
        );
      }

      if (homologacion.estatus === EstatusHomologacion.SIN_DOCUMENTOS) {
        throw new HttpException(
          'No se puede finalizar una homologación sin documentos',
          HttpStatus.BAD_REQUEST
        );
      }


      const contacto = await this.contactRepository.findByEstudianteId(estudiante.id);
      if (!contacto || !contacto.email) {
        throw new HttpException(
          `No se encontró información de contacto válida para el estudiante`,
          HttpStatus.BAD_REQUEST
        );
      }

// 5. Enviar correo de confirmación
const emailResult = await this.zeptoMailService.sendHomologacionConfirmation(
  contacto.email,
  estudiante.nombreCompleto,
  homologacion.institucion || 'No especificada',
  homologacion.carreraHom || 'No especificada'
);

if (!emailResult.success) {
  this.logger.warn(`Error al enviar correo: ${emailResult.message}`);
  // Continuamos con el proceso aunque el correo falle
}

// 6. Actualizar estado de la homologación y guardar ID de ticket
const updateData: any = {
  estatus: EstatusHomologacion.PENDIENTE,
  updatedAt: new Date(),
};

if (observaciones) {
  updateData.observaciones = observaciones;
}

await this.homologacionRepository.update(homologacion.id, updateData);

// 7. Si se obtuvo un ID de ticket, actualizarlo
if (emailResult.success && emailResult.ticketId) {
  await this.homologacionRepository.updateIdTicket(homologacion.id, emailResult.ticketId);
}

      const homologacionActualizada = await this.homologacionRepository.findById(homologacion.id);

      return {
        success: true,
        message: 'Proceso de homologación finalizado exitosamente',
        data: {
          homologacion: homologacionActualizada,
          email: {
            enviado: emailResult.success,
            destinatario: contacto.email,
            mensaje: emailResult.success ? 'Correo enviado exitosamente' : emailResult.message
          }
        }
      };
    } catch (error) {
      this.logger.error(`Error en finalizar homologación: ${error.message}`, error.stack);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          success: false,
          message: 'Error al finalizar el proceso de homologación',
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}