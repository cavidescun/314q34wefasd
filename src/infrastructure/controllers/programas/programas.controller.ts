import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProgramasUnicosService } from 'src/application/services/programas/programas.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('programas')
@Controller('programas')
export class ProgramasUnicosController {
  constructor(private readonly programasUnicosService: ProgramasUnicosService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener programas únicos por institución',
    description: 'Devuelve una lista de programas únicos asociados a una institución específica'
  })
  @ApiQuery({
    name: 'institucion',
    required: true,
    description: 'Nombre de la institución a consultar',
    example: 'SERVICIO NACIONAL DE APRENDIZAJE - SENA'
  })
  @ApiResponse({
    status: 200,
    description: 'Programas únicos recuperados exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Programas únicos recuperados exitosamente' },
        data: { 
          type: 'array', 
          items: { type: 'string' },
          example: ['TECNOLOGÍA EN ANÁLISIS Y DESARROLLO DE SISTEMAS DE INFORMACIÓN', 
                   'TECNOLOGÍA EN GESTIÓN DE REDES DE DATOS']
        },
        institucion: { type: 'string', example: 'SERVICIO NACIONAL DE APRENDIZAJE - SENA' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetro de institución no proporcionado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'El nombre de la institución es requerido' }
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Error interno del servidor' }
      }
    }
  })
  async obtenerProgramasUnicos(@Query('institucion') nombreInstitucion: string) {
    try {
      if (!nombreInstitucion) {
        throw new HttpException('El nombre de la institución es requerido', HttpStatus.BAD_REQUEST);
      }
      return await this.programasUnicosService.obtenerProgramasUnicos(nombreInstitucion);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}