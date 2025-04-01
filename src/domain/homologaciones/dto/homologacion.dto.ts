import { IsString, IsNotEmpty, IsOptional, IsUUID, IsEnum, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { EstatusHomologacion } from '../entity/homologacion.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HomologacionDto {
  @ApiPropertyOptional({ description: 'ID de la homologación (UUID)', example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6' })
  @IsOptional()
  @IsUUID(4, { message: 'El ID debe ser un UUID válido' })
  id?: string;

  @ApiProperty({ description: 'ID del estudiante (UUID)', example: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7' })
  @IsNotEmpty({ message: 'El ID del estudiante es requerido' })
  @IsUUID(4, { message: 'El ID del estudiante debe ser un UUID válido' })
  estudianteId: string;

  @ApiPropertyOptional({ description: 'Carrera en la CUN', example: 'Ingeniería de Sistemas' })
  @IsOptional()
  @IsString({ message: 'La carrera CUN debe ser un texto' })
  carreraCun?: string;

  @ApiPropertyOptional({ 
    description: 'Estatus de la homologación', 
    enum: EstatusHomologacion,
    example: EstatusHomologacion.PENDIENTE
  })
  @IsOptional()
  @IsEnum(EstatusHomologacion, { message: 'El estatus debe ser: Pendiente, Aprobado, Rechazado o Sin Documentos' })
  estatus?: EstatusHomologacion;

  @ApiPropertyOptional({ description: 'Jornada académica', example: 'Diurna' })
  @IsOptional()
  @IsString({ message: 'La jornada debe ser un texto' })
  jornada?: string;

  @ApiPropertyOptional({ description: 'Modalidad de estudio', example: 'Presencial' })
  @IsOptional()
  @IsString({ message: 'La modalidad debe ser un texto' })
  modalidad?: string;

  @ApiPropertyOptional({ description: 'Ciudad de estudio', example: 'Bogotá' })
  @IsOptional()
  @IsString({ message: 'La ciudad debe ser un texto' })
  ciudad?: string;

  @ApiPropertyOptional({ description: 'Institución de origen', example: 'Universidad Nacional' })
  @IsOptional()
  @IsString({ message: 'La institución debe ser un texto' })
  institucion?: string;

  @ApiPropertyOptional({ description: 'Carrera a homologar', example: 'Ingeniería Informática' })
  @IsOptional()
  @IsString({ message: 'La carrera a homologar debe ser un texto' })
  carreraHom?: string;

  @ApiPropertyOptional({ description: 'Fecha de grado', example: '2023-06-30' })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La fecha de grado debe ser una fecha válida' })
  fechaGrado?: Date;

  @ApiPropertyOptional({ description: 'Nivel de estudio', example: 'Pregrado' })
  @IsOptional()
  @IsString({ message: 'El nivel de estudio debe ser un texto' })
  nivelEstudio?: string;
}

export class ActualizarEstatusDto {
  @ApiProperty({ 
    description: 'Nuevo estatus de la homologación', 
    enum: EstatusHomologacion,
    example: EstatusHomologacion.APROBADO
  })
  @IsNotEmpty({ message: 'El estatus es requerido' })
  @IsEnum(EstatusHomologacion, { message: 'El estatus debe ser: Pendiente, Aprobado, Rechazado o Sin Documentos' })
  estatus: EstatusHomologacion;
  
  @ApiProperty({ 
    description: 'Observaciones o comentarios sobre el cambio de estatus (opcional)', 
    example: 'Se aprueba la homologación después de revisar todos los documentos',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser un texto' })
  observaciones?: string;
}