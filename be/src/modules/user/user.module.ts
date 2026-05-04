import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';

import { AuthModule } from '../auth/auth.module';

import { UserPermission } from './entities/user-permission.entity';
import { Service } from '../service/entities/service.entity';
import { Package } from '../service/entities/package.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserPermission, Service, Package]),
    forwardRef(() => AuthModule),
  ],

  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
