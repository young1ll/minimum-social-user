import e from 'express';
import request from 'supertest';
import userRoutes, { userService } from '../user.routes';
import { faker } from '@faker-js/faker';

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
        // const requestBody = mockUser({});
        // const user = userFactory.build();
        // jest.spyOn(userService, 'createUser').mockImplementationOnce(() => Promise.resolve(user));
        // const response = await request(app)
        //     .post('/user')
        //     .send(requestBody)
        //     .set('Accept', 'application/json');
        // expect(response.status).toBe(201);
        // expect(response.body).toEqual(user);
    });
});
