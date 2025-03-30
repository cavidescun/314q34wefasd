import {
  Controller,
  Get,
  Param,
  HttpException,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { MetodologiasCarrerasService } from 'src/application/services/metodologias/metodologias.service';
import { MetodologiasCarreraResponseDto } from 'src/domain/metodologias/dto/metodologias.dto';

@ApiTags('metodologias')
@Controller('metodologias')
export class MetodologiasCarrerasController {
  private readonly logger = new Logger(MetodologiasCarrerasController.name);

  constructor(
    private readonly metodologiasCarrerasService: MetodologiasCarrerasService
  ) {}

  @Get(':nombreCarrera')
  @ApiOperation({
    summary: 'Obtener metodologías por nombre de carrera',
    description: 'Busca las metodologías disponibles para una carrera específica'
  })
  @ApiParam({
    name: 'nombreCarrera',
    required: true,
    description: 'Nombre de la carrera',
    example: 'INGENIERIA DE SISTEMAS'
  })
  @ApiResponse({
    status: 200,
    description: 'Metodologías recuperadas exitosamente',
    type: MetodologiasCarreraResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  async obtenerMetodologiasPorCarrera(
    @Param('nombreCarrera') nombreCarrera: string
  ): Promise<MetodologiasCarreraResponseDto> {
    try {
      return await this.metodologiasCarrerasService.obtenerMetodologiasPorCarrera(nombreCarrera);
    } catch (error) {
      this.logger.error(`Error en endpoint: ${error.message}`);
      throw error instanceof HttpException 
        ? error 
        : new HttpException(error.message, error.status || 500);
    }
  }
}