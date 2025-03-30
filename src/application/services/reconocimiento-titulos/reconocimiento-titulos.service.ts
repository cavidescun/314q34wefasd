import { Injectable, Inject, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { Sena } from 'src/domain/sena/reconocimiento-titulos/entity/reconocimiento-titulo.entity';
import { SenaRepository } from 'src/domain/sena/reconocimiento-titulos/repository/reconocimiento-titulo.repository';

@Injectable()
export class SenaService {
  private readonly logger = new Logger(SenaService.name);
  
  constructor(
    @Inject('SenaRepository')
    private readonly senaRepository: SenaRepository,
  ) {}

  async findAll() {
    try {
      const senaData = await this.senaRepository.findAll();
      
      return {
        message: 'Datos SENA recuperados exitosamente',
        data: senaData,
      };
    } catch (error) {
      this.logger.error(`Error al obtener datos SENA: ${error.message}`, error.stack);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(id: number) {
    try {
      const sena = await this.senaRepository.findById(id);

      if (!sena) {
        throw new Error(`No existe un registro SENA con id ${id}`);
      }

      return {
        message: 'Registro SENA recuperado exitosamente',
        data: sena,
      };
    } catch (error) {
      this.logger.error(`Error al obtener registro SENA por ID: ${error.message}`, error.stack);
      
      if (error.message.includes('No existe un registro')) {
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

  async findByInstitucionExterna(institucionExterna: string) {
    try {
      const senaData = await this.senaRepository.findByInstitucionExterna(institucionExterna);
      
      return {
        message: 'Datos SENA recuperados exitosamente',
        data: senaData,
      };
    } catch (error) {
      this.logger.error(`Error al buscar por institución externa: ${error.message}`, error.stack);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findBySNIES(snies: string) {
    try {
      const senaData = await this.senaRepository.findBySNIES(snies);
      
      return {
        message: 'Datos SENA recuperados exitosamente',
        data: senaData,
      };
    } catch (error) {
      this.logger.error(`Error al buscar por SNIES: ${error.message}`, error.stack);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByNivelIES(nivelIES: string) {
    try {
      const senaData = await this.senaRepository.findByNivelIES(nivelIES);
      
      return {
        message: 'Datos SENA recuperados exitosamente',
        data: senaData,
      };
    } catch (error) {
      this.logger.error(`Error al buscar por nivel IES: ${error.message}`, error.stack);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByPrograma(programaIES: string) {
    try {
      const senaData = await this.senaRepository.findByPrograma(programaIES);
      
      return {
        message: 'Datos SENA recuperados exitosamente',
        data: senaData,
      };
    } catch (error) {
      this.logger.error(`Error al buscar por programa: ${error.message}`, error.stack);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByEstado(estado: string) {
    try {
      const senaData = await this.senaRepository.findByEstado(estado);
      
      return {
        message: 'Datos SENA recuperados exitosamente',
        data: senaData,
      };
    } catch (error) {
      this.logger.error(`Error al buscar por estado: ${error.message}`, error.stack);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(sena: Sena) {
    try {
      const newSena = await this.senaRepository.create(sena);
      
      return {
        message: 'Registro SENA creado exitosamente',
        data: newSena,
      };
    } catch (error) {
      this.logger.error(`Error al crear registro SENA: ${error.message}`, error.stack);
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, data: Partial<Sena>) {
    try {
      const sena = await this.senaRepository.findById(id);

      if (!sena) {
        throw new Error(`No existe un registro SENA con id ${id}`);
      }

      const updatedSena = await this.senaRepository.update(id, data);
      
      return {
        message: 'Registro SENA actualizado exitosamente',
        data: updatedSena,
      };
    } catch (error) {
      this.logger.error(`Error al actualizar registro SENA: ${error.message}`, error.stack);
      
      if (error.message.includes('No existe un registro')) {
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

  async delete(id: number) {
    try {
      const success = await this.senaRepository.delete(id);

      if (!success) {
        throw new Error(`No existe un registro SENA con id ${id}`);
      }
      
      return {
        message: 'Registro SENA eliminado exitosamente',
      };
    } catch (error) {
      this.logger.error(`Error al eliminar registro SENA: ${error.message}`, error.stack);
      
      if (error.message.includes('No existe un registro')) {
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