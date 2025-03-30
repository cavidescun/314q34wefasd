import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

export interface StorageServiceInterface {
  subirDocumento(
    numeroIdentificacion: string, 
    tipoDocumento: string, 
    buffer: Buffer, 
    contentType?: string
  ): Promise<string>;
  eliminarDocumento(nombreArchivo: string): Promise<boolean>;
  generarUrlDocumento(nombreArchivo: string): string;
}

@Injectable()
export class S3StorageService implements StorageServiceInterface {
  private readonly s3: S3Client;
  private readonly bucketName: string;
  private readonly region: string;
  private readonly logger = new Logger(S3StorageService.name);

  constructor(private readonly configService: ConfigService) {
    this.region = configService.get<string>('AWS_REGION') || '';
    this.bucketName = configService.get<string>('AWS_BUCKET_NAME') || '';
    
    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY') ||'',
      },
    });

    if (!this.bucketName) {
      this.logger.warn('AWS_BUCKET_NAME no está configurado');
    }
  }

  async subirDocumento(
    numeroIdentificacion: string, 
    tipoDocumento: string, 
    buffer: Buffer, 
    contentType: string = 'application/pdf'
  ): Promise<string> {
    try {
      if (!this.bucketName) {
        throw new Error('AWS_BUCKET_NAME no está configurado');
      }
      const fileName = `${numeroIdentificacion}_${tipoDocumento}.pdf`;
      const key = `documentos/${numeroIdentificacion}/${fileName}`;

      const params = {
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      };

      await this.s3.send(new PutObjectCommand(params));
      const url = this.generarUrlDocumento(key);

      return url;
    } catch (error) {
      this.logger.error(`Error subiendo documento: ${error.message}`, error.stack);
      throw new Error(`No se pudo subir el documento: ${error.message}`);
    }
  }

  async eliminarDocumento(nombreArchivo: string): Promise<boolean> {
    try {
      if (!this.bucketName) {
        throw new Error('AWS_BUCKET_NAME no está configurado');
      }
      
      const params = {
        Bucket: this.bucketName,
        Key: nombreArchivo,
      };

      await this.s3.send(new DeleteObjectCommand(params));
      
      return true;
    } catch (error) {
      this.logger.error(`Error eliminando documento: ${error.message}`, error.stack);
      return false;
    }
  }

  generarUrlDocumento(key: string): string {
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
  }
}