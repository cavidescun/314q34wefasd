import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EncryptionService {
  private readonly encryptKey: string;
  private readonly encryptVector: string;

  constructor(private readonly configService: ConfigService) {
    (this.encryptKey =
      configService.get<string>('SECURA_ENCRYPT_KEY') || '123'),
      (this.encryptVector =
        configService.get<string>('SECURA_ENCRYPT_VECTOR') || '123');

    if (!this.encryptKey || !this.encryptVector) {
      console.warn(
        'SECURA_ENCRYPT_KEY o SECURA_ENCRYPT_VECTOR no están configurados',
      );
    }
  }

  /**
   * Encripta un correo junto con una marca de tiempo usando AES-256-CBC
   * @param correo Correo a encriptar
   * @param formattedDateTime Fecha y hora formateada
   * @returns Texto encriptado en formato hexadecimal
   */
  encriptarAES(correo: string, formattedDateTime: string): string {
    try {
      const cipher = crypto.createCipheriv(
        'aes-256-cbc',
        Buffer.from(this.encryptKey, 'utf-8'),
        Buffer.from(this.encryptVector, 'utf-8'),
      );

      let encrypted = cipher.update(
        `${correo} _ ${formattedDateTime}`,
        'utf-8',
        'hex',
      );

      encrypted += cipher.final('hex');
      return encrypted;
    } catch (error) {
      console.error('Error al encriptar datos:', error.message);
      throw new Error('Error al encriptar los datos');
    }
  }

  /**
   * Desencripta un texto encriptado con AES-256-CBC
   * @param encryptedText Texto encriptado en formato hexadecimal
   * @returns Texto desencriptado
   */
  desencriptarAES(encryptedText: string): string {
    try {
      const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        Buffer.from(this.encryptKey, 'utf-8'),
        Buffer.from(this.encryptVector, 'utf-8'),
      );

      let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
      decrypted += decipher.final('utf-8');

      return decrypted;
    } catch (error) {
      console.error('Error al desencriptar datos:', error.message);
      throw new Error('Error al desencriptar los datos');
    }
  }
}
