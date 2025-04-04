import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3StorageService } from './storage/storage.service';
import { OcrDocValidationService } from './secura/docValidation.service';
import { AuthModule } from './secura/secura-auth/auth.module';
import { ZeptoMailService } from './email/zeptomail.service';
import { ZohoService } from './zoho/zoho.service';

@Module({
  imports: [
    ConfigModule,
    AuthModule
  ],
  providers: [
    S3StorageService,
    OcrDocValidationService,
    ZeptoMailService,
    ZohoService,
    {
      provide: 'StorageService',
      useClass: S3StorageService,
    },
    {
      provide: 'DocumentValidationService',
      useClass: OcrDocValidationService,
    },
    {
      provide: ZeptoMailService,
      useClass: ZeptoMailService,
    },
    {
      provide: ZohoService,
      useClass: ZohoService,
    }
  ],
  exports: [
    'StorageService',
    'DocumentValidationService',
    S3StorageService,
    OcrDocValidationService,
    ZeptoMailService,
    ZohoService,
  ],
})
export class ExternalServicesModule {}