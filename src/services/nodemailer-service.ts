import config from '@/config';
import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer';
import SendmailTransport from 'nodemailer/lib/sendmail-transport';
/**
 * - nodemailer 라이브러리 필요
 * - mailgun 서비스 무료지원 한도에 대해 추가 지원이 필요할 경우 사용
 * node 예제: https://forwardemail.net/ko/blog/docs/how-to-javascript-contact-forms-node-js
 */
export default class NodeMailerService {
  private mailer = nodemailer;

  private transport;

  constructor() {
    this.transport = this.mailer.createTransport({
      service: config.nm_service!,
      auth: {
        user: config.nm_user!,
        pass: config.nm_pass!,
      },
    });
  }

  async sendEmail({
    toEmail,
    subject,
    html,
  }: {
    toEmail: string;
    subject: string;
    html: string;
  }) {
    this.transport.sendMail({
      to: toEmail,
      from: config.adminEmail,
      subject,
      html,
    });
  }
}
