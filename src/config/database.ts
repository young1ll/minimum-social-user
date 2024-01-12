import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mysqlInstance;
let mongoInstance: MongoMemoryServer;

export const DB = {
  mongourl: '',

  connectWith: async (env: string) => {
    if (!(env === 'production' || env === 'test' || env === 'development')) {
      throw new Error('Invalid env');
    }

    if (env === 'production') {
      // TODO: 실제 MongoDB 연결 설정
      // mongoInstance = new MongoClient('<production_uri>', { useNewUrlParser: true, useUnifiedTopology: true });
    } else {
      // 테스트 및 개발 환경에서는 MongoMemoryServer 사용
      mongoInstance = await MongoMemoryServer.create();
      DB.mongourl = mongoInstance.getUri();
    }

    mongoose
      .connect(DB.mongourl)
      .then(() => {
        console.log('MongoDB Connected');
      })
      .catch((err) => {
        console.error(err);
      });
  },

  disconnect: async () => {
    if (mongoInstance) {
      await mongoose.disconnect();
      await mongoInstance.stop();
      console.log('MongoDB Disconnected');
    }
  },
};
