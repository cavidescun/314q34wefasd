
import {
  Controller,
  Get,
  Param,
  Res,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { SenaHomologacionService } from 'src/application/services/generar-excel/sena-homologacion/sena-homologacion.service';

@ApiTags('sena-homologacion')
@Controller('sena-homologacion')
export class SenaHomologacionController {
  private readonly logger = new Logger(SenaHomologacionController.name);

  constructor(
    private readonly senaHomologacionService: SenaHomologacionService
  ) {}

  @Get(':numeroIdentificacion')
  @ApiOperation({
    summary: 'Generar excel de homologación SENA para un estudiante',
    description: 'Genera un archivo excel con la estructura requerida para homologación SENA'
  })
  @ApiParam({
    name: 'numeroIdentificacion',
    required: true,
    description: 'Número de identificación del estudiante',
    example: '1022350564'
  })
  @ApiResponse({
    status: 200,
    description: 'Excel generado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Estudiante o homologación no encontrada',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos académicos incompletos',
  })
  async generarHomologacionExcel(
    @Param('numeroIdentificacion') numeroIdentificacion: string,
    @Res() res: Response
  ) {
    try {
      const buffer = await this.senaHomologacionService.generarHomologacionExcel(numeroIdentificacion);
      
      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=homologacion-${numeroIdentificacion}.xlsx`,
        'Content-Length': buffer.length,
      });
      
      res.end(buffer);
    } catch (error) {
      this.logger.error(`Error en endpoint: ${error.message}`);
      throw error instanceof HttpException 
        ? error 
        : new HttpException(error.message, error.status || 500);
    }
  }
}