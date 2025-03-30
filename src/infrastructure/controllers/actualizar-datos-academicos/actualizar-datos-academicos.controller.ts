import {
  Controller,
  Post,
  Body,
  HttpException,
  Logger,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ActualizarDatosAcademicosUseCase } from '../../../application/services/datos-academicos/actualizar-datos-academicos.service';
import { ActualizarDatosAcademicosDto } from 'src/domain/datos-academicos/dto/actualizar-datos-academicos.dto';

@ApiTags('datos-academicos')
@Controller('actualizar-datos-academicos')
export class ActualizarDatosAcademicosController {
  private readonly logger = new Logger(ActualizarDatosAcademicosController.name);

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
      return await this.actualizarDatosAcademicosUseCase.execute(actualizarDatosAcademicosDto);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}