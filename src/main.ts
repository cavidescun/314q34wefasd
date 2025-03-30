import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

const logger = new Logger('Bootstrap');

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    app.setGlobalPrefix(configService.get('API_PREFIX') || 'api');

    const swaggerConfig = new DocumentBuilder()
      .setTitle('API de Homologaciones')
      .setDescription('API para gestionar el proceso de homologación académica')
      .setVersion('1.0')
      .addTag('estudiantes', 'Operaciones relacionadas con estudiantes')
      .addTag('homologaciones', 'Operaciones relacionadas con homologaciones')
      .addTag('documentos', 'Operaciones relacionadas con documentos')
      .addTag(
        'contactos',
        'Operaciones relacionadas con información de contacto',
      )
      .addTag('registro-inicial', 'Primer paso del proceso de homologación')
      .addTag(
        'actualizar-homologacion',
        'Segundo paso del proceso de homologación',
      )
      .addTag(
        'datos-academicos',
        'Actualizar información académica del estudiante',
      )
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/v1', app, document);
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ limit: '10mb', extended: true }));
    app.use('/uploads', express.static('uploads'));

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    app.enableCors();
    const port = configService.get('PORT') || 3000;
    await app.listen(port);
}

bootstrap();