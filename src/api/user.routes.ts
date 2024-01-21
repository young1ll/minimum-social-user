import e, { NextFunction, Request, Response } from 'express';
import { UserService } from '@/services/user.service';
import { UserRepository } from '@/repository/user.repo';
import { RequestValidator } from '@/utils/request-validator';
import {
    CreateUserRequest,
    ReadUserRequest,
    UpdateUserQuery,
    UpdateUserBody,
} from '@/dto/user.dto';

const router = e.Router();
export const userService = new UserService(new UserRepository());

// POST /user - Create a User
router.post('/user', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { errors, input } = await RequestValidator(CreateUserRequest, req.body);
        if (errors) return res.status(400).json({ errors });

        // console.log(input);
        // const data = input;
        const data = await userService.createUser({
            id: input.id,
            email: input.email,
        });

        return res.status(201).json({ data });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

// GET /user ?id={id} | ?username={username} - Get a User by Id or Username
// id 또는 username 하나만 사용가능
router.get('/user', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { errors, input } = await RequestValidator(ReadUserRequest, {
            id: req.query.id || null,
            username: req.query.username || null,
        });
        if (errors) return res.status(400).json({ errors });

        const { id, username } = input;
        if (!id && !username) {
            return res.status(400).json({
                message: 'At least one of id or username is required',
                data: {},
            });
        }
        if (id && username) {
            return res.status(400).json({
                message: 'Only one of id or username is allowed',
                data: {},
            });
        }

        let data;

        if (id) {
            data = await userService.findOneUserById(input.id);

            if (!data) {
                return res.status(201).json({ message: 'User not found', data: {} });
            }
        } else {
            data = await userService.findOneUserByUsername(input.username);
            if (!data) {
                return res.status(201).json({ message: 'User not found', data: {} });
            }
        }
        return res.status(201).json({ data });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

// GET /user - Get all Users
// TODO: pagenation
router.get('/users', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await userService.findAllUser();
        if (data?.length === 0) {
            return res
                .status(201)
                .json({ message: 'Any User is not in the database yet.', data: {} });
        }

        return res.status(201).json({ data });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

// GET /users/count - Get all Users: COUNT
router.get('/users/count', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await userService.countUser();

        return res.status(201).json({ data });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

// GET /users/{username} - Get a User by Username: SEARCH
// TODO: pagenation
router.get('/users/:query', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await userService.searchUserByUsername(req.params.query);

        return res.status(201).json({ data });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

// PUT /user - Update a User by Id
router.put('/user/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { errors: queryErrors, input: queryInput } = await RequestValidator(UpdateUserQuery, {
            id: req.params.userId,
        });
        if (queryErrors) return res.status(400).json({ errors: queryErrors });
        const { errors: bodyErrors, input: bodyInput } = await RequestValidator(
            UpdateUserBody,
            req.body
        );
        if (bodyErrors) return res.status(400).json({ errors: bodyErrors });

        const data = await userService.updateUser({ id: queryInput.id, body: bodyInput });

        return res.status(201).json({ data });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

// PUT /user - Update a User by Id
router.delete('/user/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { errors, input } = await RequestValidator(UpdateUserQuery, {
            id: req.params.userId,
        });
        if (errors) return res.status(400).json({ errors: errors });

        const data = await userService.deleteUser(input.id);

        return res.status(201).json({ message: 'User deleted', data });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

export default router;
