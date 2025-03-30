import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApplicationModule } from './application/application.module';
import { DomainModule } from './domain/domain.module';
import { ControllersModule } from './infrastructure/controllers/controllers.module';
import { ExternalServicesModule } from './infrastructure/external-services/external-services.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`, 
    }),
    ApplicationModule,
    DomainModule,
    ControllersModule,
    ExternalServicesModule,
  ],
})
export class AppModule {}