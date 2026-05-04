import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

import { activationTemplate } from './templates/activation.template';
import { accountActivatedTemplate } from './templates/account-activated.template';
import { permissionExtendedTemplate } from './templates/permission-extended.template';

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

  async sendAccountActivatedEmail(email: string, name: string) {
    const loginUrl =
      this.configService.get<string>('FRONTEND_URL') ||
      'https://app.binex.com/login';
    const mailOptions = {
      from: `"Binex System" <${this.configService.get<string>('SMTP_USER')}>`,
      to: email,
      subject: 'Tài khoản Binex của bạn đã được kích hoạt',
      html: accountActivatedTemplate(name, loginUrl),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Account activation email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send activation email to ${email}: ${error.message}`,
      );
    }
  }

  async sendPermissionExtendedEmail(
    email: string,
    name: string,
    expiredAt: Date,
  ) {
    const expiredAtStr = expiredAt.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const mailOptions = {
      from: `"Binex System" <${this.configService.get<string>('SMTP_USER')}>`,
      to: email,
      subject: 'Dịch vụ Binex của bạn đã được gia hạn',
      html: permissionExtendedTemplate(name, expiredAtStr),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Permission extension email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send extension email to ${email}: ${error.message}`,
      );
    }
  }
}
