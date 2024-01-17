import dotenv from 'dotenv';
import { default as awsConfig } from './aws';

const envFound = dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

if (envFound.error) {
  throw new Error("❌  Couldn't find .env file  ❌");
}

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,

  adminEmail: process.env.ADMIN_EMAIL,

  nm_service: process.env.MAILER_SERVICE,
  nm_user: process.env.MAILER_USER,
  nm_pass: process.env.MAILER_PASS,

  ...awsConfig,
};

export { awsConfig };
