import request from 'supertest';
import app from '@/app';

import { SIGNUP_ROUTE } from '@/routes';
import { User } from '@/models';

/**
 * Valid Email conditions:
 * - Standard Email format from 'express-validator' pkg
 */
describe('[Test] 이메일 유효성 검사', () => {
  let password: string;
  beforeAll(async () => {
    password = 'validPassw0rd';
  });

  it('Return 422 if the email is not provided', async () => {
    await request(app).post(SIGNUP_ROUTE).send({ password }).expect(422);
  });

  it('Return 422 if the email is not valid', async () => {
    await request(app)
      .post(SIGNUP_ROUTE)
      .send({ email: 'Invalid email', password })
      .expect(422);
  });

  it('Return 200 if the email is valid', async () => {
    await request(app)
      .post(SIGNUP_ROUTE)
      .send({ email: 'valid@email.com', password })
      .expect(200);
  });
});

/**
 * Valid Password conditions:
 * - At least 6 characters
 * - At most 32 characters
 * - Must contain at least one uppercase letter
 * - Must contain at least one lowercase letter
 * - Must contain at least one number
 */
describe('[Test] 비밀번호 유효성 검사', () => {
  let email: string;
  beforeAll(async () => {
    email = 'valid@email.com';
  });

  it('Return 422 if the password is not provided', async () => {
    await request(app).post(SIGNUP_ROUTE).send({ email }).expect(422);
  });
  it('Return 422 if the password contains less than 6 characters', async () => {
    await request(app)
      .post(SIGNUP_ROUTE)
      .send({ email, password: 'vaLid' })
      .expect(422);
  });
  it('Return 422 if the password contains more than 32 characters', async () => {
    await request(app)
      .post(SIGNUP_ROUTE)
      .send({ email, password: 'vaLi5_Pas10_0rd15_ida20_dfi25_dfa30_asd35' })
      .expect(422);
  });
  it('Return 422 if the password does not contains any uppercase', async () => {
    await request(app)
      .post(SIGNUP_ROUTE)
      .send({ email, password: 'valid2' })
      .expect(422);
  });
  it('Return 422 if the password does not contains any lowercase', async () => {
    await request(app)
      .post(SIGNUP_ROUTE)
      .send({ email, password: 'VALID2' })
      .expect(422);
  });
  it('Return 422 if the password does not contains any number', async () => {
    await request(app)
      .post(SIGNUP_ROUTE)
      .send({ email, password: 'vaLiiD' })
      .expect(422);
  });

  it('Return 200 if the password is valid', async () => {
    await request(app)
      .post(SIGNUP_ROUTE)
      .send({ email, password: 'vaLid2' })
      .expect(200);
  });
});

describe('[Test] 이메일 정규화(Sanitization)', () => {
  const normalizeEmail = 'test@test.com';

  it('Return 200 if the email is sanitized', async () => {
    const response = await request(app)
      .post(SIGNUP_ROUTE)
      .send({
        email: 'test@TEST.COM',
        password: 'validPassw0rd',
      })
      .expect(200);

    expect(response.body.email).toEqual(normalizeEmail);
  });
});

describe('[Test] 비밀번호 정규화(Sanitization)', () => {
  const normalizedPassword = 'validP@ssw0rd';

  it('Return 200 if the password is sanitized', async () => {
    // await request(app)
    //   .post(SIGNUP_ROUTE)
    //   .send({
    //     email: '2vqz0@example.com',
    //     password: normalizedPassword,
    //   })
    //   .expect(200);
  });
});

/**
 * Save User:
 */
describe('[Test] 회원가입 사용자 DB 저장', () => {
  const userInfo = {
    email: 'test@test.com',
    password: 'validP@ssw0rd',
  };

  // 회원 가입을 시도한 사용자가 DB에 있는지 검사
  it('Return 200 if the user is saved successfully', async () => {
    const response = await request(app)
      .post(SIGNUP_ROUTE)
      .send(userInfo)
      .expect(200);

    const user = await User.findOne({ email: response.body.email });
    const userEmail = user ? user.email : null;

    expect(user).toBeDefined();
    expect(userEmail).toEqual(userInfo.email);
  });

  // 이미 존재하는 회원
  it('Return 400 if the user already exists', async () => {});
});
