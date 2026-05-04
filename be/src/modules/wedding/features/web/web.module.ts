import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WdWeb } from '../../entities/wd-web.entity';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([WdWeb]), AuthModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class WebModule {}
