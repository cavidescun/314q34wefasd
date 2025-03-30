import {
  Controller,
  Get,
  Query,
  HttpException,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JornadasPensumService } from 'src/application/services/jornadas/jornadas.service';
import { JornadasPensumResponseDto } from 'src/domain/jornadas/dto/jornadas.dto';

@ApiTags('jornadas')
@Controller('jornadas')
export class JornadasPensumController {
  private readonly logger = new Logger(JornadasPensumController.name);

  constructor(
    private readonly jornadasPensumService: JornadasPensumService
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener jornadas de pensum por carrera y modalidad',
    description: 'Busca las jornadas disponibles para una carrera y modalidad específicas, determinando si son diurnas o nocturnas'
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
  @ApiResponse({
    status: 200,
    description: 'Jornadas de pensum recuperadas exitosamente',
    type: JornadasPensumResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  async obtenerJornadasPensum(
    @Query('carrera') carrera: string,
    @Query('modalidad') modalidad: string
  ): Promise<JornadasPensumResponseDto> {
    try {
      return await this.jornadasPensumService.obtenerJornadasPensum(carrera, modalidad);
    } catch (error) {
      this.logger.error(`Error en endpoint: ${error.message}`);
      throw error instanceof HttpException 
        ? error 
        : new HttpException(error.message, error.status || 500);
    }
  }
}