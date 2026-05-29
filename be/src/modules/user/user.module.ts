import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';

import { AuthModule } from '../auth/auth.module';

import { UserSubscription } from './entities/user-subscription.entity';
import { Permission } from '../service/entities/permission.entity';
import { Service } from '../service/entities/service.entity';
import { ServiceGroup } from '../service-group/entities/service-group.entity';
import { ServiceGroupModule } from '../service-group/service-group.module';
import { Package } from '../service/entities/package.entity';

@Module({
  imports: [
    ServiceGroupModule,
    TypeOrmModule.forFeature([
      User,
      UserSubscription,
      Permission,
      Service,
      ServiceGroup,
      Package,
    ]),
    forwardRef(() => AuthModule),
  ],

  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
