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
import { FinalizarHomologacionService } from '../../../application/services/homologacion/finalizar-homologacion/finalizar-homologacion.service';
import { FinalizarHomologacionDto } from '../../../domain/homologaciones/finalizar-homologacion/dto/finalizar-homologacion.dto';

@ApiTags('finalizar-homologacion')
@Controller('finalizar-homologacion')
export class FinalizarHomologacionController {
  private readonly logger = new Logger(FinalizarHomologacionController.name);

  constructor(
    private readonly finalizarHomologacionService: FinalizarHomologacionService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Finalizar proceso de homologación',
    description:
      'Completa el proceso de homologación, enviando un correo de confirmación al estudiante, creando un ticket en ZOHO y cambiando el estado a Pendiente',
  })
  @ApiBody({ type: FinalizarHomologacionDto })
  @ApiResponse({
    status: 200,
    description: 'Proceso de homologación finalizado exitosamente',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Proceso de homologación finalizado exitosamente' },
        data: {
          type: 'object',
          properties: {
            homologacion: { type: 'object' },
            email: {
              type: 'object',
              properties: {
                enviado: { type: 'boolean', example: true },
                destinatario: { type: 'string', example: 'estudiante@ejemplo.com' },
                mensaje: { type: 'string', example: 'Correo enviado exitosamente' }
              }
            },
            zoho: {
              type: 'object',
              properties: {
                enviado: { type: 'boolean', example: true },
                ticketNumber: { type: 'string', example: '2822211' },
                mensaje: { type: 'string', example: 'Ticket creado exitosamente en ZOHO' }
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Error en datos de solicitud o estado de homologación inválido',
  })
  @ApiResponse({
    status: 404,
    description: 'Estudiante o homologación no encontrada',
  })
  async finalizarHomologacion(
    @Body() finalizarHomologacionDto: FinalizarHomologacionDto,
  ) {
    try {
      return await this.finalizarHomologacionService.execute(
        finalizarHomologacionDto.numeroDocumento,
        finalizarHomologacionDto.observaciones,
      );
    } catch (error) {
      this.logger.error(`Error finalizando homologación: ${error.message}`, error.stack);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          success: false,
          message: 'Error al finalizar el proceso de homologación',
          error: error.message
        },
        error.status || 500
      );
    }
  }
}