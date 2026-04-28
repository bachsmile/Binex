import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/entities/user.entity';
import { Wedding } from './modules/wedding/entities/wedding.entity';
import { WdWeb } from './modules/wedding/entities/wd-web.entity';
import { WdCard } from './modules/wedding/entities/wd-card.entity';
import { WeddingPackage } from './modules/wedding-package/entities/wedding-package.entity';
import { UserModule } from './modules/user/user.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { AuthModule } from './modules/auth/auth.module';
import { SerivceModule } from './modules/serivce/serivce.module';
import { WeddingModule } from './modules/wedding/wedding.module';
import { PackageModule } from './modules/package/package.module';
import { PayModule } from './modules/pay/pay.module';
import { MethodPayModule } from './modules/method-pay/method-pay.module';
import { WeddingPackageModule } from './modules/wedding-package/wedding-package.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Wedding, WdWeb, WdCard, WeddingPackage],
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    WalletModule,
    AuthModule,
    SerivceModule,
    WeddingModule,
    PackageModule,
    PayModule,
    MethodPayModule,
    WeddingPackageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
