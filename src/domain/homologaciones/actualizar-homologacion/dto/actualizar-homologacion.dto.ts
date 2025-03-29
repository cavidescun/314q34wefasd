import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ActualizarHomologacionDto {
  @ApiProperty({ description: 'Número de identificación del estudiante', example: '1023456789' })
  @IsString({ message: 'El número de identificación debe ser un texto' })
  numeroIdentificacion: string;

  @ApiProperty({ description: 'Institución de origen', example: 'Universidad Nacional' })
  @IsString({ message: 'La institución debe ser un texto' })
  institucion: string;

  @ApiProperty({ description: 'Carrera a homologar', example: 'Ingeniería Informática' })
  @IsString({ message: 'La carrera a homologar debe ser un texto' })
  carreraHom: string;

  @ApiProperty({ description: 'Fecha de grado (YYYY-MM-DD)', example: '2023-06-30' })
  @IsDateString({}, { message: 'La fecha de grado debe ser una fecha válida en formato YYYY-MM-DD' })
  fechaGrado: string;
}
