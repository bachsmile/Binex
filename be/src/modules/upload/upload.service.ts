import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  handleFileUpload(file: Express.Multer.File) {
    if (!file) {
      throw new Error('File is required');
    }

    // Trả về đường dẫn để frontend có thể truy cập
    // Ví dụ: http://localhost:3000/uploads/filename.jpg
    const fileUrl = `/uploads/${file.filename}`;
    return {
      url: fileUrl,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
