import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { HomologacionService } from '../../application/services/homologacion.service';
import {
  EstatusHomologacion,
  Homologacion,
} from '../../domain/homologaciones/entity/homologacion.entity';
import { ValidarDocumentosUseCase } from '../../application/services/validad-documentos.service';
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
  @ApiResponse({
    status: 200,
    description: 'Homologaciones recuperadas exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Estatus no válido o no especificado',
  })
  async obtenerTodas(@Query('estatus') estatus?: EstatusHomologacion) {
    try {
      let homologaciones: Homologacion[];

      if (estatus) {
        homologaciones =
          await this.homologacionService.getHomologacionesByEstatus(estatus);
      } else {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error:
              'Debe especificar un estatus para filtrar las homologaciones',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        message: 'Homologaciones recuperadas exitosamente',
        data: homologaciones,
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
  @ApiResponse({
    status: 200,
    description: 'Homologación recuperada exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Homologación no encontrada' })
  async obtenerPorId(@Param('id') id: string) {
    try {
      const homologacion =
        await this.homologacionService.getHomologacionById(id);

      if (!homologacion) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `No existe una homologación con el id ${id}`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Homologación recuperada exitosamente',
        data: homologacion,
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
  @ApiResponse({
    status: 200,
    description: 'Homologaciones recuperadas exitosamente',
  })
  async obtenerPorEstudianteId(@Param('estudianteId') estudianteId: string) {
    try {
      const homologaciones =
        await this.homologacionService.getHomologacionesByEstudianteId(
          estudianteId,
        );

      return {
        message: 'Homologaciones recuperadas exitosamente',
        data: homologaciones,
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

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Crear homologación',
    description: 'Crea una nueva homologación para un estudiante',
  })
  @ApiBody({ type: HomologacionDto })
  @ApiResponse({ status: 201, description: 'Homologación creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async crear(@Body() homologacionDto: HomologacionDto) {
    try {
      const homologacion = new Homologacion({
        estudianteId: homologacionDto.estudianteId,
        carreraCun: homologacionDto.carreraCun,
        estatus: homologacionDto.estatus,
        jornada: homologacionDto.jornada,
        modalidad: homologacionDto.modalidad,
        ciudad: homologacionDto.ciudad,
        institucion: homologacionDto.institucion,
        carreraHom: homologacionDto.carreraHom,
        fechaGrado: homologacionDto.fechaGrado,
        nivelEstudio: homologacionDto.nivelEstudio,
      });

      const nuevaHomologacion =
        await this.homologacionService.createHomologacion(homologacion);

      return {
        message: 'Homologación creada exitosamente',
        data: nuevaHomologacion,
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

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async actualizar(
    @Param('id') id: string,
    @Body() homologacionDto: HomologacionDto,
  ) {
    try {
      const homologacionActualizada =
        await this.homologacionService.updateHomologacion(id, homologacionDto);

      return {
        message: 'Homologación actualizada exitosamente',
        data: homologacionActualizada,
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

  @Put(':id/estatus')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async actualizarEstatus(
    @Param('id') id: string,
    @Body() { estatus }: ActualizarEstatusDto,
  ) {
    try {
      const homologacionActualizada =
        await this.homologacionService.updateEstatusHomologacion(id, estatus);

      return {
        message: 'Estatus de homologación actualizado exitosamente',
        data: homologacionActualizada,
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

  @Post(':id/documentos')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async agregarDocumentos(
    @Param('id') homologacionId: string,
    @Body() documentosDto: Omit<DocumentosDto, 'homologacionId'>,
  ) {
    try {
      const documentos = await this.validarDocumentosUseCase.execute({
        homologacionId,
        ...documentosDto,
      });

      return {
        message: 'Documentos agregados exitosamente',
        data: documentos,
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
