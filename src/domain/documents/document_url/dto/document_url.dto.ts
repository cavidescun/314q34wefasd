import { IsString, IsNotEmpty, IsUrl, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum DocumentTipoEnum {
  URL_DOC_BACHILLER = 'urlDocBachiller',
  URL_DOC_IDENTIFICACION = 'urlDocIdentificacion',
  URL_DOC_TITULO_HOMOLOGAR = 'urlDocTituloHomologar',
  URL_SABANA_NOTAS = 'urlSabanaNotas',
  URL_CARTA_HOMOLOGACION = 'urlCartaHomologacion',
  URL_CONTENIDOS_PROGRAMATICOS = 'urlContenidosProgramaticos'
}

export class DocumentUrlDto {
  @ApiProperty({ 
    description: 'Tipo de documento a actualizar', 
    enum: DocumentTipoEnum,
    example: DocumentTipoEnum.URL_DOC_IDENTIFICACION 
  })
  @IsNotEmpty({ message: 'El tipo de documento es requerido' })
  @IsEnum(DocumentTipoEnum, { message: 'El tipo de documento no es válido' })
  tipo: DocumentTipoEnum;

  @ApiProperty({ 
    description: 'URL del documento', 
    example: 'https://storage.example.com/documents/cedula-12345.pdf' 
  })
  @IsNotEmpty({ message: 'La URL del documento es requerida' })
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true }, { message: 'La URL debe ser una URL válida' })
  url: string;
}