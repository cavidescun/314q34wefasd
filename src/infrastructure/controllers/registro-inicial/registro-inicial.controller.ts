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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
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
  async procesarRegistroInicial(
    @Body() registroDto: RegistroInicialDto,
    @UploadedFile() documento: Express.Multer.File,
  ) {
    try {
      if (!documento) {
        throw new Error('El documento de identidad es requerido');
      }

      if (documento.mimetype !== 'application/pdf') {
        throw new Error('El documento debe ser un archivo PDF');
      }

      return await this.procesarRegistroInicialUseCase.execute(
        registroDto,
        documento.buffer,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}