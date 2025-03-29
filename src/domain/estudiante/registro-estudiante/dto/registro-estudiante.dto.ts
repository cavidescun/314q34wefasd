import { IsString, IsEmail, IsOptional, IsDate, IsNotEmpty, Length, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegistroEstudianteDto {
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

  @ApiProperty({ description: 'Número de celular del estudiante', example: '3001234567' })
  @IsNotEmpty({ message: 'El número de celular es requerido' })
  @IsString({ message: 'El número de celular debe ser un texto' })
  @Matches(/^[0-9]{10,15}$/, { message: 'El número de celular debe contener entre 10 y 15 dígitos' })
  celular: string;

  @ApiPropertyOptional({ description: 'Número de teléfono fijo (opcional)', example: '6011234567' })
  @IsOptional()
  @IsString({ message: 'El número fijo debe ser un texto' })
  numFijo?: string;

  @ApiProperty({ description: 'Correo electrónico del estudiante', example: 'estudiante@dominio.com' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  @IsEmail({}, { message: 'El correo electrónico debe tener un formato válido' })
  email: string;

  @ApiPropertyOptional({ description: 'Carrera en la CUN (opcional)', example: 'Ingeniería de Sistemas' })
  @IsOptional()
  @IsString({ message: 'La carrera CUN debe ser un texto' })
  carreraCun?: string;

  @ApiPropertyOptional({ description: 'Jornada académica (opcional)', example: 'Diurna' })
  @IsOptional()
  @IsString({ message: 'La jornada debe ser un texto' })
  jornada?: string;

  @ApiPropertyOptional({ description: 'Modalidad de estudio (opcional)', example: 'Presencial' })
  @IsOptional()
  @IsString({ message: 'La modalidad debe ser un texto' })
  modalidad?: string;

  @ApiPropertyOptional({ description: 'Ciudad de estudio (opcional)', example: 'Bogotá' })
  @IsOptional()
  @IsString({ message: 'La ciudad debe ser un texto' })
  ciudad?: string;

  @ApiPropertyOptional({ description: 'Institución de origen (opcional)', example: 'Universidad Nacional' })
  @IsOptional()
  @IsString({ message: 'La institución debe ser un texto' })
  institucion?: string;

  @ApiPropertyOptional({ description: 'Carrera a homologar (opcional)', example: 'Ingeniería Informática' })
  @IsOptional()
  @IsString({ message: 'La carrera a homologar debe ser un texto' })
  carreraHom?: string;

  @ApiPropertyOptional({ description: 'Fecha de grado (opcional)', example: '2023-06-30' })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La fecha de grado debe ser una fecha válida' })
  fechaGrado?: Date;

  @ApiPropertyOptional({ description: 'Nivel de estudio (opcional)', example: 'Pregrado' })
  @IsOptional()
  @IsString({ message: 'El nivel de estudio debe ser un texto' })
  nivelEstudio?: string;
}