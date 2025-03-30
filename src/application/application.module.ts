import { Module, forwardRef } from '@nestjs/common';
import { DomainModule } from '../domain/domain.module';
import { ExternalServicesModule } from '../infrastructure/external-services/external-services.module';
import { ProcesarRegistroInicialUseCase } from './services/registro-inicial/procesar-registro-inicial.service';
import { ObtenerEstudianteUseCase } from './services/estudiantes/obteber-estudiantes/obtener-estudiante.service';
import { ProcesarRegistroUseCase } from './services/estudiantes/registrar-estudiante/procesar-registro.service';
import { ValidarDocumentosUseCase } from './services/documentos/validar-documentos/validar-documentos.service';
import { ActualizarHomologacionUseCase } from './services/homologacion/actualizar/actualizar-homologacion.service';
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

@Module({
  imports: [
    DomainModule,
    ExternalServicesModule,
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
    ProcesarRegistroInicialUseCase,
    ObtenerEstudianteUseCase,
    ProcesarRegistroUseCase,
    ValidarDocumentosUseCase,
    ActualizarHomologacionUseCase,
    ActualizarDatosAcademicosUseCase,
  ],
})
export class ApplicationModule {}