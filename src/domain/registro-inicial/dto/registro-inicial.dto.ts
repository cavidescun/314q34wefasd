import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegistroInicialDto {
  @ApiProperty({ description: 'Número de celular del estudiante', example: '3001234567' })
  @IsNotEmpty({ message: 'El número de celular es requerido' })
  @IsString({ message: 'El número de celular debe ser un texto' })
  @Matches(/^[0-9]{10,15}$/, { message: 'El número de celular debe contener entre 10 y 15 dígitos' })
  celular: string;

  @ApiPropertyOptional({ description: 'Número de teléfono fijo (opcional)', example: '6011234567' })
  @IsOptional()
  @IsString({ message: 'El número fijo debe ser un texto' })
  numFijo?: string;

  @ApiProperty({ description: 'Correo electrónico del estudiante', example: 'estudiante@ejemplo.com' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  @IsEmail({}, { message: 'El correo electrónico debe tener un formato válido' })
  email: string;

}
