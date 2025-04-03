import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  HttpException,
  Logger,
  UsePipes,
  ValidationPipe,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ProcesarRegistroInicialUseCase } from '../../../application/services/registro-inicial/procesar-registro-inicial.service';
import { RegistroInicialDto } from 'src/domain/registro-inicial/dto/registro-inicial.dto';

@ApiTags('registro-inicial')
@Controller('registro-inicial')
export class RegistroInicialController {
  private readonly logger = new Logger(RegistroInicialController.name);

  constructor(
    private readonly procesarRegistroInicialUseCase: ProcesarRegistroInicialUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('documento'))
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    summary: 'Procesar registro inicial',
    description:
      'Recolecta información de contacto, procesa el documento de identidad mediante OCR y crea los registros correspondientes en el sistema',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        celular: { type: 'string', example: '3001234567' },
        numFijo: { type: 'string', example: '6011234567' },
        email: { type: 'string', example: 'estudiante@ejemplo.com' },
        documento: {
          type: 'string',
          format: 'binary',
          description: 'Documento de identidad en formato PDF',
        },
      },
      required: ['celular', 'email', 'documento'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Proceso registrado exitosamente o se informó sobre un proceso pendiente existente',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        message: { 
          type: 'string', 
          example: 'Registro inicial procesado exitosamente / Ya existe un proceso de homologación pendiente para este estudiante' 
        },
        data: {
          type: 'object',
          properties: {
            estudiante: { type: 'object' },
            contact: { type: 'object' },
            homologacion: { type: 'object' },
            ocr_result: {
              type: 'object',
              properties: {
                nombreCompleto: { type: 'string' },
                numeroIdentificacion: { type: 'string' }
              }
            },
            procesoExistente: { type: 'boolean' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Error en los datos proporcionados o documento inválido',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async procesarRegistroInicial(
    @Body() registroDto: RegistroInicialDto,
    @UploadedFile() documento: Express.Multer.File,
  ) {
    try {
      if (!documento) {
        throw new HttpException('El documento de identidad es requerido', HttpStatus.BAD_REQUEST);
      }

      if (documento.mimetype !== 'application/pdf') {
        throw new HttpException('El documento debe ser un archivo PDF', HttpStatus.BAD_REQUEST);
      }

      const resultado = await this.procesarRegistroInicialUseCase.execute(
        registroDto,
        documento.buffer,
      );
      
      return resultado;
    } catch (error) {
      this.logger.error(`Error al procesar registro inicial: ${error.message}`, error.stack);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          success: false,
          message: 'Error al procesar el registro inicial',
          error: error.message || 'Error desconocido',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}