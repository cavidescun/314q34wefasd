import {
  Controller,
  Get,
  Query,
  HttpException,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SedesCarrerasService } from 'src/application/services/ciudades/ciudades.service';
import { SedesCarrerasResponseDto } from 'src/domain/ciudades/dto/ciudades.dto';

@ApiTags('ciudades-carreras')
@Controller('ciudades-carreras')
export class SedesCarrerasController {
  private readonly logger = new Logger(SedesCarrerasController.name);

  constructor(
    private readonly sedesCarrerasService: SedesCarrerasService
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener ciudaes por carrera, modalidad y jornada',
    description: 'Busca las sedes disponibles según la carrera, modalidad y jornada especificadas, devolviendo los nombres de las ciudades'
  })
  @ApiQuery({
    name: 'carrera',
    required: true,
    description: 'Nombre de la carrera',
    example: 'INGENIERIA DE SISTEMAS'
  })
  @ApiQuery({
    name: 'modalidad',
    required: true,
    description: 'Modalidad de estudio',
    example: 'PRESENCIAL'
  })
  @ApiQuery({
    name: 'jornada',
    required: true,
    description: 'Jornada de estudio',
    enum: ['DIURNA', 'NOCTURNA'],
    example: 'DIURNA'
  })
  @ApiResponse({
    status: 200,
    description: 'Sedes recuperadas exitosamente',
    type: SedesCarrerasResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  async obtenerSedesPorCarreraModalidadJornada(
    @Query('carrera') carrera: string,
    @Query('modalidad') modalidad: string,
    @Query('jornada') jornada: string
  ): Promise<SedesCarrerasResponseDto> {
    try {
      return await this.sedesCarrerasService.obtenerSedesPorCarreraModalidadJornada(
        carrera, 
        modalidad, 
        jornada
      );
    } catch (error) {
      this.logger.error(`Error en endpoint: ${error.message}`);
      throw error instanceof HttpException 
        ? error 
        : new HttpException(error.message, error.status || 500);
    }
  }
}