import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SenaService } from 'src/application/services/reconocimiento-titulos/reconocimiento-titulos.service';
import { Sena } from 'src/domain/sena/reconocimiento-titulos/entity/reconocimiento-titulo.entity';

@Controller('sena')
export class SenaController {
  constructor(private readonly senaService: SenaService) {}

  @Get()
  async findAll() {
    try {
      return await this.senaService.findAll();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('id/:id')
  async findById(@Param('id') id: number) {
    try {
      return await this.senaService.findById(id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('institucion')
  async findByInstitucion(@Query('nombre') institucionExterna: string) {
    try {
      return await this.senaService.findByInstitucionExterna(institucionExterna);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('snies')
  async findBySNIES(@Query('codigo') snies: string) {
    try {
      return await this.senaService.findBySNIES(snies);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('nivel')
  async findByNivel(@Query('nivel') nivelIES: string) {
    try {
      return await this.senaService.findByNivelIES(nivelIES);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('programa')
  async findByPrograma(@Query('nombre') programaIES: string) {
    try {
      return await this.senaService.findByPrograma(programaIES);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('estado')
  async findByEstado(@Query('estado') estado: string) {
    try {
      return await this.senaService.findByEstado(estado);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() sena: Sena) {
    try {
      return await this.senaService.create(sena);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async update(@Param('id') id: number, @Body() sena: Partial<Sena>) {
    try {
      return await this.senaService.update(id, sena);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    try {
      return await this.senaService.delete(id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}