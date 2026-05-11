import { Module, Global } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule } from '@nestjs/config';
import { MailController } from './mail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailSubscription } from './entities/mail-subscription.entity';

@Global()
@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([MailSubscription])],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
