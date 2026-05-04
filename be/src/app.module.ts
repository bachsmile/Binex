import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/entities/user.entity';
import { Wedding } from './modules/wedding/entities/wedding.entity';
import { WdWeb } from './modules/wedding/entities/wd-web.entity';
import { WdCard } from './modules/wedding/entities/wd-card.entity';
import { WeddingPackage } from './modules/wedding/entities/wedding-package.entity';
import { Wallet } from './modules/wallet/entities/wallet.entity';
import { Transaction } from './modules/wallet/entities/transaction.entity';
import { UserModule } from './modules/user/user.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { AuthModule } from './modules/auth/auth.module';
import { ServiceModule } from './modules/service/service.module';
import { WeddingModule } from './modules/wedding/wedding.module';

import { PayModule } from './modules/pay/pay.module';
import { FinanceModule } from './modules/finance/finance.module';
import { UploadModule } from './modules/upload/upload.module';
import { MailModule } from './modules/mail/mail.module';
import { FileManagerModule } from './modules/file-manager/file-manager.module';
import { EventModule } from './modules/event/event.module';
import { PlatformFeeModule } from './modules/platform-fee/platform-fee.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          User,
          Wedding,
          WdWeb,
          WdCard,
          WeddingPackage,
          Wallet,
          Transaction,
        ],
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    WalletModule,
    AuthModule,
    ServiceModule,
    WeddingModule,
    PayModule,
    FinanceModule,
    UploadModule,
    MailModule,
    FileManagerModule,
    EventModule,
    PlatformFeeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
