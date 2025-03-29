import { IsString, IsUUID, IsOptional, IsUrl, ValidateIf, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DocumentosDto {
  @ApiProperty({ description: 'ID de la homologación (UUID)', example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6' })
  @IsNotEmpty({ message: 'El ID de homologación es requerido' })
  @IsUUID(4, { message: 'El ID de homologación debe ser un UUID válido' })
  homologacionId: string;

  @ApiPropertyOptional({ 
    description: 'URL del documento de bachiller', 
    example: 'https://storage.example.com/documents/bachiller-12345.pdf'
  })
  @IsOptional()
  @ValidateIf(o => o.urlDocBachiller !== undefined)
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true }, { message: 'La URL del documento de bachiller debe ser una URL válida' })
  urlDocBachiller?: string;

  @ApiPropertyOptional({ 
    description: 'URL del documento de identificación', 
    example: 'https://storage.example.com/documents/cedula-12345.pdf'
  })
  @IsOptional()
  @ValidateIf(o => o.urlDocIdentificacion !== undefined)
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true }, { message: 'La URL del documento de identificación debe ser una URL válida' })
  urlDocIdentificacion?: string;

  @ApiPropertyOptional({ 
    description: 'URL del documento del título a homologar', 
    example: 'https://storage.example.com/documents/titulo-12345.pdf'
  })
  @IsOptional()
  @ValidateIf(o => o.urlDocTituloHomologar !== undefined)
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true }, { message: 'La URL del documento del título a homologar debe ser una URL válida' })
  urlDocTituloHomologar?: string;

  @ApiPropertyOptional({ 
    description: 'URL de la sabana de notas', 
    example: 'https://storage.example.com/documents/notas-12345.pdf'
  })
  @IsOptional()
  @ValidateIf(o => o.urlSabanaNotas !== undefined)
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true }, { message: 'La URL de la sabana de notas debe ser una URL válida' })
  urlSabanaNotas?: string;

  @ApiPropertyOptional({ 
    description: 'URL de la carta de homologación', 
    example: 'https://storage.example.com/documents/carta-12345.pdf'
  })
  @IsOptional()
  @ValidateIf(o => o.urlCartaHomologacion !== undefined)
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true }, { message: 'La URL de la carta de homologación debe ser una URL válida' })
  urlCartaHomologacion?: string;

  @ApiPropertyOptional({ 
    description: 'URL de los contenidos programáticos', 
    example: 'https://storage.example.com/documents/contenidos-12345.pdf'
  })
  @IsOptional()
  @ValidateIf(o => o.urlContenidosProgramaticos !== undefined)
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true }, { message: 'La URL de los contenidos programáticos debe ser una URL válida' })
  urlContenidosProgramaticos?: string;
}