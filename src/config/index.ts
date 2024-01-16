import dotenv from 'dotenv';
import { default as MailerConfig } from './mailer';
import { default as DBConfig } from './database';

const envFound = dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

if (envFound.error) {
  throw new Error("❌  Couldn't find .env file  ❌");
}

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,

  ...MailerConfig,
  ...DBConfig,
};

export { DBConfig, MailerConfig };
