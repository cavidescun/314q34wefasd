import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InstitucionDto {
  @ApiPropertyOptional({ description: 'ID de la institución', example: 1 })
  @IsOptional()
  @IsNumber({}, { message: 'El ID debe ser un número' })
  idInstitucion?: number;

  @ApiProperty({ description: 'Nombre de la institución', example: 'Universidad Nacional' })
  @IsNotEmpty({ message: 'El nombre de la institución es requerido' })
  @IsString({ message: 'El nombre de la institución debe ser un texto' })
  nombreInst: string;
}

export class InstitucionUpdateDto {
  @ApiProperty({ description: 'Nombre de la institución', example: 'Universidad Nacional' })
  @IsNotEmpty({ message: 'El nombre de la institución es requerido' })
  @IsString({ message: 'El nombre de la institución debe ser un texto' })
  nombreInst: string;
}