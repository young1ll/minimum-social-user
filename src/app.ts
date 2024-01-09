import express from 'express';
import { signUpRouter } from './routes';

// intializing
const app = express();

app.use(express.json());

// routes
app.use(signUpRouter);

export default app;
