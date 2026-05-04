import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendActivationKey(email: string, key: string, packageName: string) {
    const mailOptions = {
      from: `"Binex System" <${this.configService.get<string>('SMTP_USER')}>`,
      to: email,
      subject: 'Mã kích hoạt gói dịch vụ Binex',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #4CAF50; text-align: center;">Kích hoạt tài khoản Admin</h2>
          <p>Chào bạn,</p>
          <p>Cảm ơn bạn đã đăng ký gói dịch vụ <strong>${packageName}</strong> trên hệ thống Binex.</p>
          <p>Dưới đây là mã kích hoạt của bạn:</p>
          <div style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border: 1px dashed #4CAF50; color: #333; margin: 20px 0;">
            ${key}
          </div>
          <p>Vui lòng nhập mã này trong ứng dụng để kích hoạt quyền hạn của gói dịch vụ.</p>
          <p>Mã này có hiệu lực cho đến khi được sử dụng.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #777; text-align: center;">Đây là email tự động, vui lòng không trả lời.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Activation email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}: ${error.message}`);
      throw new Error('Không thể gửi email kích hoạt. Vui lòng thử lại sau.');
    }
  }

  /**
   * Hàm gửi mail chung cho các mục đích khác
   */
  async sendMail(to: string, subject: string, html: string) {
    const mailOptions = {
      from: `"Binex System" <${this.configService.get<string>('SMTP_USER')}>`,
      to,
      subject,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
      throw new Error('Không thể gửi email. Vui lòng thử lại sau.');
    }
  }
}
