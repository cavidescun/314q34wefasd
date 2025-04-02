import { ApiProperty } from '@nestjs/swagger';
import { MateriaPensum } from '../../entity/materias.entity';

export class MateriasResponseDto {
  @ApiProperty({ description: 'Indicador de éxito de la operación', example: true })
  success: boolean;

  @ApiProperty({ description: 'Mensaje descriptivo del resultado', example: 'Materias recuperadas exitosamente' })
  message: string;

  @ApiProperty({
    description: 'Parámetros de la consulta',
    type: 'object',
    properties: {
      codUnidad: { type: 'string', example: 'ADSI' },
      codPensum: { type: 'string', example: '123456D' },
      semestre: { type: 'string', example: '3' },
      estudiante: { 
        type: 'object', 
        required: [],
        properties: {
          id: { type: 'string' },
          nombreCompleto: { type: 'string' },
          numeroIdentificacion: { type: 'string' }
        }
      }
    }
  })
  parametros: {
    codUnidad: string;
    codPensum: string;
    semestre: string;
    estudiante?: {
      id: string;
      nombreCompleto: string;
      numeroIdentificacion: string;
    };
  };

  @ApiProperty({
    description: 'Datos de las materias',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        codUnidad: { type: 'string', example: 'ADSI' },
        codPensum: { type: 'string', example: '123456D' },
        codMateria: { type: 'string', example: 'MAT001' },
        numNivel: { type: 'string', example: '1' },
        nomMateria: { type: 'string', example: 'Programación I' },
        uniTeorica: { type: 'string', example: '4' }
      }
    }
  })
  data: MateriaPensum[];
}