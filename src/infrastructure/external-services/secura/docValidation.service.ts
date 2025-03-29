import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import * as FormData from 'form-data';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { SecuraAuthService } from '../secura/secura-auth/auth.service';



export interface DocumentValidationResult {
  status: 'valid' | 'invalid' | 'error';
  message: string;
  documentData?: Record<string, any>;
}

export interface DocumentValidationService {
  validarDocumento(documento: Buffer): Promise<DocumentValidationResult>;
}

@Injectable()
export class OcrDocValidationService implements DocumentValidationService {
  private readonly logger = new Logger(OcrDocValidationService.name);
  private readonly ocrEndpoint: string;
  private readonly ocrEmail: string;
  private readonly tempDir: string;

  constructor(
    @Inject(SecuraAuthService) private readonly authService: SecuraAuthService,
    private readonly configService: ConfigService,
  ) {
    this.ocrEndpoint =  configService.get<string>('OCR_ENDPOINT') ||
      'https://legantocc.cunapp.pro/api/Lector/LeerDocumento/';
    this.ocrEmail = configService.get<string>('OCR_EMAIL') || 'fabrica_software@cun.edu.co';
    this.tempDir = this.configService.get<string>(
      'TEMP_DIR',
      path.join(process.cwd(), 'temp'),
    );

    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  async validarDocumento(documento: Buffer): Promise<DocumentValidationResult> {
    try {
      const token = await this.authService.generateToken(this.ocrEmail);

      if (typeof token !== 'string') {
        this.logger.error('No se pudo generar el token de autenticación');
        return {
          status: 'error',
          message: 'No se pudo generar el token de autenticación',
        };
      }

      const tempFileName = `${uuidv4()}.pdf`;
      const tempFilePath = path.join(this.tempDir, tempFileName);

      try {
        fs.writeFileSync(tempFilePath, documento);

        const formData = new FormData();
        formData.append('documento', fs.createReadStream(tempFilePath));

        const response = await axios.post(this.ocrEndpoint, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            ...formData.getHeaders(),
          },
          timeout: 30000,
        });

        const responseData = response.data;

        // Procesar respuesta
        if (response.status !== 200) {
          this.logger.warn(
            `Respuesta no exitosa del servicio OCR: ${response.status}`,
          );
          return {
            status: 'error',
            message: `Error en la validación del documento: ${response.statusText}`,
          };
        }

        if (!responseData || !responseData.numeroDocumento) {
          return {
            status: 'invalid',
            message: 'Documento no válido o ilegible',
          };
        }

        return {
          status: 'valid',
          message: 'Documento válido',
          documentData: responseData,
        };
      } finally {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      }
    } catch (error) {
      this.logger.error(
        `Error en la validación OCR: ${error.message}`,
        error.stack,
      );

      return {
        status: 'error',
        message: `Error en la validación del documento: ${error.message}`,
      };
    }
  }
}
