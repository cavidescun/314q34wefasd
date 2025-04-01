import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectDataContactTypeORM } from 'src/domain/collect_data_contact/persistence/typeorm/collect_data_contact.entity';
import { DocumentsTypeORM } from 'src/domain/documents/persistence/typeorm/documents.entity';
import { HomologacionTypeORM } from 'src/domain/homologaciones/persistence/typeorm/homologaciones.entity';
import { ContactTypeORM } from 'src/domain/contact/persistence/typeorm/contact.entity';
import { EstudianteTypeORM } from 'src/domain/estudiante/persistence/typeorm/estudiante.entity';
import { InstitucionTypeORM } from 'src/domain/institucion/persistence/typeorm/institucion.entity';
import { SenaTypeORM } from './sena/reconocimiento-titulos/persistence/typeorm/reconocimiento-titulo.entity';
import { EstudianteRepositoryImpl } from './estudiante/persistence/estudiante.repository.impl';
import { ContactRepositoryImpl } from './contact/persistence/contact.repository.impl';
import { HomologacionRepositoryImpl } from './homologaciones/persistence/homologacion.repository.impl';
import { DocumentsRepositoryImpl } from './documents/persistence/documents.repository.impl';
import { CollectDataContactRepositoryImpl } from './collect_data_contact/persistence/collect_data_contact.repository.imp';
import { InstitucionRepositoryImpl } from './institucion/persistence/institucion.repository.impl';
import { SenaRepositoryImpl } from './sena/reconocimiento-titulos/persistence/reconocimiento-titulo.repository.impl';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getPostgresConfig, 
  getOracleConfig, 
  getSqlServerConfig 
} from '../infrastructure/interface/common/database/database.config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getPostgresConfig,
    }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: getOracleConfig,
    // }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getSqlServerConfig,
    }),
    TypeOrmModule.forFeature([
      EstudianteTypeORM,
      ContactTypeORM,
      HomologacionTypeORM,
      DocumentsTypeORM,
      CollectDataContactTypeORM,
      InstitucionTypeORM,
      SenaTypeORM,
    ]),
  ],
  providers: [
    {
      provide: 'EstudianteRepository',
      useClass: EstudianteRepositoryImpl,
    },
    {
      provide: 'ContactRepository',
      useClass: ContactRepositoryImpl,
    },
    {
      provide: 'HomologacionRepository',
      useClass: HomologacionRepositoryImpl,
    },
    {
      provide: 'DocumentsRepository',
      useClass: DocumentsRepositoryImpl,
    },
    {
      provide: 'CollectDataContactRepository',
      useClass: CollectDataContactRepositoryImpl,
    },
    {
      provide: 'InstitucionRepository',
      useClass: InstitucionRepositoryImpl,
    },
    {
      provide: 'SenaRepository',
      useClass: SenaRepositoryImpl,
    },
  ],
  exports: [
    TypeOrmModule,
    'EstudianteRepository',
    'ContactRepository',
    'HomologacionRepository',
    'DocumentsRepository',
    'CollectDataContactRepository',
    'InstitucionRepository',
    'SenaRepository',
  ],
})
export class DomainModule {}