import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  HttpException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentsService } from '../../../application/services/documentos/documents.service';
import { DocumentUrlDto } from 'src/domain/documents/document_url/dto/document_url.dto';
import { DocumentosDto } from '../../../domain/documents/dto/documentos.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

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
  async actualizar(@Param('id') id: number, @Body() documents: DocumentosDto) {
    try {
      return await this.documentsService.actualizarDocumentos(id, documents);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put(':id/documento')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
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