import config, { DB } from '@/config';
import app from './app';

async function startServer() {
  app.listen(config.port, () => {
    console.log(
      `[SERVER] ${config.env} | [PORT] ${config.port} | [DATABASE] MONGO:${
        config.database.mongo || 'NONE'
      } | MYSQL: ${config.database.mysql || 'NONE'}`,
    );
  });
}

startServer();

DB.connectWith(config.env as string);
