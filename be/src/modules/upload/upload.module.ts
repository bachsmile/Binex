import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { FileManagerModule } from '../file-manager/file-manager.module';

@Module({
  imports: [AuthModule, ConfigModule, UserModule, FileManagerModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
