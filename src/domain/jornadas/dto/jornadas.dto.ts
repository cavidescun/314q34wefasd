import { ApiProperty } from '@nestjs/swagger';

export class JornadasPensumResponseDto {
  @ApiProperty({ description: 'Indicador de éxito de la operación', example: true })
  success: boolean;

  @ApiProperty({ description: 'Mensaje descriptivo del resultado', example: 'Jornadas de pensum recuperadas exitosamente' })
  message: string;

  @ApiProperty({
    description: 'Datos de las jornadas',
    type: 'object',
    properties: {
      carrera: { type: 'string', example: 'INGENIERÍA DE SISTEMAS' },
      modalidad: { type: 'string', example: 'PRESENCIAL' },
      jornadas: { 
        type: 'array', 
        items: { type: 'string' },
        example: [
          'DIURNA',
          'NOCTURNA'
        ]
      }
    }
  })
  data: {
    carrera: string;
    modalidad: string;
    jornadas: string[];
  };
}