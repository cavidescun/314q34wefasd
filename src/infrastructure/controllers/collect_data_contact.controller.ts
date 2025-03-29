import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Inject,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CollectDataContactRepository } from '../../domain/collect_data_contact/repository/collect_data_contact.repository';
import { CollectDataContactUpdateDto } from 'src/domain/collect_data_contact/dto/collect_data_contact.dto';
import { CollectDataContactDto } from 'src/domain/collect_data_contact/dto/collect_data_contact.dto';
import { CollectDataContact } from '../../domain/collect_data_contact/entity/collect_data_contact.entity';
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
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: number) {
    try {
      const contact = await this.collectDataContactRepository.findById(id);

      if (!contact) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `No existe un contacto con el id ${id}`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Contacto recuperado exitosamente',
        data: contact,
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

  @Get('celular/:celular')
  async obtenerPorCelular(@Param('celular') celular: string) {
    try {
      const contact =
        await this.collectDataContactRepository.findByCelular(celular);

      if (!contact) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `No existe un contacto con el celular ${celular}`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Contacto recuperado exitosamente',
        data: contact,
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

  @Get('email/:email')
  async obtenerPorEmail(@Param('email') email: string) {
    try {
      const contact =
        await this.collectDataContactRepository.findByEmail(email);

      if (!contact) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `No existe un contacto con el email ${email}`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Contacto recuperado exitosamente',
        data: contact,
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

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async crear(@Body() contactDto: CollectDataContactDto) {
    try {
      const existingCelular =
        await this.collectDataContactRepository.findByCelular(
          contactDto.celular,
        );
      const existingEmail = await this.collectDataContactRepository.findByEmail(
        contactDto.email,
      );

      if (existingCelular) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: `Ya existe un contacto con el celular ${contactDto.celular}`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (existingEmail) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: `Ya existe un contacto con el email ${contactDto.email}`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const contact = new CollectDataContact({
        celular: contactDto.celular,
        email: contactDto.email,
      });

      const nuevoContact =
        await this.collectDataContactRepository.create(contact);

      return {
        message: 'Contacto creado exitosamente',
        data: nuevoContact,
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

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async actualizar(
    @Param('id') id: number,
    @Body() contact: CollectDataContactUpdateDto,
  ) {
    try {
      const contactActualizado = await this.collectDataContactRepository.update(
        id,
        contact,
      );

      return {
        message: 'Contacto actualizado exitosamente',
        data: contactActualizado,
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

  @Delete(':id')
  async eliminar(@Param('id') id: number) {
    try {
      const resultado = await this.collectDataContactRepository.delete(id);

      if (!resultado) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `No existe un contacto con el id ${id}`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Contacto eliminado exitosamente',
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
}
