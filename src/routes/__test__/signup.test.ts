import request from 'supertest';
import app from '@/app';

// it('Return 405 for non-post request to signup', async () => {
//   await request(app).get('/').expect(200);
// });

// 422: Unprocessable Entity
it('Return 422 if the email is not valid', async () => {
  await request(app)
    .post('/api/auth/signup') // prettier-ignore
    .send({})
    .expect(422);

  await request(app)
    .post('/api/auth/signup')
    .send({ email: 'invalid email' })
    .expect(422);

  await request(app)
    .post('/api/auth/signup')
    .send({ password: 'invalid email' })
    .expect(422);
});
