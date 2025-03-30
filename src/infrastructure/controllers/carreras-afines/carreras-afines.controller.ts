import {
  Controller,
  Get,
  Param,
  HttpException,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CarrerasAfinesService } from '../../../application/services/carreras-afines/carreras-afines.service';
import { CarrerasAfinesResponseDto } from 'src/domain/carreras-afines/dto/carreras-afines.dto';

@ApiTags('carreras-afines')
@Controller('carreras-afines')
export class CarrerasAfinesController {
  private readonly logger = new Logger(CarrerasAfinesController.name);

  constructor(
    private readonly carrerasAfinesService: CarrerasAfinesService
  ) {}

  @Get('documento/:numeroDocumento')
  @ApiOperation({
    summary: 'Obtener carreras afines por número de documento',
    description: 'Busca las carreras afines basadas en la información de homologación del estudiante'
  })
  @ApiParam({
    name: 'numeroDocumento',
    required: true,
    description: 'Número de documento del estudiante',
    example: '1023456789'
  })
  @ApiResponse({
    status: 200,
    description: 'Carreras afines recuperadas exitosamente',
    type: CarrerasAfinesResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Estudiante o homologación no encontrada',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de homologación incompletos',
  })
  async obtenerCarrerasAfinesPorDocumento(
    @Param('numeroDocumento') numeroDocumento: string
  ): Promise<CarrerasAfinesResponseDto> {
    try {
      return await this.carrerasAfinesService.obtenerCarrerasAfinesPorDocumento(numeroDocumento);
    } catch (error) {
      this.logger.error(`Error en endpoint: ${error.message}`);
      throw error instanceof HttpException 
        ? error 
        : new HttpException(error.message, error.status || 500);
    }
  }
}