import { BaseCustomError } from '@/errors';
import { SerializedErrorMap } from '@/errors/base-error';

class DatabaseError extends BaseCustomError {
  private readonly errorCode = 500; // 에러 코드 설정

  private readonly errorType = 'DATABASE_ERROR'; // 에러 타입 설정

  private readonly errMessage = 'Database operation error';

  constructor(errors?: Error | Error[]) {
    super('Database operation error');
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }

  getStatusCode(): number {
    return this.errorCode;
  }

  serializeErrors(): SerializedErrorMap {
    return {
      errors: [
        {
          message: this.errMessage,
        },
      ],
    };
  }
}

export default DatabaseError;
