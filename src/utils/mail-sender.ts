import config from '@/config';
import nodemailer from 'nodemailer';

type MailSenderType = {
  email: string;
  title: string;
  body: string;
};

const mailSender = async ({ email, title, body }: MailSenderType) => {
  try {
    // Transporter 생성 let vs const
    const transporter = nodemailer.createTransport({
      host: config.mailer.host,
      auth: {
        user: config.mailer.user,
        pass: config.mailer.pass,
      },
    });

    // 전송 let vs const
    const info = await transporter.sendMail({
      from: config.mailer.from,
      to: email,
      subject: title,
      html: body,
    });
    console.log('Email info: ', info);
    return info;
  } catch (err) {
    console.error('Error sending email:', err);
    throw new Error('Failed to send email');
  }
};

export default mailSender;
