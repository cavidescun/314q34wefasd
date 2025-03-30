import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  HttpException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EstudianteService } from '../../../application/services/estudiantes/estudiante.service';
import { ObtenerEstudianteUseCase } from '../../../application/services/estudiantes/obteber-estudiantes/obtener-estudiante.service';
import { EstudianteUpdateDto } from 'src/domain/estudiante/dto/estudiante.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('estudiantes')
@Controller('estudiantes')
export class EstudianteController {
  constructor(
    private readonly estudianteService: EstudianteService,
    private readonly obtenerEstudianteUseCase: ObtenerEstudianteUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los estudiantes',
    description: 'Retorna la lista completa de estudiantes',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de estudiantes recuperada exitosamente',
  })
  async obtenerTodos() {
    try {
      return await this.estudianteService.obtenerTodosLosEstudiantes();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener estudiante por ID',
    description: 'Retorna los datos de un estudiante específico por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del estudiante (UUID)',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  })
  async obtenerPorId(@Param('id') id: string) {
    try {
      return await this.estudianteService.obtenerEstudiantePorId(id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('identificacion/:numeroIdentificacion')
  async obtenerPorIdentificacion(
    @Param('numeroIdentificacion') numeroIdentificacion: string,
  ) {
    try {
      return await this.estudianteService.obtenerEstudiantePorIdentificacion(numeroIdentificacion);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async actualizar(
    @Param('id') id: string,
    @Body() estudiante: EstudianteUpdateDto,
  ) {
    try {
      return await this.estudianteService.actualizarEstudiante(id, estudiante);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}