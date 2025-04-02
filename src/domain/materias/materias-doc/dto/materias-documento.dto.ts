import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConsultaMateriasDocumentoDto {
  @ApiProperty({ description: 'Número de identificación del estudiante', example: '1023456789' })
  @IsNotEmpty({ message: 'El número de identificación es requerido' })
  @IsString({ message: 'El número de identificación debe ser un texto' })
  numeroIdentificacion: string;
}