import request from 'supertest';
import app from '@/app';

import { SIGNUP_ROUTE } from '@/routes';

/**
 * Available HTTP methods of Signup route
 * - POST only
 */
describe('Test Signup route availability', () => {
  let email: string;
  let password: string;
  beforeAll(async () => {
    email = 'valid@email.com';
    password = 'validPassw0rd';
  });

  it('Return 405 for signup non-POST(GET, PUT, PATCH, DELETE) requests', async () => {
    await request(app).get(SIGNUP_ROUTE).expect(405);
    await request(app).put(SIGNUP_ROUTE).expect(405);
    await request(app).patch(SIGNUP_ROUTE).expect(405);
    await request(app).delete(SIGNUP_ROUTE).expect(405);
  });

  it('Return 200 for signup POST, OPTIONS requests', async () => {
    await request(app).post(SIGNUP_ROUTE).send({ email, password }).expect(200);
    await request(app)
      .options(SIGNUP_ROUTE)
      .send({ email, password })
      .expect(200);
  });

  it('Return POST only allowed methods from an OPTIONS request', async () => {
    const response = await request(app)
      .options(SIGNUP_ROUTE)
      .send({ email, password })
      .expect(200);

    expect(response.headers['access-control-allow-methods']).toBe('POST');
  });
});

/**
 * Valid Email conditions:
 *
 * - Standard Email format from 'express-validator' pkg
 * 422: Unprocessable Entity
 */
describe('Test Validity of Email', () => {
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
 *
 * - At least 6 characters
 * - At most 32 characters
 * - Must contain at least one uppercase letter
 * - Must contain at least one lowercase letter
 * - Must contain at least one number
 */
describe('Test Validity of Password', () => {
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
