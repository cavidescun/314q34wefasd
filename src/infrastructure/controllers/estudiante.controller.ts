import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EstudianteService } from '../../application/services/estudiante.service';
import { ObtenerEstudianteUseCase } from '../../application/services/obtener-estudiante.service';
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
      const estudiantes = await this.estudianteService.getAllEstudiantes();
      return {
        message: 'Estudiantes recuperados exitosamente',
        data: estudiantes,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
  @ApiResponse({
    status: 200,
    description: 'Estudiante recuperado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Estudiante no encontrado' })
  async obtenerPorId(@Param('id') id: string) {
    try {
      const estudiante = await this.obtenerEstudianteUseCase.execute(id);

      if (!estudiante) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `No existe un estudiante con el id ${id}`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Estudiante recuperado exitosamente',
        data: estudiante,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('identificacion/:numeroIdentificacion')
  async obtenerPorIdentificacion(
    @Param('numeroIdentificacion') numeroIdentificacion: string,
  ) {
    try {
      const estudiante =
        await this.estudianteService.getEstudianteByIdentificacion(
          numeroIdentificacion,
        );

      if (!estudiante) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `No existe un estudiante con el número de identificación ${numeroIdentificacion}`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Estudiante recuperado exitosamente',
        data: estudiante,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async actualizar(
    @Param('id') id: string,
    @Body() estudiante: EstudianteUpdateDto,
  ) {
    try {
      const estudianteActualizado =
        await this.estudianteService.updateEstudiante(id, estudiante);

      return {
        message: 'Estudiante actualizado exitosamente',
        data: estudianteActualizado,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
