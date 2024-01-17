import config from '@/config';
import app from './app';

async function startServer() {
  app.listen(config.port, () => {
    console.info(`[SERVER] ${config.env} | [PORT] ${config.port}`);
  });
}

startServer();

// DBConfig.connectWith(config.env as string);
