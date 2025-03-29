import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProcesarRegistroUseCase } from '../../application/services/procesar-registro.service';
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
      const result = await this.procesarRegistroUseCase.execute(registroDto);
      return {
        message: 'Estudiante registrado exitosamente',
        data: result,
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
