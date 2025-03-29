import { Module } from '@nestjs/common';
import { DomainModule } from '../domain/domain.module';
import { ExternalServicesModule } from '../infrastructure/external-services/external-services.module';
import { ProcesarRegistroInicialUseCase } from './services/procesar-registro-inicial.service';
import { ObtenerEstudianteUseCase } from './services/obtener-estudiante.service';
import { ProcesarRegistroUseCase } from './services/procesar-registro.service';
import { ValidarDocumentosUseCase } from './services/validad-documentos.service';
import { ActualizarHomologacionUseCase } from './services/actualizar-homologacion.service';
import { ActualizarDatosAcademicosUseCase } from './services/actualizar-datos-academicos.service';
import { EstudianteService } from './services/estudiante.service';
import { HomologacionService } from './services/homologacion.service';
import { DocumentsService } from './services/documents.service';
@Module({
  imports: [
    DomainModule,
    ExternalServicesModule,
  ],
  providers: [
    ProcesarRegistroInicialUseCase,
    ObtenerEstudianteUseCase,
    ProcesarRegistroUseCase,
    ValidarDocumentosUseCase,
    ActualizarHomologacionUseCase,
    ActualizarDatosAcademicosUseCase,
    EstudianteService,
    HomologacionService,
    DocumentsService
  ],
  exports: [
    ProcesarRegistroInicialUseCase,
    ObtenerEstudianteUseCase,
    ProcesarRegistroUseCase,
    ValidarDocumentosUseCase,
    ActualizarHomologacionUseCase,
    ActualizarDatosAcademicosUseCase,
    EstudianteService,
    HomologacionService,
    DocumentsService
  ],
})
export class ApplicationModule {}