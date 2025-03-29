import { IsString, IsEmail, IsOptional, IsNotEmpty, Matches, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ContactDto {
  @ApiPropertyOptional({ description: 'ID del contacto', example: 1 })
  @IsOptional()
  id?: number;

  @ApiProperty({ description: 'Número de celular del contacto', example: '3001234567' })
  @IsNotEmpty({ message: 'El número de celular es requerido' })
  @IsString({ message: 'El número de celular debe ser un texto' })
  @Matches(/^[0-9]{10,15}$/, { message: 'El número de celular debe contener entre 10 y 15 dígitos' })
  celular: string;

  @ApiPropertyOptional({ description: 'Número de teléfono fijo (opcional)', example: '6011234567' })
  @IsOptional()
  @IsString({ message: 'El número fijo debe ser un texto' })
  numFijo?: string;

  @ApiProperty({ description: 'Correo electrónico del contacto', example: 'contacto@ejemplo.com' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  @IsEmail({}, { message: 'El correo electrónico debe tener un formato válido' })
  email: string;

  @ApiProperty({ description: 'ID del estudiante asociado al contacto', example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6' })
  @IsNotEmpty({ message: 'El ID del estudiante es requerido' })
  @IsUUID(4, { message: 'El ID del estudiante debe ser un UUID válido' })
  estudianteId: string;
}

export class ContactUpdateDto {
  @ApiPropertyOptional({ description: 'Número de celular del contacto', example: '3001234567' })
  @IsOptional()
  @IsString({ message: 'El número de celular debe ser un texto' })
  @Matches(/^[0-9]{10,15}$/, { message: 'El número de celular debe contener entre 10 y 15 dígitos' })
  celular?: string;

  @ApiPropertyOptional({ description: 'Número de teléfono fijo', example: '6011234567' })
  @IsOptional()
  @IsString({ message: 'El número fijo debe ser un texto' })
  numFijo?: string;

  @ApiPropertyOptional({ description: 'Correo electrónico del contacto', example: 'contacto@ejemplo.com' })
  @IsOptional()
  @IsEmail({}, { message: 'El correo electrónico debe tener un formato válido' })
  email?: string;
}