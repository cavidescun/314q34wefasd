import { registerAs } from '@nestjs/config';

export default registerAs('configuration', () => ({
  PORT: parseInt(process.env.PORT ?? '4000', 10),
  FRONTEND_SERVER_URL: process.env.FRONTEND_SERVER_URL ?? '',
  API_PREFIX: process.env.API_PREFIX ?? '/',
  ENVIRONMENT: process.env.NODE_ENV ?? 'development',

  POSTGRE: {
    DB_HOST: process.env.DB_HOST ?? 'localhost',
    DB_PORT: parseInt(process.env.DB_PORT ?? '5432', 10),
    DB_USERNAME: process.env.DB_USERNAME ?? 'user',
    DB_PASSWORD: process.env.DB_PASSWORD ?? '',
    DB_NAME: process.env.DB_NAME ?? 'database',
  },

  AWS3: {
    AWS_REGION: process.env.AWS_REGION ?? 'us-east-1',
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME ?? '',
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ?? '',
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },

  SECURA: {
    SECURA_ENCRYPT_KEY: process.env.SECURA_ENCRYPT_KEY ?? '123',
    SECURA_ENCRYPT_VECTOR: process.env.SECURA_ENCRYPT_VECTOR ?? '123',
    OCR_ENDPOINT: process.env.OCR_ENDPOINT ?? '',
    OCR_EMAIL: process.env.OCR_EMAIL ?? '',
  },

  ORACLE: {
    ORACLE_HOST: process.env.ORACLE_HOST ?? 'localhost',
    ORACLE_PORT: parseInt(process.env.ORACLE_PORT ?? '1521', 10),
    ORACLE_USERNAME: process.env.ORACLE_USERNAME ?? 'oracle',
    ORACLE_PASSWORD: process.env.ORACLE_PASSWORD ?? 'oraclepass',
    ORACLE_SID: process.env.ORACLE_SID ?? 'XE',
  },

  SQLSERVER: {
    SQLSERVER_HOST: process.env.SQLSERVER_HOST ?? 'localhost',
    SQLSERVER_PORT: parseInt(process.env.SQLSERVER_PORT ?? '1433', 10),
    SQLSERVER_USERNAME: process.env.SQLSERVER_USERNAME ?? 'sqlserver',
    SQLSERVER_PASSWORD: process.env.SQLSERVER_PASSWORD ?? 'sqlserverpass!',
    SQLSERVER_DATABASE: process.env.SQLSERVER_DATABASE ?? 'database',
  },

  ZEPTOMAIL: {
    ZEPTOMAIL_API_KEY: process.env.ZEPTOMAIL_API_KEY ?? '',
    ZEPTOMAIL_API_ENDPOINT: process.env.ZEPTOMAIL_API_ENDPOINT ?? 'https://api.zeptomail.com/v1.1/email/',
    ZEPTOMAIL_FROM_EMAIL: process.env.ZEPTOMAIL_FROM_EMAIL ?? '',
    ZEPTOMAIL_FROM_NAME: process.env.ZEPTOMAIL_FROM_NAME ?? '',
    ZEPTOMAIL_TIMEOUT: parseInt(process.env.ZEPTOMAIL_TIMEOUT ?? '10000', 10)
  },

  ZOHO: {
    ZOHO_API_URL: process.env.ZOHO_API_URL ?? '',
    ZOHO_USERNAME: process.env.ZOHO_USERNAME ?? '',
    ZOHO_PASSWORD: process.env.ZOHO_PASSWORD ?? '',
    ZOHO_WEBHOOK_KEY: process.env.ZOHO_WEBHOOK_KEY ?? ''
  },
}));
