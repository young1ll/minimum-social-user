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

/**
 * @swagger
 * /user:
 *   post:
 *     tags: [User]
 *     summary: 새로운 사용자 생성(회원가입)
 *     description: minimum-social의 회원가입은 **AWS Cognito**에 의존합니다. post `/user` 엔드포인트로 새로운 사용자를 생성할 수 있지만, Cognito Userpool에 등록되어 있지 않으면 로그인할 수 없습니다.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: Create Topic
 *         schema:
 *           $ref: '#/definitions/CreateUserBodyParams'
 *     responses:
 *       201:
 *         description: Created
 *         schema:
 *           $ref: '#/definitions/UserResponse'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
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

/**
 * @swagger
 * /user:
 *   get:
 *     tags: [User]
 *     summary: 단일 사용자정보 가져오기
 *     parameters:
 *       - in: query
 *         name: id
 *         description: 사용자 ID
 *         schema:
 *           type: string
 *       - in: query
 *         name: username
 *         description: 사용자 Username
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Successful response
 *         schema:
 *           $ref: '#/definitions/UserResponse'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
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

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [User]
 *     summary: 모든 사용자 조회
 *     responses:
 *       201:
 *         description: Successful response
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/UserResponse'
 *       201-empty:
 *         description: No users in the database
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             data:
 *               type: array
 *       500:
 *         description: Internal Server Error
 */
router.get('/users', async (req: Request, res: Response, next: NextFunction) => {
    // TODO: pagenation
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

/**
 * @swagger
 * /users/count:
 *   get:
 *     tags: [User]
 *     summary: 모든 사용자의 수
 *     responses:
 *       200:
 *         description: Successful response
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               type: integer
 *               example: 10  // 실제 데이터에 따라 변경
 *       500:
 *         description: Internal Server Error
 */
router.get('/users/count', async (req: Request, res: Response, next: NextFunction) => {
    // TODO: 쿼리로 필터링 추가
    // darkmode가 true인 사용자의 수...
    // locale가 en인 사용자의 수...
    // expired가 true인 사용자의 수...
    try {
        const data = await userService.countUser();

        return res.status(201).json({ data });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /users/{query}:
 *   get:
 *     tags: [User]
 *     summary: Username으로 사용자 검색
 *     parameters:
 *       - in: path
 *         name: query
 *         description: Username to search for
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/UserResponse'
 *       500:
 *         description: Internal Server Error
 */
router.get('/users/:query', async (req: Request, res: Response, next: NextFunction) => {
    // TODO: pagenation
    try {
        const data = await userService.searchUserByUsername(req.params.query);

        return res.status(201).json({ data });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /user/{userId}:
 *   put:
 *     tags: [User]
 *     summary: 사용자 정보 업데이트
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: 수정 할 사용자의 ID
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/UpdateUserBody'
 *     responses:
 *       201:
 *         description: Successful response
 *         schema:
 *           $ref: '#/definitions/UserResponse'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
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

/**
 * @swagger
 * /user/{userId}:
 *   delete:
 *     tags: [User]
 *     summary: 단일 사용자 삭제
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: 삭제할 사용자의 ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: User deleted successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: User deleted
 *             data:
 *               $ref: '#/definitions/UserResponse'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
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
