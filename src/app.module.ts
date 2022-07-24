import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { CreditCardsModule } from './credit-cards/credit-cards.module';
import { DriversLicenseModule } from './drivers-license/drivers-license.module';
import { PassportsModule } from './passports/passports.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './users/users.entity';
import { CreditCardsEntity } from './credit-cards/credit-cards.entity';
import { DriversLicenseEntity } from './drivers-license/drivers-license.entity';
import { PassportsEntity } from './passports/passports.entity';
import { ConfigService } from './config/config.service';
import { StatusEntity } from './status/status.entity';

export const configService = new ConfigService('conf-local.env');

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    CreditCardsModule,
    DriversLicenseModule,
    PassportsModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      name: configService.databaseConnectionName,
      host: configService.databaseHost,
      port: configService.databasePort,
      username: configService.databaseUser,
      password: configService.databasePassword,
      database: configService.databaseName,
      synchronize: configService.databaseSynchronize,
      logging: configService.databaseLogging,
      extra: {
        connectionTimeoutMillis: configService.databaseConnectionTimeout,
        idleTimeoutMillis: 2000,
        max: 10,
      },
      entities: [
        UsersEntity,
        CreditCardsEntity,
        DriversLicenseEntity,
        PassportsEntity,
        StatusEntity,
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
