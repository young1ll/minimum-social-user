import e from 'express';
import request from 'supertest';
import userRoutes, { userService } from '../user.routes';
import { faker } from '@faker-js/faker';
import { userFactory } from '../../utils/fixtures';

const app = e();
app.use(e.json());
app.use(e.urlencoded({ extended: true }));
app.use(userRoutes);

const mockUser = (data: any) => {
    const { id, username, email } = data;
    return {
        id: id || faker.string.uuid(),
        username: username || faker.internet.userName(),
        email: email || faker.internet.email(),
        ...data,
    };
};

describe('User Routes', () => {
    it('should create a new user', async () => {
        const requestBody = mockUser({});
        const user = userFactory.build();

        jest.spyOn(userService, 'createUser').mockImplementationOnce(() => Promise.resolve(user));

        const response = await request(app)
            .post('/user')
            .send(requestBody)
            .set('Accept', 'application/json');

        expect(response.status).toBe(201);
        expect(response.body).toEqual(user);
    });

    it('should response with validation error 400', async () => {
        const requestBody = mockUser({});
        const user = userFactory.build();

        jest.spyOn(userService, 'createUser').mockImplementationOnce(() => Promise.resolve(user));

        const response = await request(app)
            .post('/user')
            .send({ ...requestBody, username: 123 })
            .set('Accept', 'application/json');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ errors: 'username must be a string' });
    });

    it('should response with internal error 500', async () => {
        const requestBody = mockUser({});
        jest.spyOn(userService, 'createUser').mockImplementationOnce(() =>
            Promise.reject(new Error('Internal Error on create user'))
        );

        const response = await request(app)
            .post('/user')
            .send(requestBody)
            .set('Accept', 'application/json');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ errors: 'Internal Error on create user' });
    });
});
