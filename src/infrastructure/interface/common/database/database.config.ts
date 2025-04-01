import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EstudianteTypeORM } from 'src/domain/estudiante/persistence/typeorm/estudiante.entity';
import { ContactTypeORM } from 'src/domain/contact/persistence/typeorm/contact.entity';
import { HomologacionTypeORM } from 'src/domain/homologaciones/persistence/typeorm/homologaciones.entity';
import { DocumentsTypeORM } from 'src/domain/documents/persistence/typeorm/documents.entity';
import { CollectDataContactTypeORM } from 'src/domain/collect_data_contact/persistence/typeorm/collect_data_contact.entity';
import { InstitucionTypeORM } from 'src/domain/institucion/persistence/typeorm/institucion.entity';
import { SenaTypeORM } from 'src/domain/sena/reconocimiento-titulos/persistence/typeorm/reconocimiento-titulo.entity';

import { ConfigService } from '@nestjs/config';

export const getPostgresConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const config: TypeOrmModuleOptions = {
    name: 'default',
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
      SenaTypeORM,
    ],
    synchronize: false,
    logging: false,
    ssl: {
      rejectUnauthorized: false,
    },
  };

  return config;
};

export const getOracleConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const config: TypeOrmModuleOptions = {
    name: 'oracle',
    type: 'oracle',
    host: configService.get<string>('ORACLE_HOST'),
    // port: configService.get<number>('ORACLE_PORT'),
    username: configService.get<string>('ORACLE_USERNAME'),
    password: configService.get<string>('ORACLE_PASSWORD'),
    sid: configService.get<string>('ORACLE_SID'),
    synchronize: false,
    logging: false,
    entities: [],
    extra: {
      readOnly: true,
      poolMax: 10,
      poolMin: 1
    }
  };

  return config;
};

export const getSqlServerConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const config: TypeOrmModuleOptions = {
    name: 'sqlserver',
    type: 'mssql',
    host: configService.get<string>('SQLSERVER_HOST'),
    port: Number(configService.get<number>('SQLSERVER_PORT')),
    username: configService.get<string>('SQLSERVER_USERNAME'),
    password: configService.get<string>('SQLSERVER_PASSWORD'),
    database: configService.get<string>('SQLSERVER_DATABASE'),
    synchronize: false,
    logging: false,
    entities: [],
    options: {
      encrypt: false,
      trustServerCertificate: false,
    },
    extra: {
      connectionReadOnly: true
    }
  };

  return config;
};