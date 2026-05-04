import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wedding } from './entities/wedding.entity';
import { WeddingService } from './wedding.service';
import { WeddingController } from './wedding.controller';
import { AuthModule } from '../auth/auth.module';

// Sub-modules
import { CardModule } from './features/card/card.module';
import { WebModule } from './features/web/web.module';
import { PackageModule } from './features/package/package.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wedding]),
    AuthModule,
    UserModule,
    CardModule,
    WebModule,
    PackageModule,
  ],
  controllers: [WeddingController],
  providers: [WeddingService],
  exports: [WeddingService],
})
export class WeddingModule {}
