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
}
