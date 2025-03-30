import { ApiProperty } from '@nestjs/swagger';

export class CarrerasAfinesResponseDto {
  @ApiProperty({ description: 'Indicador de éxito de la operación', example: true })
  success: boolean;

  @ApiProperty({ description: 'Mensaje descriptivo del resultado', example: 'Carreras afines recuperadas exitosamente' })
  message: string;

  @ApiProperty({
    description: 'Datos de las carreras afines',
    type: 'object',
    properties: {
      estudianteId: { type: 'string', example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6' },
      nombreEstudiante: { type: 'string', example: 'Juan Pérez González' },
      institucion: { type: 'string', example: 'SERVICIO NACIONAL DE APRENDIZAJE - SENA' },
      carreraHomologacion: { type: 'string', example: 'TECNOLOGÍA EN ANÁLISIS Y DESARROLLO DE SISTEMAS DE INFORMACIÓN' },
      carrerasAfines: { 
        type: 'array', 
        items: { type: 'string' },
        example: [
          'TÉCNICO EN PROGRAMACIÓN DE SOFTWARE',
          'TECNOLOGÍA EN DESARROLLO DE SOFTWARE',
          'INGENIERÍA DE SISTEMAS'
        ]
      }
    }
  })
  data: {
    estudianteId: string;
    nombreEstudiante: string;
    institucion: string;
    carreraHomologacion: string;
    carrerasAfines: string[];
  };
}