import dotenv from 'dotenv';

const envFound = dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

if (envFound.error) {
  throw new Error("❌  Couldn't find .env file  ❌");
}

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  database: {
    mongo: process.env.MONGO_DATABASE_URL,
    mysql: process.env.MYSQL_DATABASE_URL,
  },

  mailer: {
    adminEmail: process.env.ADMIN_EMAIL,
    testEmail: process.env.TEST_EMAIL, // !verified email

    mg_apiKey: process.env.MAILGUN_API_PRIVATE,
    mg_domain: process.env.MAILGUN_DOMAIN,

    nm_service: process.env.MAILER_SERVICE,
    nm_user: process.env.MAILER_USER,
    nm_pass: process.env.MAILER_PASS,
    nm_from: process.env.MAILER_FROM,
  },
};

export { DB } from './database';
