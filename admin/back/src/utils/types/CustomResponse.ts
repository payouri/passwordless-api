export type CustomResponse<Data = unknown, ErrorCode extends string = string> =
  | {
      hasFailed: true;
      error: {
        code: ErrorCode;
        message: string;
      };
    }
  | {
      hasFailed: false;
      data: Data;
    };
