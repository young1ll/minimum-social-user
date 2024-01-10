import { BaseCustomError, SerializedError } from '@/errors';
import { SerializedErrorField, SerializedErrorMap } from '@/errors/base-error';
import { ValidationError, Location } from 'express-validator';

export type InvalidInputErrorsParams = ValidationError[];
class InvalidInputError extends BaseCustomError {
  private readonly errors: InvalidInputErrorsParams | undefined;

  private errorCode = 422; // 에러 코드 설정

  private errorType = 'VALIDATION_ERROR'; // 에러 타입 설정

  private errMessage = 'Input validation error';

  constructor(errors?: InvalidInputErrorsParams) {
    super('Input validation error');
    this.errors = errors;
    Object.setPrototypeOf(this, InvalidInputError.prototype);
  }

  getStatusCode(): number {
    return this.errorCode;
  }

  serializeErrors(): SerializedErrorMap {
    return this.parseValidationErrors();
  }

  private parseValidationErrors(): SerializedErrorMap {
    const parsedErrors: SerializedErrorField = {};

    if (this.errors && this.errors.length > 0) {
      this.errors.forEach((error) => {
        if (parsedErrors[error.type]) {
          parsedErrors[error.type].push(error.msg);
        } else {
          parsedErrors[error.type] = [error.msg];
        }
      });
    }

    return {
      errors: [
        {
          message: this.errMessage,
          field: parsedErrors,
        },
      ],
    };
  }
}

export default InvalidInputError;
