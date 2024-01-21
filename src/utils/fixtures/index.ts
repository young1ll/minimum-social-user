import { Factory } from 'rosie';
import { User } from '../../models/user.model';
import { faker } from '@faker-js/faker';

export const userFactory = new Factory<User>()
    .attr('id', faker.string.uuid())
    .attr('username', faker.internet.userName())
    .attr('email', faker.internet.email());
