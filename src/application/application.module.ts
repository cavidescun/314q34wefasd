
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DomainModule } from '../domain/domain.module';
import { ExternalServicesModule } from '../infrastructure/external-services/external-services.module';
import { ProcesarRegistroInicialUseCase } from './services/registro-inicial/procesar-registro-inicial.service';
import { ObtenerEstudianteUseCase } from './services/estudiantes/obteber-estudiantes/obtener-estudiante.service';
import { ProcesarRegistroUseCase } from './services/estudiantes/registrar-estudiante/procesar-registro.service';
import { ValidarDocumentosUseCase } from './services/documentos/validar-documentos/validar-documentos.service';
import { ActualizarHomologacionUseCase } from './services/homologacion/actualizar-homologacion/actualizar-homologacion.service';
import { ActualizarDatosAcademicosUseCase } from './services/datos-academicos/actualizar-datos-academicos.service';
import { EstudianteService } from './services/estudiantes/estudiante.service';
import { HomologacionService } from './services/homologacion/homologacion.service';
import { DocumentsService } from './services/documentos/documents.service';
import { InstitucionService } from './services/institucion/institucion.service';
import { SenaService } from './services/reconocimiento-titulos/reconocimiento-titulos.service';
import { ProgramasUnicosService } from './services/programas/programas.service';
import { CarrerasAfinesService } from './services/carreras-afines/carreras-afines.service';
import { MetodologiasCarrerasService } from './services/metodologias/metodologias.service';
import { JornadasPensumService } from './services/jornadas/jornadas.service';
import { SedesCarrerasService } from './services/ciudades/ciudades.service';
import { MateriasHomologacionService } from './services/materias/materias.service';
import { SenaTypeORM } from '../domain/sena/reconocimiento-titulos/persistence/typeorm/reconocimiento-titulo.entity';

@Module({
  imports: [
    DomainModule,
    ExternalServicesModule,
    ConfigModule,
    TypeOrmModule.forFeature([SenaTypeORM]),
  ],
  providers: [
    EstudianteService,
    HomologacionService,
    DocumentsService,
    InstitucionService,
    SenaService,
    ProgramasUnicosService,
    CarrerasAfinesService,
    MetodologiasCarrerasService,
    JornadasPensumService,
    SedesCarrerasService,
    MateriasHomologacionService,
    ProcesarRegistroInicialUseCase,
    ObtenerEstudianteUseCase,
    ProcesarRegistroUseCase,
    ValidarDocumentosUseCase,
    ActualizarHomologacionUseCase,
    ActualizarDatosAcademicosUseCase,
  ],
  exports: [
    EstudianteService,
    HomologacionService,
    DocumentsService,
    InstitucionService,
    SenaService,
    ProgramasUnicosService,
    CarrerasAfinesService,
    MetodologiasCarrerasService,
    JornadasPensumService,
    SedesCarrerasService,
    MateriasHomologacionService,
    ProcesarRegistroInicialUseCase,
    ObtenerEstudianteUseCase,
    ProcesarRegistroUseCase,
    ValidarDocumentosUseCase,
    ActualizarHomologacionUseCase,
    ActualizarDatosAcademicosUseCase,
  ],
})
export class ApplicationModule {}