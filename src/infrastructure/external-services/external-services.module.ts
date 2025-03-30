import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3StorageService } from './storage/storage.service';
import { OcrDocValidationService } from './secura/docValidation.service';
import { AuthModule } from './secura/secura-auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    AuthModule
  ],
  providers: [
    S3StorageService,
    OcrDocValidationService,
    {
      provide: 'StorageService',
      useClass: S3StorageService,
    },
    {
      provide: 'DocumentValidationService',
      useClass: OcrDocValidationService,
    }
  ],
  exports: [
    'StorageService',
    'DocumentValidationService',
    S3StorageService,
    OcrDocValidationService,
  ],
})
export class ExternalServicesModule {}