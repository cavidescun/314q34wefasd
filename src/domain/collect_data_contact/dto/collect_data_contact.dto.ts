import { IsString, IsEmail, IsNotEmpty, Matches, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CollectDataContactDto {
  @ApiPropertyOptional({ description: 'ID del contacto', example: 1 })
  @IsOptional()
  id?: number;

  @ApiProperty({ description: 'Número de celular', example: '3001234567' })
  @IsNotEmpty({ message: 'El número de celular es requerido' })
  @IsString({ message: 'El número de celular debe ser un texto' })
  @Matches(/^[0-9]{10,15}$/, { message: 'El número de celular debe contener entre 10 y 15 dígitos' })
  celular: string;

  @ApiProperty({ description: 'Correo electrónico', example: 'contacto@ejemplo.com' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  @IsEmail({}, { message: 'El correo electrónico debe tener un formato válido' })
  email: string;
}

export class CollectDataContactUpdateDto {
  @ApiPropertyOptional({ description: 'Número de celular', example: '3001234567' })
  @IsOptional()
  @IsString({ message: 'El número de celular debe ser un texto' })
  @Matches(/^[0-9]{10,15}$/, { message: 'El número de celular debe contener entre 10 y 15 dígitos' })
  celular?: string;

  @ApiPropertyOptional({ description: 'Correo electrónico', example: 'contacto@ejemplo.com' })
  @IsOptional()
  @IsEmail({}, { message: 'El correo electrónico debe tener un formato válido' })
  email?: string;
}