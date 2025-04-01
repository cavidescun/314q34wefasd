import { ApiProperty } from '@nestjs/swagger';
import { EstatusHomologacion } from '../../entity/homologacion.entity';

export class HomologacionDetalleDto {
  @ApiProperty({ description: 'Fecha de creación de la homologación', example: '2023-06-30T15:30:45.123Z' })
  fecha: Date;

  @ApiProperty({ description: 'Número de documento del estudiante', example: '1023456789' })
  numeroDocumento: string;

  @ApiProperty({ description: 'Nombre completo del estudiante', example: 'Juan Pérez González' })
  nombreCompleto: string;

  @ApiProperty({ description: 'Nivel de estudio', example: 'Pregrado' })
  nivelEstudio: string;

  @ApiProperty({ description: 'Carrera a homologar', example: 'Ingeniería Informática' })
  carreraHom: string;

  @ApiProperty({ description: 'Carrera en la CUN', example: 'Ingeniería de Sistemas' })
  carreraCun: string;

  @ApiProperty({ 
    description: 'Estatus de la homologación', 
    enum: EstatusHomologacion,
    example: EstatusHomologacion.PENDIENTE 
  })
  estado: EstatusHomologacion;

  @ApiProperty({ 
    description: 'URLs de los documentos ingresados',
    type: 'array',
    items: { type: 'string' },
    example: [
      'https://bucket.s3.amazonaws.com/documentos/1023456789/documento_identificacion.pdf',
      'https://bucket.s3.amazonaws.com/documentos/1023456789/titulo_bachiller.pdf'
    ]
  })
  documentos: string[];
  
  @ApiProperty({ 
    description: 'Observaciones sobre la homologación', 
    example: 'Se aprueba la homologación después de verificar los documentos' 
  })
  observaciones: string;
}