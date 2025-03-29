import { Module } from '@nestjs/common';
import { ApplicationModule } from '../../application/application.module';
import { DomainModule } from '../../domain/domain.module';
import { RegistroController } from './registro.controller';
import { EstudianteController } from './estudiante.controller';
import { HomologacionController } from './homologacion.controller';
import { DocumentsController } from './documents.controller';
import { CollectDataContactController } from './collect_data_contact.controller';
import { RegistroInicialController } from './registro-inicial.controller';
import { ActualizarHomologacionController } from './actualizar-homologacion.controller';
import { ActualizarDatosAcademicosController } from './actualizar-datos-academicos.controller';

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
    ActualizarDatosAcademicosController
  ],
})
export class ControllersModule {}