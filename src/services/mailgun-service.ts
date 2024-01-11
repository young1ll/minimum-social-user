import config from '@/config';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

export type MailgunMessageData = {
  domain: string;
  fromEmail?: string;
  toEmail: string;
  subject: string;
  message: string;
};

export default class MailgunService {
  private mailgun;

  private mg;

  constructor({
    apiKey,
    username,
    mailgun,
  }: {
    apiKey: string;
    username?: string;
    mailgun?: Mailgun;
  }) {
    this.mailgun = mailgun || new Mailgun(formData);
    this.mg = this.mailgun.client({
      username: username || 'api',
      key: apiKey,
    });
  }

  async sendMailFromAdmin({
    domain,
    toEmail,
    subject,
    message,
  }: MailgunMessageData) {
    try {
      return this.mg.messages.create(domain, {
        from: config.mailgun.adminEmail,
        to: [toEmail],
        subject,
        text: message,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}
