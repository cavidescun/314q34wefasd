import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Logger,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ProcesarRegistroInicialUseCase } from '../../application/services/procesar-registro-inicial.service';
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
  @UsePipes(new ValidationPipe({ transform: true })) // Añadimos ValidationPipe localmente
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
  async procesarRegistroInicial(
    @Body() registroDto: RegistroInicialDto,
    @UploadedFile() documento: Express.Multer.File,
  ) {
    try {
      if (!documento) {
        this.logger.error('Error: No se recibió ningún documento');
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'El documento de identidad es requerido',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (documento.mimetype !== 'application/pdf') {
        this.logger.error(
          `Error: Tipo de archivo inválido - ${documento.mimetype}`,
        );
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'El documento debe ser un archivo PDF',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const resultado = await this.procesarRegistroInicialUseCase.execute(
        registroDto,
        documento.buffer,
      );

      if (!resultado.success) {
        this.logger.error(
          `Error en procesamiento: ${resultado.message}`,
          resultado.error,
        );
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: resultado.message,
            details: resultado.error,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        message: resultado.message,
        data: {
          ...resultado.data,
          ocr_data: {
            nombreCompleto: resultado.data?.estudiante?.nombreCompleto,
            numeroIdentificacion:
              resultado.data?.estudiante?.numeroIdentificacion,
          },
        },
      };
    } catch (error) {
      if (!(error instanceof HttpException)) {
        this.logger.error(
          `Error no controlado en registro inicial: ${error.message}`,
          error.stack,
        );
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Error interno del servidor',
            details: error.message,
            stack:
              process.env.NODE_ENV === 'production' ? undefined : error.stack,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw error;
    }
  }
}