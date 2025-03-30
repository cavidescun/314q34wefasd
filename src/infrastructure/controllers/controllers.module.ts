import { Module } from '@nestjs/common';
import { ApplicationModule } from '../../application/application.module';
import { DomainModule } from '../../domain/domain.module';
import { RegistroController } from './registro-estudiante/registro.controller';
import { EstudianteController } from './estudiante/estudiante.controller';
import { HomologacionController } from './homologacion/homologacion.controller';
import { DocumentsController } from './documentos/documents.controller';
import { CollectDataContactController } from './collect-data-contact/collect_data_contact.controller';
import { RegistroInicialController } from './registro-inicial/registro-inicial.controller';
import { ActualizarHomologacionController } from './actualizar-homologacion/actualizar-homologacion.controller';
import { ActualizarDatosAcademicosController } from './actualizar-datos-academicos/actualizar-datos-academicos.controller';
import { InstitucionController } from './institucion/institucion.controller';
import { SenaController } from './reconocimiento-titulos/reconocimiento-titulos.controller';
import { ProgramasUnicosController } from './programas/programas.controller';
import { CarrerasAfinesController } from './carreras-afines/carreras-afines.controller';
import { MetodologiasCarrerasController } from './metodologias/metodologias.controller';
import { JornadasPensumController } from './jornadas/jornadas.controller';
import { SedesCarrerasController } from './ciudades/ciudades.controller';

@Module({
  imports: [
    ApplicationModule,
    DomainModule,
  ],
  controllers: [
    RegistroController,
    EstudianteController,
    HomologacionController,
    DocumentsController,
    CollectDataContactController,
    RegistroInicialController,
    ActualizarHomologacionController,
    ActualizarDatosAcademicosController,
    InstitucionController,
    SenaController,
    ProgramasUnicosController,
    CarrerasAfinesController,
    MetodologiasCarrerasController,
    JornadasPensumController,
    SedesCarrerasController
  ],
})
export class ControllersModule {}