
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FinalizarHomologacionDto {
  @ApiProperty({ 
    description: 'Número de documento del estudiante', 
    example: '1023456789' 
  })
  @IsNotEmpty({ message: 'El número de documento es requerido' })
  @IsString({ message: 'El número de documento debe ser un texto' })
  numeroDocumento: string;

  @ApiProperty({ 
    description: 'Observaciones adicionales (opcional)', 
    example: 'El estudiante ha completado todos los documentos necesarios',
    required: false
  })
  @IsString({ message: 'Las observaciones deben ser un texto' })
  observaciones?: string;
}