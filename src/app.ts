import e from 'express';
import 'express-async-errors';
import cors from 'cors';
import { errorHandler } from '@/middleware';
import router from '@/routes';

// intializing
const app = e();

const corsOption = {
  origin: '*',
};

app.use(cors(corsOption));

app.use(e.json());
app.use(e.urlencoded({ extended: true })); // content-type - application/x-www-form-urlencoded

app.get('/', async (req, res, next) => {
  return res.send({
    message: 'minimum-socials auth-server is running well',
  });
});
// routes
app.use(router);

// Error Handler
app.use(errorHandler);

export default app;
