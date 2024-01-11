import dotenv from 'dotenv';

const envFound = dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

if (envFound.error) {
  throw new Error("❌  Couldn't find .env file  ❌");
}

export default {
  env: process.env.NODE_ENV,
  test: process.env.MAILER_API_PUBLIC,
  port: process.env.PORT || 3000,
  databaseURL: process.env.DATABASE_URL,
  mailgun: {
    adminEmail: process.env.ADMIN_EMAIL,
    apiKey: process.env.MAILGUN_API_PRIVATE,
    domain: process.env.MAILGUN_DOMAIN,
  },
  mailer: {
    host: process.env.MAILER_HOST,
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PORT,
    from: process.env.MAILER_FROM,
  },
};
