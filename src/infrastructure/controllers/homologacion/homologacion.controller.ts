import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { HomologacionService } from '../../../application/services/homologacion/homologacion.service';
import { EstatusHomologacion } from '../../../domain/homologaciones/entity/homologacion.entity';
import { ValidarDocumentosUseCase } from '../../../application/services/documentos/validar-documentos/validar-documentos.service';
import { DocumentosDto } from 'src/domain/documents/dto/documentos.dto';
import { ActualizarEstatusDto } from 'src/domain/homologaciones/dto/homologacion.dto';
import { HomologacionDto } from 'src/domain/homologaciones/dto/homologacion.dto';
import { HomologacionDetalleDto } from 'src/domain/homologaciones/detalle-homologacion/dto/homologaicon-detalle.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('homologaciones')
@Controller('homologaciones')
export class HomologacionController {
  constructor(
    private readonly homologacionService: HomologacionService,
    private readonly validarDocumentosUseCase: ValidarDocumentosUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener homologaciones por estatus',
    description: 'Retorna la lista detallada de homologaciones filtradas por estatus',
  })
  @ApiQuery({
    name: 'estatus',
    enum: EstatusHomologacion,
    required: true,
    description: 'Estatus de homologación',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista detallada de homologaciones recuperada exitosamente',
    schema: {
      properties: {
        message: { type: 'string', example: 'Homologaciones con estatus Pendiente recuperadas exitosamente' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id_homologacion: { type: 'string', example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6' },
              fecha: { type: 'string', format: 'date-time', example: '2023-06-30T15:30:45.123Z' },
              numeroDocumento: { type: 'string', example: '1023456789' },
              nombreCompleto: { type: 'string', example: 'Juan Pérez González' },
              celular: { type: 'string', example: '3121234567' },
              nivelEstudio: { type: 'string', example: 'Pregrado' },
              carreraHom: { type: 'string', example: 'Ingeniería Informática' },
              carreraCun: { type: 'string', example: 'Ingeniería de Sistemas' },
              estado: { type: 'string', example: 'Pendiente' },
              jornada: { type: 'string', example: 'Diurna' },
              modalidad: { type: 'string', example: 'Presencial' },
              ciudad: { type: 'string', example: 'Bogotá' },
              documentos: { 
                type: 'array',
                items: { type: 'string' },
                example: ['https://storage.example.com/documents/doc1.pdf']
              },
              observaciones: { type: 'string', example: 'Sin observaciones' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Estatus no especificado',
  })
  async obtenerTodas(@Query('estatus') estatus?: EstatusHomologacion) {
    try {
      return await this.homologacionService.obtenerHomologacionesPorEstatus(estatus);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('detalles')
  @ApiOperation({
    summary: 'Obtener detalles completos de todas las homologaciones',
    description: 'Retorna información detallada de todas las homologaciones, incluyendo datos del estudiante y documentos'
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles de homologaciones recuperados exitosamente',
    type: [HomologacionDetalleDto]
  })
  async obtenerDetallesHomologaciones() {
    try {
      return await this.homologacionService.obtenerDetallesHomologaciones();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener homologación por ID',
    description: 'Retorna los datos de una homologación específica por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la homologación (UUID)',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  })
  async obtenerPorId(@Param('id') id: string) {
    try {
      return await this.homologacionService.obtenerHomologacionPorId(id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('estudiante/:estudianteId')
  @ApiOperation({
    summary: 'Obtener homologaciones por estudiante',
    description:
      'Retorna las homologaciones asociadas a un estudiante específico',
  })
  @ApiParam({
    name: 'estudianteId',
    description: 'ID del estudiante (UUID)',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  })
  async obtenerPorEstudianteId(@Param('estudianteId') estudianteId: string) {
    try {
      return await this.homologacionService.obtenerHomologacionesPorEstudianteId(estudianteId);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Crear homologación',
    description: 'Crea una nueva homologación para un estudiante',
  })
  @ApiBody({ type: HomologacionDto })
  async crear(@Body() homologacionDto: HomologacionDto) {
    try {
      return await this.homologacionService.crearHomologacion(homologacionDto);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async actualizar(
    @Param('id') id: string,
    @Body() homologacionDto: HomologacionDto,
  ) {
    try {
      return await this.homologacionService.actualizarHomologacion(id, homologacionDto);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put(':id/estatus')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Actualizar estatus de una homologación',
    description: 'Actualiza el estatus de una homologación específica con validaciones de negocio y observaciones opcionales'
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la homologación (UUID)',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6'
  })
  @ApiBody({ type: ActualizarEstatusDto })
  @ApiResponse({
    status: 200,
    description: 'Estatus de homologación actualizado exitosamente',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: "Estatus de homologación actualizado exitosamente a 'Aprobado'" },
        data: {
          type: 'object',
          properties: {
            homologacion: { type: 'object' },
            observaciones: { type: 'string', example: 'Documentación completa y verificada' },
            cambioRealizado: {
              type: 'object',
              properties: {
                estatusAnterior: { type: 'string', example: 'Pendiente' },
                nuevoEstatus: { type: 'string', example: 'Aprobado' },
                fecha: { type: 'string', format: 'date-time' }
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la validación o regla de negocio'
  })
  @ApiResponse({
    status: 404,
    description: 'Homologación no encontrada'
  })
  async actualizarEstatus(
    @Param('id') id: string,
    @Body() actualizarEstatusDto: ActualizarEstatusDto,
  ) {
    try {
      return await this.homologacionService.actualizarEstatusHomologacion(
        id, 
        actualizarEstatusDto.estatus,
        actualizarEstatusDto.observaciones
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Post(':id/documentos')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async agregarDocumentos(
    @Param('id') homologacionId: string,
    @Body() documentosDto: Omit<DocumentosDto, 'homologacionId'>,
  ) {
    try {
      return await this.homologacionService.agregarDocumentos(homologacionId, documentosDto);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}