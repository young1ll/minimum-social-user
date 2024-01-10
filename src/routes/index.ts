import { Router } from 'express';
import SignUpRouter from './signup';

const router = Router();

router.use(SignUpRouter);

export default router;
