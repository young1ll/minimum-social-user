import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let instance: MongoMemoryServer;

beforeAll(async () => {
  instance = await MongoMemoryServer.create();
  await mongoose.connect(instance.getUri());
});

beforeEach(async () => {
  if (mongoose.connection.readyState !== 1) {
    // mongoose 연결 해제 시, 에러 반환
    throw new Error('Mongoose is not connected');
  }

  const allCollections = await mongoose.connection.db.collections();

  // for (let collection of allCollections) {
  //   await collection.deleteMany({});
  // }
  // eslint iterators/generators require regenerator-runtime에서 위 코드 제한: 아래와 같이 수정
  await Promise.all(
    allCollections.map(async (collection) => {
      await collection.deleteMany({});
    }),
  );
});

afterAll(async () => {
  await instance.stop();
  await mongoose.disconnect();
});
