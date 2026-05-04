import { Injectable, BadRequestException } from '@nestjs/common';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { UserService } from '../user/user.service';
import { FileManagerService } from '../file-manager/file-manager.service';

@Injectable()
export class UploadService {
  constructor(
    private readonly userService: UserService,
    private readonly fileManagerService: FileManagerService,
  ) {}

  async optimizeAndSaveImages(
    files: Express.Multer.File[],
    subfolder: string,
    userId?: string,
  ) {
    if (!files || files.length === 0) {
      throw new Error('No files uploaded');
    }

    // Kiểm tra dung lượng còn lại nếu có userId
    let storageLimitMB = 0;
    let usedStorageMB = 0;

    if (userId) {
      storageLimitMB = await this.userService.getUserStorageLimit(userId);
      const user = await this.userService.findOne(userId);
      usedStorageMB = Number(user?.usedStorage) || 0;
    }

    const uploadPath = userId
      ? path.join(process.cwd(), 'uploads', subfolder, userId)
      : path.join(process.cwd(), 'uploads', subfolder);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const results: any[] = [];
    for (const file of files) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = `img-${uniqueSuffix}.webp`;
      const filePath = path.join(uploadPath, filename);

      const fileUrl = userId
        ? `/uploads/${subfolder}/${userId}/${filename}`
        : `/uploads/${subfolder}/${filename}`;

      // Xử lý nén trước để biết size thực tế sau tối ưu
      const processedBuffer = await sharp(file.buffer)
        .resize(1920, null, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      const fileSizeMB = Number(
        (processedBuffer.length / (1024 * 1024)).toFixed(4),
      );

      // Kiểm tra xem file này có làm vượt giới hạn không
      if (userId && storageLimitMB > 0) {
        if (usedStorageMB + fileSizeMB > storageLimitMB) {
          throw new BadRequestException(
            `Dung lượng lưu trữ không đủ. Giới hạn: ${storageLimitMB.toFixed(2)} MB, Đã dùng: ${usedStorageMB.toFixed(2)} MB, Tệp mới: ${fileSizeMB.toFixed(2)} MB.`,
          );
        }
      }

      await fs.promises.writeFile(filePath, processedBuffer);
      usedStorageMB += fileSizeMB;

      if (userId) {
        await this.userService.updateUsedStorage(userId, fileSizeMB);
      }

      const fileRecord = {
        url: fileUrl,
        filename: filename,
        originalName: file.originalname,
        size: fileSizeMB,
        mimetype: 'image/webp',
        userId: userId,
        category: 'image',
      };

      await this.fileManagerService.recordFileUpload(fileRecord);

      results.push(fileRecord);
    }

    return results;
  }

  async handleMultipleFilesUpload(
    files: Express.Multer.File[],
    subfolder: string,
    userId?: string,
  ) {
    if (!files || files.length === 0) {
      throw new Error('No files uploaded');
    }

    // Tương tự cho video/file khác
    let storageLimitMB = 0;
    let usedStorageMB = 0;

    if (userId) {
      storageLimitMB = await this.userService.getUserStorageLimit(userId);
      const user = await this.userService.findOne(userId);
      usedStorageMB = Number(user?.usedStorage) || 0;
    }

    const results: any[] = [];
    for (const file of files) {
      const fileSizeMB = Number((file.size / (1024 * 1024)).toFixed(4));

      // Kiểm tra giới hạn
      if (userId && storageLimitMB > 0) {
        if (usedStorageMB + fileSizeMB > storageLimitMB) {
          throw new BadRequestException(
            `Dung lượng lưu trữ không đủ. Giới hạn: ${storageLimitMB.toFixed(2)} MB, Đã dùng: ${usedStorageMB.toFixed(2)} MB, Tệp mới: ${fileSizeMB.toFixed(2)} MB.`,
          );
        }
      }

      usedStorageMB += fileSizeMB;
      if (userId) {
        await this.userService.updateUsedStorage(userId, fileSizeMB);
      }

      const fileUrl = userId
        ? `/uploads/${subfolder}/${userId}/${file.filename}`
        : `/uploads/${subfolder}/${file.filename}`;

      const fileRecord = {
        url: fileUrl,
        filename: file.filename,
        originalName: file.originalname,
        size: fileSizeMB,
        mimetype: file.mimetype,
        userId: userId,
        category: subfolder === 'vds' ? 'video' : 'other',
      };

      await this.fileManagerService.recordFileUpload(fileRecord);

      results.push(fileRecord);
    }

    return results;
  }
}
