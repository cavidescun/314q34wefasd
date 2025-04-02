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
import { MateriasHomologacionService } from 'src/application/services/materias/materias.service';
import { ConsultaMateriasDto } from 'src/domain/materias/dto/materias.dto';
import { MateriasResponseDto } from 'src/domain/materias/materia-response/dto/meteria-response.dto';

@ApiTags('materias-homologacion')
@Controller('materias-homologacion')
export class MateriasHomologacionController {
  private readonly logger = new Logger(MateriasHomologacionController.name);

  constructor(
    private readonly materiasHomologacionService: MateriasHomologacionService,
  ) {
    this.logger.log('MateriasHomologacionController inicializado');
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Consultar materias para homologación',
    description:
      'Obtiene las materias disponibles para homologación según código de unidad, código de pensum y semestre',
  })
  @ApiBody({ type: ConsultaMateriasDto })
  @ApiResponse({
    status: 200,
    description: 'Lista de materias encontradas',
    type: MateriasResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetros inválidos',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async consultarMaterias(
    @Body() consultaMateriasDto: ConsultaMateriasDto,
  ): Promise<MateriasResponseDto> {
    try {
      return await this.materiasHomologacionService.obtenerMateriasPorParametros(consultaMateriasDto);
    } catch (error) {
      this.logger.error(`Error al procesar consulta de materias: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, error.status || 500);
    }
  }
}