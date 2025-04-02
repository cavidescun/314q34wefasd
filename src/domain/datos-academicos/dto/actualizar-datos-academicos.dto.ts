// src/domain/datos-academicos/dto/actualizar-datos-academicos.dto.ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ActualizarDatosAcademicosDto {
  @ApiProperty({ description: 'Número de identificación del estudiante', example: '1023456789' })
  @IsNotEmpty({ message: 'El número de identificación es requerido' })
  @IsString({ message: 'El número de identificación debe ser un texto' })
  numeroIdentificacion: string;

  @ApiProperty({ description: 'Carrera en la CUN', example: 'Ingeniería de Sistemas' })
  @IsNotEmpty({ message: 'La carrera CUN es requerida' })
  @IsString({ message: 'La carrera CUN debe ser un texto' })
  carreraCun: string;

  @ApiProperty({ description: 'Jornada académica', example: 'Diurna' })
  @IsNotEmpty({ message: 'La jornada es requerida' })
  @IsString({ message: 'La jornada debe ser un texto' })
  jornada: string;

  @ApiProperty({ description: 'Modalidad de estudio', example: 'Presencial' })
  @IsNotEmpty({ message: 'La modalidad es requerida' })
  @IsString({ message: 'La modalidad debe ser un texto' })
  modalidad: string;

  @ApiProperty({ description: 'Ciudad de estudio', example: 'Bogotá' })
  @IsNotEmpty({ message: 'La ciudad es requerida' })
  @IsString({ message: 'La ciudad debe ser un texto' })
  ciudad: string;
  
}