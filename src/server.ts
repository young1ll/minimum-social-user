import config from '@/config';
import app from './app';

async function startServer() {
  console.log(config.env);
  console.log(config.test);

  app.listen(config.port, () => {
    console.log(`server is running on port ${config.port}`);
  });
}

startServer();
