import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  HttpException,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from '../../../application/services/documentos/documents.service';
import { DocumentUrlDto, DocumentTipoEnum } from 'src/domain/documents/document_url/dto/document_url.dto';
import { DocumentosDto } from '../../../domain/documents/dto/documentos.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { multerOptions } from '../../interface/common/multer/multer.config';

@ApiTags('documentos')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener documentos por ID',
    description: 'Retorna los documentos por su ID',
  })
  @ApiParam({ name: 'id', description: 'ID de los documentos', example: '1' })
  async obtenerPorId(@Param('id') id: number) {
    try {
      return await this.documentsService.obtenerDocumentosPorId(id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('homologacion/:homologacionId')
  @ApiOperation({
    summary: 'Obtener documentos por ID de homologación',
    description: 'Retorna los documentos asociados a una homologación específica',
  })
  @ApiParam({ name: 'homologacionId', description: 'ID de la homologación', example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6' })
  async obtenerPorHomologacionId(
    @Param('homologacionId') homologacionId: string,
  ) {
    try {
      return await this.documentsService.obtenerDocumentosPorHomologacionId(homologacionId);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Actualizar documentos',
    description: 'Actualiza la información de documentos existentes',
  })
  @ApiParam({ name: 'id', description: 'ID de los documentos', example: '1' })
  @ApiBody({ type: DocumentosDto })
  async actualizar(@Param('id') id: number, @Body() documents: DocumentosDto) {
    try {
      return await this.documentsService.actualizarDocumentos(id, documents);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post(':id/subir/:tipo')
  @UseInterceptors(FileInterceptor('archivo', multerOptions))
  @ApiOperation({
    summary: 'Subir un documento',
    description: 'Sube un archivo PDF como documento de un tipo específico',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID de los documentos', example: '1' })
  @ApiParam({ 
    name: 'tipo', 
    description: 'Tipo de documento', 
    enum: DocumentTipoEnum, 
    example: 'urlDocIdentificacion' 
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        archivo: {
          type: 'string',
          format: 'binary',
          description: 'Archivo PDF a subir',
        },
      },
      required: ['archivo'],
    },
  })
  async subirDocumento(
    @Param('id') id: number,
    @Param('tipo') tipo: DocumentTipoEnum,
    @UploadedFile() archivo: Express.Multer.File,
  ) {
    try {
      if (!archivo) {
        throw new HttpException('No se proporcionó ningún archivo', 400);
      }
      
      if (archivo.mimetype !== 'application/pdf') {
        throw new HttpException('El archivo debe ser un PDF', 400);
      }

      if (!Object.values(DocumentTipoEnum).includes(tipo as DocumentTipoEnum)) {
        throw new HttpException(`Tipo de documento '${tipo}' no válido`, 400);
      }

      return await this.documentsService.subirDocumento(id, tipo as DocumentTipoEnum, archivo.buffer);
    } catch (error) {
      throw new HttpException(error.message, error.status || 400);
    }
  }

  @Put(':id/documento')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Actualizar URL de documento',
    description: 'Actualiza la URL de un documento específico',
  })
  @ApiParam({ name: 'id', description: 'ID de los documentos', example: '1' })
  @ApiBody({ type: DocumentUrlDto })
  async actualizarDocumento(
    @Param('id') id: number,
    @Body() documentUrlDto: DocumentUrlDto,
  ) {
    try {
      return await this.documentsService.actualizarUrlDocumento(id, documentUrlDto);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}