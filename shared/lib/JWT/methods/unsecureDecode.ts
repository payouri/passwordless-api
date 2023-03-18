import * as JWT from "jose";

export type GetUnsecureDecodeParams = {
  issuer: string;
};

export const getUnsecureDecode = (params: GetUnsecureDecodeParams) =>
  function ({
    token,
    expectedAudience,
    expectedSubject,
  }: {
    token: string;
    expectedAudience?: string | string[];
    expectedSubject?: string;
  }) {
    const decoded = JWT.UnsecuredJWT.decode(token, {
      issuer: params.issuer,
      audience: expectedAudience,
      subject: expectedSubject,
    });

    return decoded;
  };
