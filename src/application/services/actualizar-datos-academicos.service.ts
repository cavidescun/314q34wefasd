import { Inject, Injectable, Logger } from '@nestjs/common';
import { Homologacion } from '../../domain/homologaciones/entity/homologacion.entity';
import { Estudiante } from '../../domain/estudiante/entity/estudiante.entity';
import { EstudianteRepository } from '../../domain/estudiante/repository/estudiante.repository';
import { HomologacionRepository } from '../../domain/homologaciones/repository/homologacion.repository';
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

  async execute(dto: ActualizarDatosAcademicosDto): Promise<{
    success: boolean;
    message: string;
    data?: {
      estudiante?: Estudiante;
      homologacion?: Homologacion;
    };
    error?: string;
  }> {
    try {
      const estudiante =
        await this.estudianteRepository.findByNumeroIdentificacion(
          dto.numeroIdentificacion,
        );

      if (!estudiante) {
        this.logger.error(
          `Estudiante no encontrado con identificación: ${dto.numeroIdentificacion}`,
        );
        return {
          success: false,
          message: `No se encontró un estudiante con número de identificación: ${dto.numeroIdentificacion}`,
          error: 'Estudiante no encontrado',
        };
      }

      const homologaciones =
        await this.homologacionRepository.findByEstudianteId(estudiante.id);

      if (!homologaciones || homologaciones.length === 0) {
        this.logger.error(
          `No se encontraron homologaciones para el estudiante: ${estudiante.id}`,
        );
        return {
          success: false,
          message: 'No se encontraron homologaciones para este estudiante',
          error: 'Homologaciones no encontradas',
        };
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

      return {
        success: false,
        message: 'Error al actualizar los datos académicos',
        error: error.message,
      };
    }
  }
}
