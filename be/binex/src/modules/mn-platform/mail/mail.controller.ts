import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { MailService } from './mail.service';
import {
  ApiOperation,
  ApiTags,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { activationTemplate } from './templates/activation.template';
import { SubscribeMailDto } from './dto/subscribe-mail.dto';
import { SendTestMailDto } from './dto/send-test-mail.dto';
import { MailSubscription } from './entities/mail-subscription.entity';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('subscribe')
  @ApiOperation({ summary: 'Đăng ký nhận tin từ hệ thống' })
  @ApiResponse({ status: 201, type: MailSubscription })
  async subscribe(@Body() body: SubscribeMailDto) {
    return await this.mailService.subscribe(body.email);
  }

  @Post('test')
  // ... (rest of controller)
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
