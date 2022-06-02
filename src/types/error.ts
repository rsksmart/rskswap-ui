class ApiError extends Error {
  errorCode: unknown;
  errorData: unknown;
  constructor(
    message: string | undefined,
    errorCode: unknown,
    errorData: unknown
  ) {
    super(message);
    this.errorCode = errorCode;
    this.errorData = errorData;
  }
}

class UserNotificationError extends Error {
  errorCode: string;
  errorData: string;
  constructor(
    message: string | undefined,
    errorCode: string,
    errorData: string
  ) {
    super(message);
    this.errorCode = errorCode;
    this.errorData = errorData;
  }
}

class MessageError extends Error {
  constructor(message: string | undefined) {
    super(message);
  }
}

export { ApiError, UserNotificationError, MessageError };
