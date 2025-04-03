import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendMailClient } from 'zeptomail';

interface MailRecipient {
  email_address: string;
  name?: string;
}

interface SendMailOptions {
  from?: {
    address: string;
    name?: string;
  };
  to: MailRecipient[];
  cc?: MailRecipient[];
  bcc?: MailRecipient[];
  subject: string;
  htmlBody?: string;
  textBody?: string;
  replyTo?: string;
}

export interface EmailResult {
  success: boolean;
  message: string;
  data?: any;
  ticketId?: string;
}

@Injectable()
export class ZeptoMailService {
  private readonly logger = new Logger(ZeptoMailService.name);
  private readonly client: SendMailClient;
  private readonly defaultFromEmail: string;
  private readonly defaultFromName: string;

  constructor(private readonly configService: ConfigService) {
    const url = 'https://api.zeptomail.com/';
    const token = this.configService.get<string>('ZEPTOMAIL_API_KEY') || '';

    if (!token) {
      this.logger.warn('ZEPTOMAIL_API_KEY no está configurada'); 
    }

    this.client = new SendMailClient({ url, token });
    this.defaultFromEmail = this.configService.get<string>('ZEPTOMAIL_FROM_EMAIL') || 'noreply@homologaciones.edu.co';
    this.defaultFromName = this.configService.get<string>('ZEPTOMAIL_FROM_NAME') || 'Sistema de Homologaciones';
  }

  async sendEmail(options: SendMailOptions): Promise<EmailResult> {
    try {
      if (!options.to || options.to.length === 0) {
        throw new Error('Se requiere al menos un destinatario');
      }

      const payload: any = {
        from: {
          address: options.from?.address || this.defaultFromEmail,
          name: options.from?.name || this.defaultFromName,
        },
        to: options.to.map(recipient => ({
          email_address: {
            address: recipient.email_address,
            name: recipient.name || ''
          }
        })),
        subject: options.subject,
        htmlbody: options.htmlBody || '',
      };

      if (options.textBody) {
        payload.textbody = options.textBody;
      }
      if (options.replyTo) {
        payload.reply_to = [{ address: options.replyTo }];
      }
      if (options.cc && options.cc.length > 0) {
        payload.cc = options.cc.map(recipient => ({
          email_address: {
            address: recipient.email_address,
            name: recipient.name || ''
          }
        }));
      }
      if (options.bcc && options.bcc.length > 0) {
        payload.bcc = options.bcc.map(recipient => ({
          email_address: {
            address: recipient.email_address,
            name: recipient.name || ''
          }
        }));
      }

      this.logger.debug(`Enviando correo con payload: ${JSON.stringify(payload)}`);

      const response = await this.client.sendMail(payload);
      this.logger.debug(`Respuesta: ${JSON.stringify(response)}`);

      return {
        success: true,
        message: 'Correo enviado exitosamente',
        data: response,
        ticketId: response.data?.message_id || `zepto-${Date.now()}`,
      };
    } catch (error) {
      this.logger.error(`Error enviando correo: ${error.message}`, error.stack);
      return {
        success: false,
        message: `Error al enviar correo: ${error.message}`,
        data: error.response?.data,
      };
    }
  }

  /**
   * Envía un correo de confirmación de homologación al estudiante
   * @param email Email del estudiante
   * @param nombreEstudiante Nombre completo del estudiante
   * @param institucion Institución de origen
   * @param carrera Carrera a homologar
   * @returns Resultado del envío del correo
   */
  async sendHomologacionConfirmation(
    email: string,
    nombreEstudiante: string,
    institucion: string,
    carrera: string
  ): Promise<EmailResult> {
    try {
      const subject = 'Confirmación de proceso de homologación - CUN';
      
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://cun.edu.co/wp-content/uploads/2021/09/logo-cun.png" alt="Logo CUN" style="max-width: 150px;">
          </div>
          
          <h2 style="color: #00447c; text-align: center;">Proceso de Homologación Iniciado</h2>
          
          <p>Estimado(a) <strong>${nombreEstudiante}</strong>,</p>
          
          <p>Nos complace informarle que su solicitud de homologación ha sido recibida y está siendo procesada por nuestro equipo académico. A continuación, le recordamos los detalles de su solicitud:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Institución de origen:</strong> ${institucion}</p>
            <p><strong>Programa académico:</strong> ${carrera}</p>
          </div>
          
          <p>Su solicitud se encuentra en estado <strong>PENDIENTE</strong> y será revisada por nuestra área académica. El tiempo estimado de respuesta es de 5 a 10 días hábiles, dependiendo del volumen de solicitudes.</p>
          
          <p>Recibirá una notificación por este mismo medio una vez que su proceso de homologación haya sido finalizado. Si tiene alguna duda o necesita información adicional, puede responder a este correo o comunicarse con la línea de atención estudiantil.</p>
          
          <p>Gracias por confiar en la CUN para continuar con su formación académica.</p>
          
          <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
            <p>Este es un mensaje automático, por favor no responda a este correo.</p>
            <p>© ${new Date().getFullYear()} Corporación Unificada Nacional de Educación Superior - CUN</p>
          </div>
        </div>
      `;
      
      const textBody = `
Confirmación de proceso de homologación - CUN

Estimado(a) ${nombreEstudiante},

Nos complace informarle que su solicitud de homologación ha sido recibida y está siendo procesada por nuestro equipo académico. A continuación, le recordamos los detalles de su solicitud:

- Institución de origen: ${institucion}
- Programa académico: ${carrera}

Su solicitud se encuentra en estado PENDIENTE y será revisada por nuestra área académica. El tiempo estimado de respuesta es de 5 a 10 días hábiles, dependiendo del volumen de solicitudes.

Recibirá una notificación por este mismo medio una vez que su proceso de homologación haya sido finalizado. Si tiene alguna duda o necesita información adicional, puede responder a este correo o comunicarse con la línea de atención estudiantil.

Gracias por confiar en la CUN para continuar con su formación académica.

Este es un mensaje automático, por favor no responda a este correo.
© ${new Date().getFullYear()} Corporación Unificada Nacional de Educación Superior - CUN
      `;
      
      return await this.sendEmail({
        to: [{ email_address: email, name: nombreEstudiante }],
        subject,
        htmlBody,
        textBody
      });
    } catch (error) {
      this.logger.error(`Error enviando correo de confirmación de homologación: ${error.message}`, error.stack);
      return {
        success: false,
        message: `Error al enviar correo de confirmación: ${error.message}`
      };
    }
  }
}