import { Injectable } from '@nestjs/common';
import { TextractClient, StartDocumentTextDetectionCommand, GetDocumentTextDetectionCommand, Block } from '@aws-sdk/client-textract';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TextractService {
  private readonly client: TextractClient;

  // constructor(private readonly configService: ConfigService) {
  //   this.client = new TextractClient({
  //     region: this.configService.get<string>('AWS_REGION'),
  //     credentials: {
  //       accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
  //       secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
  //     },
  //   });
  // }

  // async analyzeDocument(bucket: string, documentKey: string): Promise<string> {
  //   try {
  //     const command = new StartDocumentTextDetectionCommand({
  //       DocumentLocation: { S3Object: { Bucket: bucket, Name: documentKey } },
  //     });

  //     const response = await this.client.send(command);
  //     return response.JobId;
  //   } catch (error) {
  //     throw new Error(`Error al analizar el documento: ${error.message}`);
  //   }
  // }

  // async getAnalysisResult(jobId: string): Promise<any> {
  //   try {
  //     const command = new GetDocumentTextDetectionCommand({ JobId: jobId });
  //     const response = await this.client.send(command);

  //     if (response.Blocks) {
  //       return this.extractDiplomaInfo(response.Blocks);
  //     }

  //     throw new Error('No se encontraron datos en el documento.');
  //   } catch (error) {
  //     throw new Error(`Error al obtener los resultados del análisis: ${error.message}`);
  //   }
  // }

  // private extractDiplomaInfo(blocks: Block[]): any {
  //   const extractedData = {
  //     nombre: '',
  //     numero_identidad: '',
  //     titulo: '',
  //     fecha: '',
  //     institucion: '',
  //   };

  //   blocks.forEach(block => {
  //     if (block.BlockType === 'LINE' && block.Text) {
  //       const text = block.Text.toLowerCase();

  //       if (text.includes('nombre') || text.includes('estudiante')) {
  //         extractedData.nombre = block.Text;
  //       } else if (text.includes('identidad') || text.includes('cédula')) {
  //         extractedData.numero_identidad = block.Text;
  //       } else if (text.includes('título') || text.includes('profesional')) {
  //         extractedData.titulo = block.Text;
  //       } else if (text.includes('fecha') || /\d{2}\/\d{2}\/\d{4}/.test(text)) {
  //         extractedData.fecha = block.Text;
  //       } else if (text.includes('universidad') || text.includes('instituto')) {
  //         extractedData.institucion = block.Text;
  //       }
  //     }
  //   });

  //   return extractedData;
  // }
}
