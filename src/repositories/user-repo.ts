import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
  ExecuteStatementCommand,
} from '@aws-sdk/lib-dynamodb';
import { awsConfig } from '@/config';

/**
 * minimum-social-user의 핵심 Repository #4
 * https://github.com/young1ll/minimum-social-user/issues/4#issuecomment-1894568357
 */
// AWS.config.update(awsConfig.remoteConfig); // AWS Global Configurations

const ddbClient = new DynamoDBClient({
  region: awsConfig.remoteConfig.region,
});
const docClient = DynamoDBDocumentClient.from(ddbClient);

export interface IAuthUser {
  pk: string; // userSub
  sk: string; // email
  // confirmed: boolean; // userConfirmed
}
export interface IUserData {
  email: string;
  username: string;
  profileImage: string; // url
  phone: string;
  bio: string;
  darkmode: boolean;
}

const UserRepository = () => {
  const tableName = `minimumsocial-userpool-tbl`;

  const getUsers = async () => {
    const command = new ExecuteStatementCommand({
      Statement: `SELECT * FROM "${tableName}"`,
    });
    const result = await docClient.send(command);

    return result;
  };

  const findByEmail = async (email: Pick<IAuthUser, 'sk'>) => {
    const seleteCommand = new ExecuteStatementCommand({
      Statement: `SELECT * FROM "${tableName}" WHERE sk=?`,
      Parameters: [email.sk],
    });

    const result = await docClient.send(seleteCommand);

    return result.Items;

    // const command = new GetCommand({
    //   TableName: tableName,
    //   Key: {
    //     sk: email,
    //   },
    //   ConsistentRead: true,
    // });

    // return docClient.send(command);
  };

  const create = async (user: IAuthUser & Partial<IUserData>) => {
    const date = new Date();
    const command = new PutCommand({
      TableName: tableName,
      Item: {
        ...user,
        __type: 'User',
        created_at: date.toISOString(),
        updated_at: date.toISOString(),
      },
    });

    const response = await docClient.send(command);

    console.log(response);

    return response;
  };

  const update = async (user: IAuthUser, data: Partial<IUserData>) => {
    const date = new Date();

    const command = new UpdateCommand({
      TableName: tableName,
      Key: {
        pk: user.pk,
      },
      UpdateExpression: `set ${Object.keys(data)} = :${Object.keys(data)}`,
      ExpressionAttributeValues: {
        ':updatedAt': date.toISOString(),
        ...data,
      },
      ReturnValues: 'ALL_NEW',
    });

    const response = await docClient.send(command);
    console.log(response);
    return response;
  };

  const deleteById = async (id: Pick<IAuthUser, 'pk'>) => {
    const command = new DeleteCommand({
      TableName: tableName,
      Key: {
        pk: id,
      },
    });

    const response = await docClient.send(command);
    return response;
  };

  return {
    create,
    getUsers,
    findByEmail,
    update,
    deleteById,
  };
};

export default UserRepository;
