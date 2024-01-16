import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoInstance: MongoMemoryServer;

const DB = {
  mongourl: process.env.MONGO_DATABASE_URL!,

  connectWith: async (env: string) => {
    if (!(env === 'production' || env === 'test' || env === 'development')) {
      throw new Error('Invalid env');
    }

    if (env === 'production') {
      // TODO: 실제 MongoDB 연결 설정
      // mongoInstance = new MongoClient('<production_uri>', { useNewUrlParser: true, useUnifiedTopology: true });
    } else if (env === 'development') {
      //
    } else if (env === 'test') {
      // 테스트 환경: MongoMemoryServer
      mongoInstance = await MongoMemoryServer.create();
      DB.mongourl = mongoInstance.getUri();
    }

    mongoose
      .connect(DB.mongourl)
      .then(() => {
        console.info('MongoDB Connected');
      })
      .catch((err) => {
        console.error(err);
      });
  },

  disconnect: async () => {
    if (mongoInstance) {
      await mongoose.disconnect();
      await mongoInstance.stop();
      console.info('MongoDB Disconnected');
    }
  },
};

export default DB;
