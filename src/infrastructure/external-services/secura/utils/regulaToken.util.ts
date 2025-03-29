import { Injectable } from '@nestjs/common';
import { EncryptionService } from './regulaEncryption.util';

export interface TokenResult {
  success: boolean;
  data?: string;
  message?: string;
}

@Injectable()
export class TokenGeneratorService {
  constructor(private readonly encryptionService: EncryptionService) {}

  /**
   * Genera un token encriptado basado en un correo electrónico y la fecha actual
   * @param email Correo electrónico para generar el token
   * @returns Objeto con el resultado de la operación y el token si es exitoso
   */
  generarTokenEmail(email: string): TokenResult {
    try {
      if (!email) {
        return {
          success: false,
          message: 'El correo electrónico no puede estar vacío.',
        };
      }

      // Generar fecha y hora formateada
      const now = new Date();
      const formattedDateTime = now.toISOString().replace(/[^0-9]/g, '').slice(0, 14);
      
      // Encriptar correo con fecha y hora
      const encryptedToken = this.encryptionService.encriptarAES(email, formattedDateTime);
      
      return {
        success: true,
        data: encryptedToken
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al generar token: ${error.message}`
      };
    }
  }

  /**
   * Valida si un token es válido y extrae la información
   * @param token Token encriptado
   * @returns Objeto con el resultado de la validación y los datos si es exitoso
   */
  validarToken(token: string): TokenResult {
    try {
      if (!token) {
        return {
          success: false,
          message: 'El token no puede estar vacío.',
        };
      }

      const decryptedData = this.encryptionService.desencriptarAES(token);
      const [email, timestamp] = decryptedData.split(' _ ');

      if (!email || !timestamp) {
        return {
          success: false,
          message: 'Formato de token inválido.',
        };
      }

      // Opcionalmente, puedes validar que el token no haya expirado
      // Convierte el timestamp a fecha y compara con la fecha actual

      return {
        success: true,
        data: email,
        message: 'Token válido'
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al validar token: ${error.message}`
      };
    }
  }
}