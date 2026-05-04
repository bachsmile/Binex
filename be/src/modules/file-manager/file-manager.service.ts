import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileAsset } from './entities/file-asset.entity';
import { UserService } from '../user/user.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileManagerService {
  constructor(
    @InjectRepository(FileAsset)
    private readonly fileAssetRepository: Repository<FileAsset>,
    private readonly userService: UserService,
  ) {}

  async getUserFiles(userId: string) {
    return await this.fileAssetRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getStorageStats(userId: string) {
    const user = await this.userService.findOne(userId);
    const limitMB = await this.userService.getUserStorageLimit(userId);

    return {
      usedMB: Number(user?.usedStorage) || 0,
      limitMB: limitMB,
      isUnlimited: limitMB === 0,
    };
  }

  async deleteFile(fileId: string, userId: string) {
    const file = await this.fileAssetRepository.findOne({
      where: { id: fileId, userId },
    });

    if (!file) {
      throw new NotFoundException(
        'Không tìm thấy tệp hoặc bạn không có quyền xóa.',
      );
    }

    // 1. Xóa file vật lý
    const filePath = path.join(process.cwd(), file.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 2. Cập nhật dung lượng đã dùng của User (trừ đi)
    const fileSize = Number(file.size);
    await this.userService.updateUsedStorage(userId, -fileSize);

    // 3. Xóa bản ghi trong DB
    await this.fileAssetRepository.remove(file);

    return { success: true };
  }

  async recordFileUpload(data: Partial<FileAsset>) {
    const asset = this.fileAssetRepository.create(data);
    return await this.fileAssetRepository.save(asset);
  }
}
