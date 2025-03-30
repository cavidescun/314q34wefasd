import { Inject, Injectable, Logger, HttpStatus, HttpException } from '@nestjs/common';
import { EstudianteRepository } from '../../../domain/estudiante/repository/estudiante.repository';
import { HomologacionRepository } from '../../../domain/homologaciones/repository/homologacion.repository';
import { ActualizarDatosAcademicosDto } from 'src/domain/datos-academicos/dto/actualizar-datos-academicos.dto';

@Injectable()
export class ActualizarDatosAcademicosUseCase {
  private readonly logger = new Logger(ActualizarDatosAcademicosUseCase.name);

  constructor(
    @Inject('EstudianteRepository')
    private readonly estudianteRepository: EstudianteRepository,
    @Inject('HomologacionRepository')
    private readonly homologacionRepository: HomologacionRepository,
  ) {}

  async execute(dto: ActualizarDatosAcademicosDto) {
    try {
      const estudiante = await this.estudianteRepository.findByNumeroIdentificacion(
        dto.numeroIdentificacion,
      );

      if (!estudiante) {
        this.logger.error(
          `Estudiante no encontrado con identificación: ${dto.numeroIdentificacion}`,
        );
        throw new Error(`No se encontró un estudiante con número de identificación: ${dto.numeroIdentificacion}`);
      }

      const homologaciones = await this.homologacionRepository.findByEstudianteId(estudiante.id);

      if (!homologaciones || homologaciones.length === 0) {
        this.logger.error(
          `No se encontraron homologaciones para el estudiante: ${estudiante.id}`,
        );
        throw new Error('No se encontraron homologaciones para este estudiante');
      }

      const homologacion = homologaciones[0];

      const homologacionActualizada = await this.homologacionRepository.update(
        homologacion.id,
        {
          carreraCun: dto.carreraCun,
          jornada: dto.jornada,
          modalidad: dto.modalidad,
          ciudad: dto.ciudad,
          updatedAt: new Date(),
        },
      );

      return {
        success: true,
        message: 'Datos académicos actualizados correctamente',
        data: {
          estudiante,
          homologacion: homologacionActualizada,
        },
      };
    } catch (error) {
      this.logger.error(`Mensaje de error: ${error.message}`);
      this.logger.error(`Stack trace: ${error.stack}`);

      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      
      if (error.message.includes('No se encontró un estudiante') || 
          error.message.includes('No se encontraron homologaciones')) {
        status = HttpStatus.NOT_FOUND;
      } else {
        status = HttpStatus.BAD_REQUEST;
      }

      throw new HttpException({
        success: false,
        message: error.message || 'Error al actualizar los datos académicos',
        error: error.message,
      }, status);
    }
  }
}