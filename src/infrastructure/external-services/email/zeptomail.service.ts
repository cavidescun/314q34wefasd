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
       <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <!-- icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="~/css/style.css" rel="stylesheet" />
    <style>
        html,
        body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .contenedor {
            margin: 0 10%; /* Ajusté para que sea más fluido en dispositivos pequeños */
            background: #4aa6b8;
        }

        .header {
            background-image: url(Header.png); /* IMAGEN HEADER */
            background-size: cover;
            background-position: center;
            height: 280px;
            margin: auto;
           /*  display: flex;
            align-items: center; /* Asegura que el contenido esté centrado verticalmente */ */
        }

        .img1 {
            width: 80%;
            height: 60%;
            margin: 10% 10% 10% 10%;
            padding: 5%;
        }

        .header-left,
        .header-right {
            width: 100%;
        }

        .header-right {
            padding: 5%;
            text-align: center;
            color: #ffffff;
            font-size: 1.5rem; /* Ajusté el tamaño para mayor adaptabilidad */
        }

        .text-header {
            font-size: 2.5rem; /* Ajusté para que sea más fluido */
            color: #ffffff;
            font-weight: bold;
            margin-top: 8%;
            margin-left: 1%;
        }

        .contenedor2 {
            background-color: #ffffff;
            color: #000026;
            margin: auto;
            text-align: center;
        }

        .text {
            font-size: 1.2rem;
            margin: 10px 50px;
        }

        .text-description {
            font-size: 0.8rem;
            font-style: oblique;
        }

        .contenedor-info {
            background-image: url(Ayuda.png); /* IMAGEN TEXTO */
            background-repeat: round;
            color: #1e2936;
            margin: auto;
            text-align: center;
            padding: 20px;
        }

        .contenedor-info2 {
            background: #4aa6b8;
            color: #ffffff;
            margin: auto;
            text-align: center;
            padding: 20px;
        }

        footer {
            background-color: #0c2340;
            color: #ffffff;
            text-align: center;
            padding: 5px;
        }

        .btn-one,
        .btn-two {
            font-weight: bold;
            padding: 3%;
            border-radius: 20px;
            width: 100%;
            max-width: 200px;
            margin: 10px auto;
        }

        .bannerMail {
            display:flex;
            width: auto;
        }

        .btn-one {
            background-color: #0c2340;
            color: #ffffff;
            border: none;
        }

        .btn-two {
            background-color: #ffffff;
            color: #0c2340;
            border: 1px solid #0c2340;
        }

        .social-img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin: 0 0.2rem; /* Margen horizontal de 0.2 unidades */
        }

        .d-flex {
            flex-wrap: nowrap; /* Fuerza a que los elementos no se envuelvan */
            justify-content: center; /* Centra el contenido horizontalmente */
            align-items: center; /* Centra el contenido verticalmente */
            gap: 16px; /* Ajusta el espacio entre los íconos */
        }
        }

        .link-style {
            color: blue; /* Azul como un enlace */
            text-decoration: underline; /* Subrayado */
            cursor: pointer; /* Cambia el cursor a mano */
        }

            .link-style:hover {
                color: darkblue; /* Oscurece al pasar el ratón */
            }



    </style>
</head>

<body>

    <div class="container">
        <div class="header row d-none d-md-block">
            <div class="header-left col-12 col-md-6">
                <br>
            </div>
            <div class="col-12 text-center">
                <!--<h3 style="font-size: 30px; color: rgb(204, 204, 204); text-align: center;">¡Felicidades, te damos la bienvenida a la CUN!</h3> -->
                <img src="https://cdn.cunapp.dev/reconocimiento_titulos/Header_mail_actaEstudiante.png" alt="TikTok" class="bannerMail">
            </div>
        </div>


        <div class="contenedor2">
            <div class="text mb-3">
                <h3>¡Hola <strong>${nombreEstudiante}!</h3>
                <p style="text-align: center">
                    Nos complace informarte que tu proceso de reconocimiento de títulos se <strong>completó exitosamente</strong>. Encontrarás adjunto a este
                    correo un documento que contiene un resumen detallado del proceso realizado, este incluye tanto las materias que has aprobado como las que
                    aún necesitas cursar.
                </p>

                <p style="text-align: center">
                    Te recomendamos revisar el documento cuidadosamente para asegurar que toda la información esté correcta. Si tienes alguna pregunta o
                    necesitas más información, no dudes en ponerte en contacto con nosotros. Estaremos encantados de asistirte.
                </p>

                <div class="text mb-3">
                    <p class="text-description">Recuerda que la CUN no cuenta con tramitadores que agilizarán el procesoo</p>
                </div>
            </div>

            <div class="contenedor-info2 row mb-3">
                <div class="col-12">
                    <p>¿Dudas?<br></p>
                    <p>Visítanos en:<br></p>
                    <h3>CUN.EDU.CO</h3>
                </div>
            </div>

            <footer class="row mb-3">
                <div class="col-12" style="line-height: 10px; font-size: 0.7rem;">
                    <p>Línea Bogotá: <strong>(+57) (601) 307 81 80</strong> | Gratis desde tu cel: <strong>01 8000 11 54 11</strong> | Sede principal Bogotá: <strong>Calle 12b #04-79</strong></p>
                    <p>Corporación Unificada Nacional de Educación superior CUN - Código SNIES 4813, Colombia - Todos los derechos reservados</p>
                    <div class="container py-5">
                        <div class="d-flex flex-wrap justify-content-center align-items-center gap-3">
                            <div class="social-icon">
                                <img src="https://cdn.cunapp.dev/reconocimiento_titulos/icon_%20(1).png" alt="TikTok" class="social-img">
                                <img src="https://cdn.cunapp.dev/reconocimiento_titulos/icon_%20(2).png" alt="Instagram" class="social-img">
                                <img src="https://cdn.cunapp.dev/reconocimiento_titulos/icon_%20(3).png" alt="YouTube" class="social-img">
                                <img src="https://cdn.cunapp.dev/reconocimiento_titulos/icon_%20(4).png" alt="Facebook" class="social-img">
                                <img src="https://cdn.cunapp.dev/reconocimiento_titulos/icon_%20(5).png" alt="LinkedIn" class="social-img">
                            </div>
                        </div>
                            <p>Carácter Institucional: Institución técnica profesional Vigilada por el Ministerio de Educación Nacional.</p>
                    <p>Personería Jurídica: Resolución 1379 del 3 de febrero de 1983. Ministerio de Educación Nacional.</p>
                    <p>Institución de educación superior sujeta a la inspección y vigilancia del Mineducación.</p>
                    <p>Copyright&copy; 2025 | Para notificaciones judiciales: notificaciones@cun.edu.co</p>
                </div>
            </footer>
            <p class="col-12" style="line-height: 20px; font-size: 10px; color: rgb(204, 204, 204);">
                AVISO LEGAL:Este mensaje y sus archivos adjuntos van dirigidos exclusivamente a su destinatario pudiendo contener información confidencial y/o sensible sometida a secreto profesional. Queda totalmente prohibido su reproducción, compilación, divulgación, modificación o distribución sin la autorización expresa de la CORPORACIÓN UNIFICADA NACIONAL DE EDUCACIÓN SUPERIOR - CUN. Si usted no es el destinatario final por favor eliminelo e infórmenos por esta vía. De conformidad con lo previsto en la Ley Estatutaria 1581 de 2012, “Por la cual se dictan disposiciones generales para la protección de datos personales”, el Decreto 1377 de 2013 y 1074 de 2015 “Por los cuales se reglamentan parcialmente la Ley 1581 de 2012”, el titular presta su consentimiento para que sus datos, facilitados voluntariamente por este medio, pasen a formar parte de una base de datos y serán tratados según la política de tratamiento responsabilidad de la Corporación con la finalidad de gestión académica, administrativa, de carácter comercial y él envió de comunicaciones electrónicas sobre sus productos y/o servicios. Los titulares podrán ejercer los derechos de acceso, corrección, supresión, revocación o reclamo por infracción sobre sus datos, mediante escrito dirigido a la CORPORACIÓN UNIFICADA NACIONAL DE EDUCACIÓN SUPERIOR - CUN en la dirección de correo electrónico <span class="link-style">basesdedatos@cun.edu.co</span>, indicando en el “Asunto”; el derecho que deseo ejercer; o mediante correo ordinario remitido a la dirección Calle 12B No 4 - 79 de la ciudad de Bogotá D.C con base en la política de tratamiento de protección de datos, a la cual podré tener acceso en la página web <span class="link-style">http://www.cun.edu.co</span>.
            </p>
        </div>

        <!-- Agregar el script de Bootstrap -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>
      `;


      return await this.sendEmail({
        to: [{ email_address: email, name: nombreEstudiante }],
        subject,
        htmlBody,
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
