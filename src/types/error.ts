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

export { ApiError, UserNotificationError };
