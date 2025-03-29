import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectDataContactTypeORM } from 'src/domain/collect_data_contact/persistence/typeorm/collect_data_contact.entity';
import { DocumentsTypeORM } from 'src/domain/documents/persistence/typeorm/documents.entity';
import { HomologacionTypeORM } from 'src/domain/homologaciones/persistence/typeorm/homologaciones.entity';
import { ContactTypeORM } from 'src/domain/contact/persistence/typeorm/contact.entity';
import { EstudianteTypeORM } from 'src/domain/estudiante/persistence/typeorm/estudiante.entity';
import { EstudianteRepositoryImpl } from './estudiante/persistence/estudiante.repository.impl';
import { ContactRepositoryImpl } from './contact/persistence/contact.repository.impl';
import { HomologacionRepositoryImpl } from './homologaciones/persistence/homologacion.repository.impl';
import { DocumentsRepositoryImpl } from './documents/persistence/documents.repository.impl';
import { CollectDataContactRepositoryImpl } from './collect_data_contact/persistence/collect_data_contact.repository.imp';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          entities: [
            EstudianteTypeORM,
            ContactTypeORM,
            HomologacionTypeORM,
            DocumentsTypeORM,
            CollectDataContactTypeORM,
          ],
          synchronize: false,
          logging: false,
          ssl: {
            rejectUnauthorized: false,
          },
        };
      },
    }),
    TypeOrmModule.forFeature([
      EstudianteTypeORM,
      ContactTypeORM,
      HomologacionTypeORM,
      DocumentsTypeORM,
      CollectDataContactTypeORM,
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
  ],
  exports: [
    TypeOrmModule,
    'EstudianteRepository',
    'ContactRepository',
    'HomologacionRepository',
    'DocumentsRepository',
    'CollectDataContactRepository',
  ],
})
export class DomainModule {}
