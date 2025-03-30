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

  @Get(':id')
  async obtenerPorId(@Param('id') id: number) {
    try {
      const contact = await this.collectDataContactRepository.findById(id);

      if (!contact) {
        throw new HttpException(`No existe un contacto con el id ${id}`, 404);
      }

      return {
        message: 'Contacto recuperado exitosamente',
        data: contact,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('celular/:celular')
  async obtenerPorCelular(@Param('celular') celular: string) {
    try {
      const contact = await this.collectDataContactRepository.findByCelular(celular);

      if (!contact) {
        throw new HttpException(`No existe un contacto con el celular ${celular}`, 404);
      }

      return {
        message: 'Contacto recuperado exitosamente',
        data: contact,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('email/:email')
  async obtenerPorEmail(@Param('email') email: string) {
    try {
      const contact = await this.collectDataContactRepository.findByEmail(email);

      if (!contact) {
        throw new HttpException(`No existe un contacto con el email ${email}`, 404);
      }

      return {
        message: 'Contacto recuperado exitosamente',
        data: contact,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async crear(@Body() contactDto: CollectDataContactDto) {
    try {
      const existingCelular = await this.collectDataContactRepository.findByCelular(contactDto.celular);
      const existingEmail = await this.collectDataContactRepository.findByEmail(contactDto.email);

      if (existingCelular) {
        throw new HttpException(`Ya existe un contacto con el celular ${contactDto.celular}`, 400);
      }

      if (existingEmail) {
        throw new HttpException(`Ya existe un contacto con el email ${contactDto.email}`, 400);
      }
      const contact = new CollectDataContact({
        celular: contactDto.celular,
        email: contactDto.email,
      });

      const nuevoContact = await this.collectDataContactRepository.create(contact);

      return {
        message: 'Contacto creado exitosamente',
        data: nuevoContact,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async actualizar(
    @Param('id') id: number,
    @Body() contact: CollectDataContactUpdateDto,
  ) {
    try {
      return {
        message: 'Contacto actualizado exitosamente',
        data: await this.collectDataContactRepository.update(id, contact),
      };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Delete(':id')
  async eliminar(@Param('id') id: number) {
    try {
      const resultado = await this.collectDataContactRepository.delete(id);

      if (!resultado) {
        throw new HttpException(`No existe un contacto con el id ${id}`, 404);
      }

      return {
        message: 'Contacto eliminado exitosamente',
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}