import {
  Controller,
  Post,
  Body,
  HttpException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProcesarRegistroUseCase } from '../../../application/services/estudiantes/registrar-estudiante/procesar-registro.service';
import { RegistroEstudianteDto } from 'src/domain/estudiante/registro-estudiante/dto/registro-estudiante.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('registro')
@Controller('registro')
export class RegistroController {
  constructor(
    private readonly procesarRegistroUseCase: ProcesarRegistroUseCase,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Registrar nuevo estudiante',
    description:
      'Registra un nuevo estudiante con información de contacto y homologación',
  })
  @ApiBody({ type: RegistroEstudianteDto })
  @ApiResponse({
    status: 201,
    description: 'Estudiante registrado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o estudiante ya existente',
  })
  async registrarEstudiante(@Body() registroDto: RegistroEstudianteDto) {
    try {
      return await this.procesarRegistroUseCase.procesarRegistro(registroDto);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}