import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiOperation, ApiTags, ApiProperty } from '@nestjs/swagger';
import { activationTemplate } from './templates/activation.template';

class SendTestMailDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Địa chỉ email người nhận',
  })
  mailto: string;

  @ApiProperty({
    example: 'Gói Cơ Bản',
    description: 'Tên gói dịch vụ (tùy chọn)',
    required: false,
  })
  packageName?: string;

  @ApiProperty({
    example: 'TEST-KEY-123',
    description: 'Mã kích hoạt (tùy chọn)',
    required: false,
  })
  key?: string;
}

@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('test')
  @ApiOperation({ summary: 'Gửi email thử nghiệm sử dụng template kích hoạt' })
  async sendTestMail(@Body() body: SendTestMailDto) {
    const { mailto, key } = body;

    if (!mailto) {
      throw new BadRequestException(
        'Vui lòng cung cấp địa chỉ email người nhận (mailto)',
      );
    }

    const testPackageName = 'Mã kích hoạt dịch vụ';
    const testKey = key || 'ABCD-EFGH-IJKL-MNOP';

    await this.mailService.sendMail(
      mailto,
      'Kiểm tra hệ thống Email Binex - Template Kích Hoạt',
      activationTemplate(testPackageName, mailto, testKey),
    );

    return {
      message: `Đã gửi email thử nghiệm đến ${mailto} sử dụng template kích hoạt`,
      data: {
        packageName: testPackageName,
        key: testKey,
      },
    };
  }
}
