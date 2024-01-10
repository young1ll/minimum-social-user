// 직렬화된 에러 정의
export type SerializedErrorField = {
  [key: string]: string[];
};

export type SerializedError = {
  message: string;
  field?: SerializedErrorField;
};

export type SerializedErrorMap = {
  errors: SerializedError[];
};

abstract class BaseCustomError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  abstract getStatusCode(): number;

  abstract serializeErrors(): SerializedErrorMap;
}

export default BaseCustomError;
