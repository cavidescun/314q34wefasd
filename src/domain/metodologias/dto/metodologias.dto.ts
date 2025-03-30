import { ApiProperty } from '@nestjs/swagger';

export class MetodologiasCarreraResponseDto {
  @ApiProperty({ description: 'Indicador de éxito de la operación', example: true })
  success: boolean;

  @ApiProperty({ description: 'Mensaje descriptivo del resultado', example: 'Metodologías recuperadas exitosamente' })
  message: string;

  @ApiProperty({
    description: 'Datos de las metodologías',
    type: 'object',
    properties: {
      carrera: { type: 'string', example: 'INGENIERÍA DE SISTEMAS' },
      metodologias: { 
        type: 'array', 
        items: { type: 'string' },
        example: [
          'PRESENCIAL',
          'VIRTUAL',
        ]
      }
    }
  })
  data: {
    carrera: string;
    metodologias: string[];
  };
}