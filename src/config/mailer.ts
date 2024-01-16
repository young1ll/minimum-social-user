export default {
  adminEmail: process.env.ADMIN_EMAIL, // sender
  testEmail: process.env.TEST_EMAIL, // verified acceptable email

  // mailgun / expired
  mg_apiKey: process.env.MAILGUN_API_PRIVATE,
  mg_domain: process.env.MAILGUN_DOMAIN,

  // nodemailer
  nm_service: process.env.MAILER_SERVICE,
  nm_user: process.env.MAILER_USER,
  nm_pass: process.env.MAILER_PASS,
  nm_from: process.env.MAILER_FROM,
};
