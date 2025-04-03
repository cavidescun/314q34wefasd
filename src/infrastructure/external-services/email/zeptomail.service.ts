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
    const url = this.configService.get<string>('ZEPTOMAIL_API_ENDPOINT');
    const token = `Zoho-enczapikey ${this.configService.get<string>('ZEPTOMAIL_API_KEY')?.trim() || ''}`;

    if (!token) {
      this.logger.error('ZEPTOMAIL_API_KEY is not configured');
    }

    this.client = new SendMailClient({ url, token });
    this.defaultFromEmail =
      this.configService.get<string>('ZEPTOMAIL_FROM_EMAIL') || '';
    this.defaultFromName =
      this.configService.get<string>('ZEPTOMAIL_FROM_NAME') || '';
  }

  async sendEmail(options: SendMailOptions): Promise<EmailResult> {
    try {
      if (!options.to || options.to.length === 0) {
        throw new Error('At least one recipient is required');
      }

      if (!this.client) {
        throw new Error('Zeptomail client is not initialized');
      }

      const payload: any = {
        from: {
          address: options.from?.address || this.defaultFromEmail,
          name: options.from?.name || this.defaultFromName,
        },
        to: options.to.map((recipient) => ({
          email_address: {
            address: recipient.email_address,
            name: recipient.name || '',
          },
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
        payload.cc = options.cc.map((recipient) => ({
          email_address: {
            address: recipient.email_address,
            name: recipient.name || '',
          },
        }));
      }
      if (options.bcc && options.bcc.length > 0) {
        payload.bcc = options.bcc.map((recipient) => ({
          email_address: {
            address: recipient.email_address,
            name: recipient.name || '',
          },
        }));
      }

      const response = await this.client.sendMail(payload);

      if (response && typeof response !== 'object') {
        this.logger.error(`Unexpected response type: ${typeof response}`);
      }

      const messageId =
        response?.data?.message_id ||
        response?.message_id ||
        `zepto-${Date.now()}`;

      return {
        success: true,
        message: 'Email sent successfully',
        data: response,
        ticketId: messageId,
      };
    } catch (error) {
      this.logger.error(`Detailed email sending error:`, error);

      Object.keys(error).forEach((key) => {
        this.logger.error(`Error ${key}: ${error[key]}`);
      });

      return {
        success: false,
        message: `Error sending email: ${error.message || 'Unknown error'}`,
        data: error,
      };
    }
  }

  async sendHomologacionConfirmation(
    email: string,
    nombreEstudiante: string,
    institucion: string,
    carrera: string,
  ): Promise<EmailResult> {
    try {
      const subject = 'Confirmation of Homologation Process - CUN';

      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #00447c; text-align: center;">Homologation Process Initiated</h2>
          
          <p>Dear <strong>${nombreEstudiante}</strong>,</p>
          
          <p>We are pleased to inform you that your homologation request has been received and is being processed by our academic team.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Origin Institution:</strong> ${institucion}</p>
            <p><strong>Academic Program:</strong> ${carrera}</p>
          </div>
          
          <p>Your request is currently in <strong>PENDING</strong> status and will be reviewed by our academic department. The estimated response time is 5 to 10 business days.</p>
          
          <p>You will receive a notification via this email once your homologation process has been finalized.</p>
        </div>
      `;

      const textBody = `
Homologation Process Confirmation

Dear ${nombreEstudiante},

Your homologation request has been received:
- Institution: ${institucion}
- Program: ${carrera}

Status: PENDING
Estimated response time: 5-10 business days

You will be notified once the process is complete.
      `;

      return await this.sendEmail({
        to: [{ email_address: email, name: nombreEstudiante }],
        subject,
        htmlBody,
        textBody,
      });
    } catch (error) {
      this.logger.error(
        `Detailed homologation confirmation email error:`,
        error,
      );
      return {
        success: false,
        message: `Error sending confirmation email: ${error.message || 'Unknown error'}`,
      };
    }
  }
}
