import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  Inject,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CollectDataContactRepository } from '../../../domain/collect_data_contact/repository/collect_data_contact.repository';
import { CollectDataContactUpdateDto } from 'src/domain/collect_data_contact/dto/collect_data_contact.dto';
import { CollectDataContactDto } from 'src/domain/collect_data_contact/dto/collect_data_contact.dto';
import { CollectDataContact } from '../../../domain/collect_data_contact/entity/collect_data_contact.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('collect-data-contact')
@Controller('collect-data-contact')
export class CollectDataContactController {
  constructor(
    @Inject('CollectDataContactRepository')
    private readonly collectDataContactRepository: CollectDataContactRepository,
  ) {}

  @Get()
  async obtenerTodos() {
    try {
      const contacts = await this.collectDataContactRepository.findAll();

      return {
        message: 'Contactos recuperados exitosamente',
        data: contacts,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

}