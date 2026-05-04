import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guest } from '../../entities/guest.entity';
import { Wedding } from '../../entities/wedding.entity';
import { GuestService } from './guest.service';
import { GuestController } from './guest.controller';
import { UserModule } from '../../../user/user.module';
import { AuthModule } from '../../../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Guest, Wedding]),
    UserModule,
    AuthModule,
  ],
  controllers: [GuestController],
  providers: [GuestService],
  exports: [GuestService],
})
export class GuestModule {}
