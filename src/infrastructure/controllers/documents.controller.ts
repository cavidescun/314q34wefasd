import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentsService } from '../../application/services/documents.service';
import { DocumentUrlDto } from 'src/domain/documents/document_url/dto/document_url.dto';
import { DocumentosDto } from '../../domain/documents/dto/documentos.dto';
import { DocumentTipoEnum } from 'src/domain/documents/document_url/dto/document_url.dto';
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
  @ApiResponse({
    status: 200,
    description: 'Documentos recuperados exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Documentos no encontrados' })
  async obtenerPorId(@Param('id') id: number) {
    try {
      const documents = await this.documentsService.getDocumentsById(id);

      if (!documents) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `No existen documentos con el id ${id}`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Documentos recuperados exitosamente',
        data: documents,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('homologacion/:homologacionId')
  async obtenerPorHomologacionId(
    @Param('homologacionId') homologacionId: string,
  ) {
    try {
      const documents =
        await this.documentsService.getDocumentsByHomologacionId(
          homologacionId,
        );

      if (!documents) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `No existen documentos para la homologación con id ${homologacionId}`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Documentos recuperados exitosamente',
        data: documents,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async actualizar(@Param('id') id: number, @Body() documents: DocumentosDto) {
    try {
      const documentsActualizados = await this.documentsService.updateDocuments(
        id,
        documents,
      );

      return {
        message: 'Documentos actualizados exitosamente',
        data: documentsActualizados,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id/documento')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async actualizarDocumento(
    @Param('id') id: number,
    @Body() documentUrlDto: DocumentUrlDto,
  ) {
    try {
      if (!Object.values(DocumentTipoEnum).includes(documentUrlDto.tipo)) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: `El tipo de documento '${documentUrlDto.tipo}' no es válido`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const documentsActualizados =
        await this.documentsService.updateDocumentUrl(
          id,
          documentUrlDto.tipo,
          documentUrlDto.url,
        );

      return {
        message: 'Documento actualizado exitosamente',
        data: documentsActualizados,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
