import { registerAs } from "@nestjs/config"

export default registerAs('configuration' , () => ({

  PORT: parseInt(process.env.PORT ?? '4000', 10),
  FRONTEND_SERVER_URL: process.env.FRONTEND_SERVER_URL ?? '',
  API_PREFIX: process.env.API_PREFIX ?? '/',
  ENVIRONMENT:process.env.NODE_ENV ?? 'development',

  DB: {
    DB_HOST: process.env.DB_HOST ?? 'localhost',
    DB_PORT: parseInt(process.env.DB_PORT ?? '5432', 10),
    DB_USERNAME: process.env.DB_USERNAME ?? 'user',
    DB_PASSWORD: process.env.DB_PASSWORD ?? '',
    DB_NAME: process.env.DB_NAME ?? 'database',
  },

  AWS3:{
    AWS_REGION: process.env.AWS_REGION ?? "us-east-1",
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME ?? '',
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ?? '',
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },

  SECURA:{
    SECURA_ENCRYPT_KEY: process.env.SECURA_ENCRYPT_KEY ?? '123',
    SECURA_ENCRYPT_VECTOR:process.env.SECURA_ENCRYPT_VECTOR ?? '123',
    OCR_ENDPOINT: process.env.OCR_ENDPOINT ?? '',
    OCR_EMAIL: process.env.OCR_EMAIL ?? '',
  }

}))