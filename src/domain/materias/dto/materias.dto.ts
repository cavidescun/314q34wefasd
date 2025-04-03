import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConsultaMateriasDto {
  @ApiProperty({ description: 'Código de unidad', example: 'ADSI' })
  @IsNotEmpty({ message: 'El código de unidad es requerido' })
  @IsString({ message: 'El código de unidad debe ser un texto' })
  codUnidad: string;

  @ApiProperty({ description: 'Código de pensum', example: '123456D' })
  @IsNotEmpty({ message: 'El código de pensum es requerido' })
  @IsString({ message: 'El código de pensum debe ser un texto' })
  codPensum: string;

  @ApiProperty({ description: 'Semestre/nivel', example: '3' })
  @IsNotEmpty({ message: 'El semestre es requerido' })
  @IsString({ message: 'El semestre debe ser un texto' })
  semestre: string;
}