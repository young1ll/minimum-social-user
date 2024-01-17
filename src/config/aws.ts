export default {
  tableName: process.env.DYNAMODB_NAME,
  localConfig: {
    region: 'local', // dynamodb region
    endpoing: 'http://localhost:8000',
  },
  remoteConfig: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // 현재 설정 안되어 있음
    region: process.env.AWS_REGION,
  },
};
