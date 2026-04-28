import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';

import { AuthModule } from '../auth/auth.module';

import { UserPermission } from './entities/user-permission.entity';
import { Serivce } from '../serivce/entities/serivce.entity';
import { Package } from '../package/entities/package.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserPermission, Serivce, Package]),
    AuthModule,
  ],

  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
