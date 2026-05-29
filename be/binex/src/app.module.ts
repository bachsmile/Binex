import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/mn-user/user/user.module';
import { AuthModule } from './modules/mn-user/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/mn-user/user/entities/user.entity';
import { WalletModule } from './modules/mn-wallet/wallet/wallet.module';
import { BankingModule } from './modules/mn-wallet/banking/banking.module';
import { TransactionModule } from './modules/mn-wallet/transaction/transaction.module';
import { MicroServiceModule } from './modules/mn-service/micro-service/micro-service.module';
import { ServiceModule } from './modules/mn-service/service/service.module';
import { PackagesModule } from './modules/mn-service/packages/packages.module';
import { FiProjectsModule } from './modules/mn-finance/fi-projects/fi-projects.module';
import { FiMoneyModule } from './modules/mn-finance/fi-money/fi-money.module';
import { FiCryptoModule } from './modules/mn-finance/fi-crypto/fi-crypto.module';
import { FiEarnModule } from './modules/mn-finance/fi-earn/fi-earn.module';
import { FiReportModule } from './modules/mn-finance/fi-report/fi-report.module';
import { FiEventModule } from './modules/mn-finance/fi-event/fi-event.module';
import { PfFeeModule } from './modules/mn-platform/pf-fee/pf-fee.module';
import { MailModule } from './modules/mn-platform/mail/mail.module';
import { ArticleModule } from './modules/mn-article/article/article.module';
import { JwtModule } from '@nestjs/jwt';
import { WedCardModule } from './modules/mn-wed/wed-card/wed-card.module';
import { WedModule } from './modules/mn-wed/wed/wed.module';
import { WedWebModule } from './modules/mn-wed/wed-web/wed-web.module';
import { WedParticipantsModule } from './modules/mn-wed/wed-participants/wed-participants.module';
import { WedMapTableModule } from './modules/mn-wed/wed-map-table/wed-map-table.module';

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
        autoLoadEntities: true,
        synchronize: true,
        entities: [User],
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    WalletModule,
    BankingModule,
    TransactionModule,
    MicroServiceModule,
    ServiceModule,
    PackagesModule,
    FiProjectsModule,
    FiMoneyModule,
    FiCryptoModule,
    FiEarnModule,
    FiReportModule,
    FiEventModule,
    PfFeeModule,
    MailModule,
    ArticleModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30d' },
      }),
      inject: [ConfigService],
    }),
    WedCardModule,
    WedModule,
    WedWebModule,
    WedParticipantsModule,
    WedMapTableModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
