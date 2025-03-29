import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Logger,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ActualizarDatosAcademicosUseCase } from '../../application/services/actualizar-datos-academicos.service';
import { ActualizarDatosAcademicosDto } from 'src/domain/datos-academicos/dto/actualizar-datos-academicos.dto';

@ApiTags('datos-academicos')
@Controller('actualizar-datos-academicos')
export class ActualizarDatosAcademicosController {
  private readonly logger = new Logger(
    ActualizarDatosAcademicosController.name,
  );

  constructor(
    private readonly actualizarDatosAcademicosUseCase: ActualizarDatosAcademicosUseCase,
  ) {
    this.logger.log('ActualizarDatosAcademicosController inicializado');
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Actualizar datos académicos del estudiante',
    description:
      'Actualiza la carrera CUN, jornada, modalidad y ciudad de estudio del estudiante',
  })
  @ApiBody({ type: ActualizarDatosAcademicosDto })
  @ApiResponse({
    status: 200,
    description: 'Datos académicos actualizados correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o errores de procesamiento',
  })
  @ApiResponse({
    status: 404,
    description: 'Estudiante o homologación no encontrada',
  })
  async actualizarDatosAcademicos(
    @Body() actualizarDatosAcademicosDto: ActualizarDatosAcademicosDto,
  ) {
    try {
      const resultado = await this.actualizarDatosAcademicosUseCase.execute(
        actualizarDatosAcademicosDto,
      );

      if (!resultado.success) {
        this.logger.error(
          `Error en procesamiento: ${resultado.message}`,
          resultado.error,
        );

        const statusCode =
          resultado.error === 'Estudiante no encontrado' ||
          resultado.error === 'Homologaciones no encontradas'
            ? HttpStatus.NOT_FOUND
            : HttpStatus.BAD_REQUEST;

        throw new HttpException(
          {
            status: statusCode,
            error: resultado.message,
            details: resultado.error,
          },
          statusCode,
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
