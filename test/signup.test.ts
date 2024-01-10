import request from 'supertest';
import { UserService } from '@/services';
import app from '@/app';
import { SIGNUP_ROUTE } from '@/routes/signup';
import { User } from '@/models';

// TODO: CASE를 더 세분화
describe(`SignUpController/ ${SIGNUP_ROUTE}`, () => {
  // MongoMemoryServer 설정: ./utils/test-env.ts, jest.config.ts-"setupFilesAfterEnv"

  const INVALID_USERNAME = 'invalidUsername'; // 사용자 이름 형식 오류(현재 적용 안됨)
  const INVALID_EMAIL = 'invalid_email'; // 이메일 형식 오류
  const INVALID_PASSWORD = 'invalidpassword'; // 모두 소문자

  const VALID_USERNAME = 'validUsername';
  const VALID_EMAIL = 'valid@email.com';
  const VALID_PASSWORD = 'validP@ssw0rd';

  it('should return 422 if request body has validation errors', async () => {
    // CASE: 유효성 검사 실패
    const invalidUser = {
      username: INVALID_USERNAME,
      email: INVALID_EMAIL,
      password: INVALID_PASSWORD,
    };
    await request(app).post(SIGNUP_ROUTE).send(invalidUser).expect(422);
  });

  it('should return 422 if email format is incorrect', async () => {
    // CASE: 이메일 형식 오류
    const invalidUser = {
      username: VALID_USERNAME,
      email: INVALID_EMAIL,
      password: VALID_PASSWORD,
    };

    await request(app).post(SIGNUP_ROUTE).send(invalidUser).expect(422);
  });

  it('should return 422 if password contains forbidden characters', async () => {
    // 비밀번호 형식 오류
    const invalidUser = {
      username: VALID_USERNAME,
      email: VALID_EMAIL,
      password: INVALID_PASSWORD,
    };

    await request(app).post(SIGNUP_ROUTE).send(invalidUser).expect(422);
  });

  describe('UserService/', () => {
    // 회원가입 도중 오류
    it('should return 500 while signing up a new user', async () => {
      // 새로운 사용자 회원가입 오류
    });

    it('should hash password before saving', async () => {
      // 사용자 회원가입 비밀번호 암호화
      const validUser = {
        username: VALID_USERNAME,
        email: VALID_EMAIL,
        password: VALID_PASSWORD,
      };

      const response = await request(app)
        .post(SIGNUP_ROUTE)
        .send(validUser)
        .expect(201);

      const newUser = await User.findOne({ email: response.body.email });
      const newUserPassword = newUser?.password;

      // expect(newUserPassword).toBeGreaterThan(0);
      expect(newUserPassword).not.toEqual(validUser.password);
    });

    it('should successfully sign up a new user', async () => {
      // 새로운 사용자 회원가입 성공
      const validUser = {
        username: VALID_USERNAME,
        email: VALID_EMAIL,
        password: VALID_PASSWORD,
      };

      const response = await request(app)
        .post(SIGNUP_ROUTE)
        .send(validUser)
        .expect(201);
      expect(response).not.toBeNull();
    });
  });
});
