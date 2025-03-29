import { Injectable, Inject } from '@nestjs/common';
import { Estudiante } from '../../domain/estudiante/entity/estudiante.entity';
import { Contact } from '../../domain/contact/entity/contact.entity';
import {
  Homologacion,
  EstatusHomologacion,
} from '../../domain/homologaciones/entity/homologacion.entity';
import { EstudianteService } from './estudiante.service';
import { HomologacionService } from './homologacion.service';
import { ContactRepository } from '../../domain/contact/repository/contact.repository';
import { RegistroEstudianteDto } from 'src/domain/estudiante/registro-estudiante/dto/registro-estudiante.dto';
@Injectable()
export class ProcesarRegistroUseCase {
  constructor(
    private readonly estudianteService: EstudianteService,
    private readonly homologacionService: HomologacionService,
    @Inject('ContactRepository')
    private readonly contactRepository: ContactRepository,
  ) {}

  async execute(registroDto: RegistroEstudianteDto): Promise<{
    estudiante: Estudiante;
    contact: Contact;
    homologacion: Homologacion;
  }> {
    let estudiante = await this.estudianteService.getEstudianteByIdentificacion(
      registroDto.numeroIdentificacion,
    );

    if (!estudiante) {
      estudiante = await this.estudianteService.createEstudiante(
        new Estudiante({
          nombreCompleto: registroDto.nombreCompleto,
          numeroIdentificacion: registroDto.numeroIdentificacion,
        }),
      );
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

    const homologacion = await this.homologacionService.createHomologacion(
      new Homologacion({
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
      }),
    );

    return {
      estudiante,
      contact,
      homologacion,
    };
  }
}
