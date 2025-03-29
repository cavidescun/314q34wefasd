import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Logger,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ActualizarHomologacionUseCase } from '../../application/services/actualizar-homologacion.service';
import { ActualizarHomologacionDto } from 'src/domain/homologaciones/actualizar-homologacion/dto/actualizar-homologacion.dto';
import { multerOptions } from '../interface/common/multer/multer.config';

@ApiTags('actualizar-homologacion')
@Controller('actualizar-homologacion')
export class ActualizarHomologacionController {
  private readonly logger = new Logger(ActualizarHomologacionController.name);

  constructor(
    private readonly actualizarHomologacionUseCase: ActualizarHomologacionUseCase,
  ) {
    this.logger.log('ActualizarHomologacionController inicializado');
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'tituloBachiller', maxCount: 1 },
        { name: 'titulo', maxCount: 1 },
        { name: 'sabanaNotas', maxCount: 1 },
        { name: 'cartaHomologacion', maxCount: 1 },
        { name: 'contenidosProgramaticos', maxCount: 1 },
      ],
      multerOptions,
    ),
  )
  @ApiOperation({
    summary: 'Actualizar información de homologación y adjuntar documentos',
    description:
      'Actualiza la información académica de un estudiante y permite adjuntar los documentos necesarios para la homologación.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        numeroIdentificacion: { type: 'string', example: '1023456789' },
        institucion: { type: 'string', example: 'Universidad Nacional' },
        carreraHom: { type: 'string', example: 'Ingeniería Informática' },
        fechaGrado: { type: 'string', format: 'date', example: '2023-06-30' },
        tituloBachiller: {
          type: 'string',
          format: 'binary',
          description: 'PDF del título de bachiller',
        },
        titulo: {
          type: 'string',
          format: 'binary',
          description: 'PDF del título a homologar',
        },
        sabanaNotas: {
          type: 'string',
          format: 'binary',
          description: 'PDF de la sabana de notas',
        },
        cartaHomologacion: {
          type: 'string',
          format: 'binary',
          description: 'PDF de la carta de homologación',
        },
        contenidosProgramaticos: {
          type: 'string',
          format: 'binary',
          description: 'PDF de los contenidos programáticos',
        },
      },
      required: [
        'numeroIdentificacion',
        'institucion',
        'carreraHom',
        'fechaGrado',
      ],
    },
  })
  async actualizarHomologacion(
    @Body() actualizarHomologacionDto: ActualizarHomologacionDto,
    @UploadedFiles()
    files: {
      tituloBachiller?: Express.Multer.File[];
      titulo?: Express.Multer.File[];
      sabanaNotas?: Express.Multer.File[];
      cartaHomologacion?: Express.Multer.File[];
      contenidosProgramaticos?: Express.Multer.File[];
    },
  ) {
    try {
      const archivos = {
        tituloBachiller: files.tituloBachiller?.[0]?.buffer,
        titulo: files.titulo?.[0]?.buffer,
        sabanaNotas: files.sabanaNotas?.[0]?.buffer,
        cartaHomologacion: files.cartaHomologacion?.[0]?.buffer,
        contenidosProgramaticos: files.contenidosProgramaticos?.[0]?.buffer,
      };

      const resultado = await this.actualizarHomologacionUseCase.execute(
        actualizarHomologacionDto,
        archivos,
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
        data: resultado.data,
      };
    } catch (error) {
      this.logger.error(`Mensaje: ${error.message}`);

      if (error.stack) {
        this.logger.error(`Stack trace: ${error.stack}`);
      }

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error interno del servidor',
          message: error.message,
          stack:
            process.env.NODE_ENV === 'production' ? undefined : error.stack,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
