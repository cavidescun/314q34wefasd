import { ApiProperty } from '@nestjs/swagger';

export class SedesCarrerasResponseDto {
  @ApiProperty({ description: 'Indicador de éxito de la operación', example: true })
  success: boolean;

  @ApiProperty({ description: 'Mensaje descriptivo del resultado', example: 'Sedes recuperadas exitosamente' })
  message: string;

  @ApiProperty({
    description: 'Datos de las sedes',
    type: 'object',
    properties: {
      carrera: { type: 'string', example: 'INGENIERIA DE SISTEMAS' },
      modalidad: { type: 'string', example: 'PRESENCIAL' },
      jornada: { type: 'string', example: 'DIURNA', enum: ['DIURNA', 'NOCTURNA'] },
      ciudades: { 
        type: 'array', 
        items: { type: 'string' },
        example: [
          'BOGOTÁ',
          'MEDELLÍN',
          'CALI'
        ]
      }
    }
  })
  data: {
    carrera: string;
    modalidad: string;
    jornada: string;
    ciudades: string[];
  };
}