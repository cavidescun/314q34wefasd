import { Injectable, Inject, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SenaTypeORM } from 'src/domain/sena/reconocimiento-titulos/persistence/typeorm/reconocimiento-titulo.entity';

@Injectable()
export class ProgramasUnicosService {
  private readonly logger = new Logger(ProgramasUnicosService.name);
  
  constructor(
    @InjectRepository(SenaTypeORM)
    private readonly senaTypeormRepository: Repository<SenaTypeORM>,
  ) {}

  async obtenerProgramasUnicos(nombreInstitucion: string) {
    try {
      const programas = await this.senaTypeormRepository
        .createQueryBuilder('sena')
        .select('DISTINCT sena.programa_ies', 'programa')
        .where('UPPER(sena.institucion_externa) = UPPER(:nombre)', { nombre: nombreInstitucion })
        .orderBy('sena.programa_ies')
        .getRawMany();

      const programasLista = programas.map(item => item.programa);
      return {
        message: 'Programas únicos recuperados exitosamente',
        data: programasLista,
        institucion: nombreInstitucion
      };
    } catch (error) {
      this.logger.error(`Error al obtener programas únicos: ${error.message}`, error.stack);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}