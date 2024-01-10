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
// app.use(e.urlencoded({ extended: true })); // content-type - application/x-www-form-urlencoded

// routes
app.use(router);

// app.get('/', (req, res, next) => {
//   const user = 1;
//   try {
//     if (!user) {
//       return res.send({ message: 'minimum-socials auth-server is running' });
//     }
//     throw new Error('Not Found');
//   } catch (error) {
//     return next();
//   }
// });
// Error Handler
app.use(errorHandler);

export default app;
