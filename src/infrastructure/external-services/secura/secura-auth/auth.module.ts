import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EncryptionService } from '../utils/regulaEncryption.util';
import { TokenGeneratorService } from '../utils/regulaToken.util';
import { SecuraAuthService } from './auth.service';

@Module({
  imports: [ConfigModule],
  providers: [ EncryptionService, TokenGeneratorService, SecuraAuthService],
  exports: [ EncryptionService, TokenGeneratorService, SecuraAuthService],
})
export class AuthModule {}