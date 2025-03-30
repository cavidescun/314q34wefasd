import { Injectable, Inject, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { Institucion } from 'src/domain/institucion/entity/institucion.entity';
import { InstitucionRepository } from 'src/domain/institucion/repository/institucion.repository';
import { InstitucionDto, InstitucionUpdateDto } from '../../../domain/institucion/dto/institucion.dto';

@Injectable()
export class InstitucionService {
  private readonly logger = new Logger(InstitucionService.name);

  constructor(
    @Inject('InstitucionRepository')
    private readonly institucionRepository: InstitucionRepository,
  ) {}

  async createInstitucion(institucionDto: InstitucionDto) {
    try {
      const institucion = new Institucion({
        nombreInst: institucionDto.nombreInst,
      });

      const nuevaInstitucion = await this.institucionRepository.create(institucion);

      return {
        message: 'Institución creada exitosamente',
        data: nuevaInstitucion,
      };
    } catch (error) {
      this.logger.error(`Error al crear institución: ${error.message}`, error.stack);
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async getInstitucionById(idInstitucion: number) {
    try {
      const institucion = await this.institucionRepository.findById(idInstitucion);

      if (!institucion) {
        throw new Error(`No existe una institución con el id ${idInstitucion}`);
      }

      return {
        message: 'Institución recuperada exitosamente',
        data: institucion,
      };
    } catch (error) {
      this.logger.error(`Error al buscar institución por ID: ${error.message}`, error.stack);
      
      if (error.message.includes('No existe una institución')) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: error.message,
        }, HttpStatus.NOT_FOUND);
      }

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllInstituciones() {
    try {
      const instituciones = await this.institucionRepository.findAll();
      
      return {
        message: 'Instituciones recuperadas exitosamente',
        data: instituciones,
      };
    } catch (error) {
      this.logger.error(`Error al obtener todas las instituciones: ${error.message}`, error.stack);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateInstitucion(
    idInstitucion: number,
    institucionDto: InstitucionUpdateDto,
  ) {
    try {
      const institucion = await this.institucionRepository.findById(idInstitucion);

      if (!institucion) {
        throw new Error(`No se encontró la institución con id ${idInstitucion}`);
      }

      const institucionActualizada = await this.institucionRepository.update(
        idInstitucion,
        { nombreInst: institucionDto.nombreInst }
      );

      return {
        message: 'Institución actualizada exitosamente',
        data: institucionActualizada,
      };
    } catch (error) {
      this.logger.error(`Error al actualizar institución: ${error.message}`, error.stack);
      
      if (error.message.includes('No se encontró')) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: error.message,
        }, HttpStatus.NOT_FOUND);
      }

      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteInstitucion(idInstitucion: number) {
    try {
      const resultado = await this.institucionRepository.delete(idInstitucion);

      if (!resultado) {
        throw new Error(`No existe una institución con el id ${idInstitucion}`);
      }

      return {
        message: 'Institución eliminada exitosamente',
      };
    } catch (error) {
      this.logger.error(`Error al eliminar institución: ${error.message}`, error.stack);
      
      if (error.message.includes('No existe una institución')) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: error.message,
        }, HttpStatus.NOT_FOUND);
      }

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}