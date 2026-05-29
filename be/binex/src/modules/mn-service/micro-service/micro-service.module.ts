import { Module } from '@nestjs/common';
import { MicroServiceService } from './micro-service.service';
import { MicroServiceController } from './micro-service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MicroService } from './entities/micro-service.entity';
import { Sv_Pk } from '../service/entities/sv-pk.entity';
import { SV_Micro } from '../service/entities/sv-micro.entity';
import { PK_Micro } from '../packages/entities/pk-micro';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([MicroService, Sv_Pk, SV_Micro, PK_Micro]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MicroServiceController],
  providers: [MicroServiceService],
  exports: [MicroServiceService, TypeOrmModule],
})
export class MicroServiceModule {}
