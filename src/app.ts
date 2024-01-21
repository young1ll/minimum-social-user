import e from 'express';
import userRouter from './api/user.routes';

const app = e();
app.use(e.json());
app.use(e.urlencoded({ extended: true }));

app.use('/', userRouter);

export default app;
