import { Router } from 'express';
import UserRouter from './users';

const router = Router();

router.use(UserRouter);

export default router;
