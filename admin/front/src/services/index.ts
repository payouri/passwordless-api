import { API_URL } from "../constants";
import { AuthType } from "../types";

type CustomResponse<Data, ErrorCode extends string = string> =
  | {
      hasFailed: true;
      error: {
        status: number;
        code: ErrorCode;
        message: string;
      };
    }
  | {
      hasFailed: false;
      data: Data;
    };

const getResponseData = async (response: Response) => {
  const contentType = response.headers.get("content-type");

  try {
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const responseData = await response.json();
      return responseData;
    } else {
      const responseData = await response.text();
      return responseData;
    }
  } catch (error) {
    return null;
  }
};

const getAuthDataRequest = async (): Promise<CustomResponse<any>> => {
  try {
    const response = await fetch(`${API_URL}/authenticate`, {
      method: "GET",
    });

    if (response.ok && response.status < 400) {
      const data = await getResponseData(response);
      return {
        hasFailed: false,
        data,
      };
    }

    const error = await getResponseData(response);

    return {
      hasFailed: true,
      error: {
        status: response.status,
        code: typeof error === "string" ? error : "REQUEST_FAILED",
        message: typeof error === "string" ? error : "Request failed",
      },
    };
  } catch (error) {
    return {
      hasFailed: true,
      error: {
        status: 500,
        code: "REQUEST_FAILED",
        message: error instanceof Error ? error.message : "Request failed",
      },
    };
  }
};

const authenticateUserRequest = async (params: {
  body: {
    authType: AuthType;
    payload: string;
  };
  token: string;
}): Promise<CustomResponse<any>> => {
  try {
    const response = await fetch(`${API_URL}/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.token}`,
      },
      body: JSON.stringify(params.body),
    });

    if (response.ok && response.status < 400) {
      const data = await getResponseData(response);
      return {
        hasFailed: false,
        data,
      };
    }

    const error = await getResponseData(response);

    return {
      hasFailed: true,
      error: {
        status: response.status,
        code: typeof error === "string" ? error : "REQUEST_FAILED",
        message: typeof error === "string" ? error : "Request failed",
      },
    };
  } catch (error) {
    return {
      hasFailed: true,
      error: {
        status: 500,
        code: "REQUEST_FAILED",
        message: error instanceof Error ? error.message : "Request failed",
      },
    };
  }
};

export { authenticateUserRequest, getAuthDataRequest };
