import e from 'express';
import swaggerUi from 'swagger-ui-express';
import { specs } from './swagger.options';

import userRouter from './api/user.routes';
import db from './models';

const { sequelize } = db;

const app = e();
app.use(e.json());
app.use(e.urlencoded({ extended: true }));

app.use('/', userRouter);

// Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

sequelize.sync({}).then(() => {
    console.log('Database synced');
});

export default app;
