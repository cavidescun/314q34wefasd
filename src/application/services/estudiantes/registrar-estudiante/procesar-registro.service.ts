import { Injectable, Inject, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { Estudiante } from '../../../../domain/estudiante/entity/estudiante.entity';
import { Contact } from '../../../../domain/contact/entity/contact.entity';
import {
  Homologacion,
  EstatusHomologacion,
} from '../../../../domain/homologaciones/entity/homologacion.entity';
import { EstudianteService } from '../estudiante.service';
import { HomologacionService } from '../../homologacion/homologacion.service';
import { ContactRepository } from '../../../../domain/contact/repository/contact.repository';
import { RegistroEstudianteDto } from 'src/domain/estudiante/registro-estudiante/dto/registro-estudiante.dto';

@Injectable()
export class ProcesarRegistroUseCase {
  private readonly logger = new Logger(ProcesarRegistroUseCase.name);
  
  constructor(
    private readonly estudianteService: EstudianteService,
    private readonly homologacionService: HomologacionService,
    @Inject('ContactRepository')
    private readonly contactRepository: ContactRepository,
  ) {}

  async procesarRegistro(registroDto: RegistroEstudianteDto) {
    try {
      let estudianteResult = await this.estudianteService.obtenerEstudiantePorIdentificacion(
        registroDto.numeroIdentificacion,
      );

      let estudiante: Estudiante;
      if (!estudianteResult || !estudianteResult.data) {
        const createResult = await this.estudianteService.createEstudiante(
          new Estudiante({
            nombreCompleto: registroDto.nombreCompleto,
            numeroIdentificacion: registroDto.numeroIdentificacion,
          }),
        );
        estudiante = createResult as Estudiante;
      } else {
        estudiante = estudianteResult.data as Estudiante;
      }

      let contact = await this.contactRepository.findByEstudianteId(
        estudiante.id,
      );

      if (contact) {
        contact = await this.contactRepository.update(contact.id, estudiante.id, {
          celular: registroDto.celular,
          numFijo: registroDto.numFijo,
          email: registroDto.email,
          updatedAt: new Date(),
        });
      } else {
        contact = await this.contactRepository.create(
          new Contact({
            celular: registroDto.celular,
            numFijo: registroDto.numFijo,
            email: registroDto.email,
            estudianteId: estudiante.id,
          }),
        );
      }

      const homologacionResult = await this.homologacionService.crearHomologacion({
        estudianteId: estudiante.id,
        carreraCun: registroDto.carreraCun,
        jornada: registroDto.jornada,
        modalidad: registroDto.modalidad,
        ciudad: registroDto.ciudad,
        institucion: registroDto.institucion,
        carreraHom: registroDto.carreraHom,
        fechaGrado: registroDto.fechaGrado,
        nivelEstudio: registroDto.nivelEstudio,
        estatus: EstatusHomologacion.SIN_DOCUMENTOS,
      });

      const homologacion = homologacionResult.data as Homologacion;

      return {
        message: 'Estudiante registrado exitosamente',
        data: {
          estudiante,
          contact,
          homologacion,
        },
      };
    } catch (error) {
      this.logger.error(`Error al procesar registro: ${error.message}`, error.stack);
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }
}