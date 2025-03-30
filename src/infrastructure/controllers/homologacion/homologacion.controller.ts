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
    description: 'Retorna la lista de homologaciones filtradas por estatus',
  })
  @ApiQuery({
    name: 'estatus',
    enum: EstatusHomologacion,
    required: true,
    description: 'Estatus de homologación',
  })
  async obtenerTodas(@Query('estatus') estatus?: EstatusHomologacion) {
    try {
      return await this.homologacionService.obtenerHomologacionesPorEstatus(estatus);
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
  async actualizarEstatus(
    @Param('id') id: string,
    @Body() { estatus }: ActualizarEstatusDto,
  ) {
    try {
      return await this.homologacionService.actualizarEstatusHomologacion(id, estatus);
    } catch (error) {
      throw new HttpException(error.message, error.status);
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