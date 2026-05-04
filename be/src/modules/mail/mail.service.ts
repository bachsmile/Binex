import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

import { activationTemplate } from './templates/activation.template';

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
      html: activationTemplate(packageName, email, key),
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
