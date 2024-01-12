import app from '@/app';
import config from '@/config';
import { OTP_ROUTE } from '@/routes/otp';
import { SIGNUP_ROUTE } from '@/routes/signup';
import supertest from 'supertest';

describe('SignUpController', () => {
  describe(`POST ${SIGNUP_ROUTE} validation failures`, () => {
    /**
     * 회원가입 사용자 입력 유효성 검사:
     *
     * - Username:
     *   - Must not be empty
     *   - Must be between 3 and 32 characters
     *   - Can only contain letters, numbers, underscores, dots, and hyphens
     *
     * - Email:
     *   - Must be in a valid email format
     *   - Must normalize the email (sanitize)
     *
     * - Password:
     *   - Must be between 6 and 32 characters
     *   - Must contain at least one lowercase letter
     *   - Must contain at least one uppercase letter
     *   - Must contain at least one number
     *   - Must not contain spaces and special characters [><"'']
     */
    it('should return 422 when validation fails(invalid email)', async () => {
      const response = await supertest(app).post(SIGNUP_ROUTE).send({
        username: 'username',
        email: 'testEmail', // invalid email format
        password: 'testPassword@123',
      });
      expect(response.status).toBe(422);
    });

    it('should return 422 when validation fails(invalid password)', async () => {
      const response = await supertest(app).post(SIGNUP_ROUTE).send({
        username: 'username',
        email: config.mailer.testEmail!,
        password: 'testPassword', // invalid
      });

      expect(response.status).toBe(422);
    });

    it('should return 422 when validation fails(invalid username)', async () => {
      const response = await supertest(app).post(SIGNUP_ROUTE).send({
        username: '', // invalid
        email: config.mailer.testEmail!,
        password: 'testPassword@123',
      });
      expect(response.status).toBe(422);
    });
  });

  describe(`POST ${SIGNUP_ROUTE} validation succeess`, () => {
    it('should return 201 and hash password before saving', async () => {
      const response = await supertest(app).post(SIGNUP_ROUTE).send({
        username: 'username',
        email: config.mailer.testEmail!,
        password: 'testPassword@123',
      });
      expect(response.status).toBe(201);
      expect(response.body.password).not.toBe('testPassword@123');
    });

    it('should return 201 when signup completes', async () => {
      const response = await supertest(app).post(SIGNUP_ROUTE).send({
        username: 'username',
        email: config.mailer.testEmail!,
        password: 'testPassword@123',
      });
      expect(response.status).toBe(201);
    });

    it('should return 201 when signup completes and verified true', async () => {
      const response = await supertest(app).post(SIGNUP_ROUTE).send({
        username: 'username',
        email: config.mailer.testEmail!,
        password: 'testPassword@123',
      });

      const verifyResponse = await supertest(app).post(OTP_ROUTE).send({
        email: config.mailer.testEmail!,
        otp: response.body.otp,
      });

      // console.log(response.body.otp);
      // console.log(verifyResponse.body.otp);
      expect(response.body.otp === verifyResponse.body.otp).toBe(true);
      expect(response.status).toBe(201);
    });
  });
});
