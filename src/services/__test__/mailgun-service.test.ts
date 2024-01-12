import config from '@/config';
import MailgunService from '@/services/mailgun-service';

describe('MailgunService/', () => {
  const mailgunService = new MailgunService({
    apiKey: config.mailer.mg_apiKey!,
  });
  it('constructor/ should construct MailgunService correctly', () => {
    // console.log(mailgunService);
    expect(mailgunService).toBeDefined();
  });

  it('sendMailFromAdmin/ should send an email successfully', async () => {
    const data = {
      domain: config.mailer.mg_domain!,
      fromEmail: 'sender@example.com',
      toEmail: 'creativehorn@naver.com',
      subject: 'Test Email',
      message: 'This is a Mailgun test message.',
    };
    const response = await mailgunService.sendMailFromAdmin(data);

    console.log(`mailgun response: ${JSON.stringify(response)}`);
  });
});
