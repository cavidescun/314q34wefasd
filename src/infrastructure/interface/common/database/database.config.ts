import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EstudianteTypeORM } from 'src/domain/estudiante/persistence/typeorm/estudiante.entity';
import { ContactTypeORM } from 'src/domain/contact/persistence/typeorm/contact.entity';
import { HomologacionTypeORM } from 'src/domain/homologaciones/persistence/typeorm/homologaciones.entity';
import { DocumentsTypeORM } from 'src/domain/documents/persistence/typeorm/documents.entity';
import { CollectDataContactTypeORM } from 'src/domain/collect_data_contact/persistence/typeorm/collect_data_contact.entity';
import { InstitucionTypeORM } from 'src/domain/institucion/persistence/typeorm/institucion.entity';

import { ConfigService, ConfigModule } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const config: TypeOrmModuleOptions = {
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
      InstitucionTypeORM,
    ],
    synchronize: false,
    logging: false,
    ssl: {
      rejectUnauthorized: false,
    },
  };

  return config;
};