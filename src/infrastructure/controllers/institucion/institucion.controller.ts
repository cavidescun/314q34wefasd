import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InstitucionService } from 'src/application/services/institucion/institucion.service';
import { InstitucionDto, InstitucionUpdateDto } from '../../../domain/institucion/dto/institucion.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('instituciones')
@Controller('instituciones')
export class InstitucionController {
  constructor(private readonly institucionService: InstitucionService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las instituciones',
    description: 'Retorna la lista completa de instituciones educativas',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de instituciones recuperada exitosamente',
  })
  async obtenerTodas() {
    try {
      return await this.institucionService.getAllInstituciones();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener institución por ID',
    description: 'Retorna los datos de una institución específica por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la institución',
    example: '1',
  })
  async obtenerPorId(@Param('id') id: number) {
    try {
      return await this.institucionService.getInstitucionById(id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Crear institución',
    description: 'Crea una nueva institución educativa',
  })
  @ApiBody({ type: InstitucionDto })
  async crear(@Body() institucionDto: InstitucionDto) {
    try {
      return await this.institucionService.createInstitucion(institucionDto);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Actualizar institución',
    description: 'Actualiza los datos de una institución existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la institución',
    example: '1',
  })
  @ApiBody({ type: InstitucionUpdateDto })
  async actualizar(
    @Param('id') id: number,
    @Body() institucionDto: InstitucionUpdateDto,
  ) {
    try {
      return await this.institucionService.updateInstitucion(id, institucionDto);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar institución',
    description: 'Elimina una institución existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la institución',
    example: '1',
  })
  async eliminar(@Param('id') id: number) {
    try {
      return await this.institucionService.deleteInstitucion(id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}