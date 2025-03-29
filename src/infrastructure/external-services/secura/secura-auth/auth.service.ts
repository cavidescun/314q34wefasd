import { Injectable, Logger } from '@nestjs/common';
import { TokenGeneratorService } from '../utils/regulaToken.util';
import { TokenResult } from '../utils/regulaToken.util';

@Injectable()
export class SecuraAuthService {
  private readonly logger = new Logger(SecuraAuthService.name);

  constructor(private readonly tokenGeneratorService: TokenGeneratorService) {}

  /**
   * Genera un token encriptado para un correo electrónico
   * @param email Correo electrónico para el que se generará el token
   * @returns Token string si es exitoso, o un objeto con información de error
   */
  generateToken(email: string): string | TokenResult {
    try {
      const tokenResult = this.tokenGeneratorService.generarTokenEmail(email);
      
      if (tokenResult.success && tokenResult.data) {
        return tokenResult.data;
      } else {
        this.logger.error(`Error generando token: ${tokenResult.message}`);
        return tokenResult;
      }
    } catch (error) {
      this.logger.error(`Error inesperado generando token: ${error.message}`, error.stack);
      return {
        success: false,
        message: `Error generando token: ${error.message}`
      };
    }
  }
}