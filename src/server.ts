import config, { DBConfig } from '@/config';
import app from './app';

async function startServer() {
  app.listen(config.port, () => {
    console.info(
      `[SERVER] ${config.env} | [PORT] ${config.port} | [DATABASE] MONGO:${
        config.database.mongo || 'NONE'
      } | MYSQL: ${config.database.mysql || 'NONE'}`,
    );
  });
}

startServer();

DBConfig.connectWith(config.env as string);
