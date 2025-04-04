import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface ZohoAuthResponse {
  token: string;
  expires: Date;
}

export interface ZohoTicketResponse {
  status: boolean;
  code: number;
  ticket: {
    id?: string;
    ticketNumber?: string;
    modifiedTime?: string;
    statusType?: string;
    subject?: string;
    webUrl?: string;
    [key: string]: any;
  };
}

export interface ZohoCloseTicketResponse {
  success: boolean;
  message: string;
  data?: any;
}

@Injectable()
export class ZohoService {
  private readonly logger = new Logger(ZohoService.name);
  private readonly apiUrl: string;
  private authToken: string | null = null;
  private authExpires: Date | null = null;

  constructor(private readonly configService: ConfigService) {
    this.apiUrl = this.configService.get<string>('ZOHO_API_URL') || 'https://zoho.cunapp.pro/api';
  }

  /**
   * Obtiene un token de autenticación para la API de ZOHO
   */
  async getAuthToken(): Promise<string> {
    try {
      // Verificar si el token existe y es válido
      if (this.authToken && this.authExpires && new Date() < this.authExpires) {
        this.logger.debug('Usando token de autenticación existente');
        return this.authToken as string;
      }

      const username = this.configService.get<string>('ZOHO_USERNAME');
      const password = this.configService.get<string>('ZOHO_PASSWORD');

      if (!username || !password) {
        throw new Error('Credenciales de ZOHO no configuradas. Verifica las variables de entorno ZOHO_USERNAME y ZOHO_PASSWORD.');
      }

      this.logger.log(`Intentando autenticar con usuario '${username}' en ${this.apiUrl}/Login/Auth`);

      try {
        const response = await axios.post(
          `${this.apiUrl}/Login/Auth`,
          {
            username,
            password
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.data.token) {
          throw new Error('No se encontró token en la respuesta de ZOHO. Respuesta: ' + JSON.stringify(response.data));
        }

        this.authToken = response.data.token;
        // Establecer expiración para 2 horas (ajustar según la política de ZOHO)
        this.authExpires = new Date(Date.now() + 2 * 60 * 60 * 1000);
        
        this.logger.log('Autenticación exitosa con ZOHO');
        return this.authToken as string;
      } catch (authError: any) {
        if (authError.response) {
          // El servidor respondió con un código de estado diferente de 2xx
          this.logger.error(`Error de autenticación con ZOHO: Status ${authError.response.status}`);
          this.logger.error(`Detalles: ${JSON.stringify(authError.response.data)}`);
          
          if (authError.response.status === 401) {
            throw new Error(`Credenciales de ZOHO inválidas para el usuario '${username}'. Verifica que el usuario y contraseña sean correctos.`);
          }
        }
        throw authError;
      }
    } catch (error: any) {
      this.logger.error(`Error al obtener token ZOHO: ${error.message}`, error.stack);
      throw new Error(`Error de autenticación ZOHO: ${error.message}`);
    }
  }

  /**
   * Crea un ticket en ZOHO Desk para la homologación
   */
  async createTicket(
    studentData: {
      nombres: string;
      numeroDocumento: string;
      telefono: string;
      correoInstitucional: string;
      correoPersonal: string;
      programa: string;
      modalidad: string;
      periodo: string;
      sede: string;
    },
    requestData: {
      asunto: string;
      solicitud: string;
      categoria: string;
      categoria_2: string;
      categoria_3: string;
      descripcion: string;
    }
  ): Promise<ZohoTicketResponse> {
    try {
      const token = await this.getAuthToken();

      const formData = new FormData();
      
      // Información del estudiante
      formData.append('nombres', studentData.nombres);
      formData.append('telefono', studentData.telefono);
      formData.append('numero_documento', studentData.numeroDocumento);
      formData.append('correo_institucional', studentData.correoInstitucional);
      formData.append('correo_personal', studentData.correoPersonal);
      formData.append('programa', studentData.programa);
      formData.append('modalidad', studentData.modalidad);
      formData.append('periodo', studentData.periodo);
      formData.append('sede', studentData.sede);
      
      // Información de la solicitud
      formData.append('asunto', requestData.asunto);
      formData.append('solicitud', requestData.solicitud);
      formData.append('categoria', requestData.categoria);
      formData.append('categoria_2', requestData.categoria_2);
      formData.append('categoria_3', requestData.categoria_3);
      formData.append('descripcion', requestData.descripcion);
      
      // Habeas data obligatorio
      formData.append('habeas_data', 'FALSE');

      this.logger.log(`Creando ticket para estudiante: ${studentData.nombres}, documento: ${studentData.numeroDocumento}`);
      
      try {
        const response = await axios.post(
          `${this.apiUrl}/Desk/CreateTicket`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (!response.data.status || response.data.code !== 200) {
          throw new Error(`Error en respuesta ZOHO: ${JSON.stringify(response.data)}`);
        }

        this.logger.log(`Ticket creado exitosamente en ZOHO: ${response.data.ticket?.ticketNumber || 'N/A'}`);
        return response.data;
      } catch (ticketError: any) {
        if (ticketError.response) {
          this.logger.error(`Error al crear ticket en ZOHO: Status ${ticketError.response.status}`);
          this.logger.error(`Detalles: ${JSON.stringify(ticketError.response.data)}`);
          
          if (ticketError.response.status === 401) {
            // El token podría haber expirado, intentemos renovarlo y reintentar una vez
            this.logger.log('Token posiblemente expirado, intentando renovar y reintentar...');
            this.authToken = null;  // Forzar renovación del token
            this.authExpires = null;
            
            const newToken = await this.getAuthToken();
            
            const retryResponse = await axios.post(
              `${this.apiUrl}/Desk/CreateTicket`,
              formData,
              {
                headers: {
                  'Authorization': `Bearer ${newToken}`,
                  'Content-Type': 'multipart/form-data'
                }
              }
            );

            if (!retryResponse.data.status || retryResponse.data.code !== 200) {
              throw new Error(`Error en respuesta ZOHO (reintento): ${JSON.stringify(retryResponse.data)}`);
            }

            this.logger.log(`Ticket creado exitosamente en ZOHO (reintento): ${retryResponse.data.ticket?.ticketNumber || 'N/A'}`);
            return retryResponse.data;
          }
        }
        throw ticketError;
      }
    } catch (error: any) {
      this.logger.error(`Error al crear ticket ZOHO: ${error.message}`, error.stack);
      throw new Error(`Error al crear ticket en ZOHO: ${error.message}`);
    }
  }

  /**
   * Cierra un ticket existente en ZOHO
   * @param ticketNumber El número del ticket a cerrar
   * @param motivoCierre El motivo por el cual se cierra el ticket
   * @returns Un objeto con información sobre el resultado de la operación
   */
  async closeTicket(ticketNumber: string, motivoCierre: string): Promise<ZohoCloseTicketResponse> {
    try {
      this.logger.log(`Cerrando ticket ZOHO: ${ticketNumber}, motivo: ${motivoCierre}`);
      
      // Obtenemos la clave API del webhook desde la configuración
      const webhookKey = this.configService.get<string>('ZOHO_WEBHOOK_KEY') || 
                          '1001.8c7593e617cff651e51de85353497ee2.b19a587434229280cb5c7087ad05b3c8';
      
      try {
        // Realizamos la petición para cerrar el ticket
        const response = await axios.post(
          'https://flow.zoho.com/707796366/flow/webhook/incoming',
          {
            ticketNumber,
            motivoCierre
          },
          {
            params: {
              zapikey: webhookKey,
              isdebug: 'false'
            },
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        this.logger.log(`Ticket ${ticketNumber} cerrado exitosamente`);
        
        return {
          success: true,
          message: `Ticket ${ticketNumber} cerrado exitosamente`,
          data: response.data
        };
      } catch (closeError: any) {
        if (closeError.response) {
          this.logger.error(`Error al cerrar ticket en ZOHO: Status ${closeError.response.status}`);
          this.logger.error(`Detalles: ${JSON.stringify(closeError.response.data || 'Sin datos de respuesta')}`);
        }
        
        return {
          success: false,
          message: `Error al cerrar ticket en ZOHO: ${closeError.message}`,
          data: closeError.response?.data
        };
      }
    } catch (error: any) {
      this.logger.error(`Error general al cerrar ticket ZOHO: ${error.message}`, error.stack);
      return {
        success: false,
        message: `Error al cerrar ticket en ZOHO: ${error.message}`
      };
    }
  }
}