import { IsString, IsNotEmpty, Length, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EstudianteDto {
  @ApiPropertyOptional({ description: 'ID del estudiante (UUID)', example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6' })
  @IsOptional()
  @IsUUID(4, { message: 'El ID debe ser un UUID válido' })
  id?: string;

  @ApiProperty({ description: 'Nombre completo del estudiante', example: 'Juan Pérez González' })
  @IsNotEmpty({ message: 'El nombre completo es requerido' })
  @IsString({ message: 'El nombre completo debe ser un texto' })
  @Length(3, 150, { message: 'El nombre completo debe tener entre 3 y 150 caracteres' })
  nombreCompleto: string;

  @ApiProperty({ description: 'Número de identificación del estudiante', example: '1023456789' })
  @IsNotEmpty({ message: 'El número de identificación es requerido' })
  @IsString({ message: 'El número de identificación debe ser un texto' })
  @Length(5, 20, { message: 'El número de identificación debe tener entre 5 y 20 caracteres' })
  numeroIdentificacion: string;
}

export class EstudianteUpdateDto {
  @ApiPropertyOptional({ description: 'Nombre completo del estudiante', example: 'Juan Pérez González' })
  @IsOptional()
  @IsString({ message: 'El nombre completo debe ser un texto' })
  @Length(3, 150, { message: 'El nombre completo debe tener entre 3 y 150 caracteres' })
  nombreCompleto?: string;

  @ApiPropertyOptional({ description: 'Número de identificación del estudiante', example: '1023456789' })
  @IsOptional()
  @IsString({ message: 'El número de identificación debe ser un texto' })
  @Length(5, 20, { message: 'El número de identificación debe tener entre 5 y 20 caracteres' })
  numeroIdentificacion?: string;
}