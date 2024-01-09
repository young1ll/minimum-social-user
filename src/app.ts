import e from 'express';
import { signUpRouter } from './routes';

// intializing
const app = e();

app.use(e.json());

// routes
app.use(signUpRouter);

export default app;
