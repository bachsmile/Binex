import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { FileManagerService } from './file-manager.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('file-manager')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('file-manager')
export class FileManagerController {
  constructor(private readonly fileManagerService: FileManagerService) {}

  @Get('my-files')
  @ApiOperation({ summary: 'Lấy danh sách tệp của tôi' })
  async getMyFiles(@CurrentUser() user: any) {
    return await this.fileManagerService.getUserFiles(user.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Xem thống kê dung lượng' })
  async getStats(@CurrentUser() user: any) {
    return await this.fileManagerService.getStorageStats(user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa tệp' })
  async deleteFile(@Param('id') id: string, @CurrentUser() user: any) {
    return await this.fileManagerService.deleteFile(id, user.id);
  }
}
