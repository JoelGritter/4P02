import { AuthPayload } from "./../types/index";
import request from "request";
import jwkToPem from "jwk-to-pem";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import { USER_POOL_CLIENT_ID, USER_POOL_ID } from "./env";
global.fetch = fetch;

const poolData = {
  UserPoolId: USER_POOL_ID, // Your user pool id here
  ClientId: USER_POOL_CLIENT_ID, // Your client id here
};
const pool_region = "us-east-1";

// https://medium.com/@prasadjay/amazon-cognito-user-pools-in-nodejs-as-fast-as-possible-22d586c5c8ec
export function validateToken(
  token: string
): Promise<{ valid: boolean; message?: string; payload?: AuthPayload }> {
  return new Promise((resolve) => {
    request(
      {
        url: `https://cognito-idp.${pool_region}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`,
        json: true,
      },
      function (error, response, body) {
        if (!error && response.statusCode === 200) {
          const pems = {};
          const keys = body["keys"];
          for (let i = 0; i < keys.length; i++) {
            //Convert each key to PEM
            const key_id = keys[i].kid;
            const modulus = keys[i].n;
            const exponent = keys[i].e;
            const key_type = keys[i].kty;
            const jwk = { kty: key_type, n: modulus, e: exponent };
            const pem = jwkToPem(jwk);
            pems[key_id] = pem;
          }
          //validate the token
          token = token.split(" ")[1];
          const decodedJwt = jwt.decode(token, { complete: true });

          if (!decodedJwt) {
            return resolve({
              valid: false,
              message: "Invalid token 1",
            });
          }

          const kid = decodedJwt.header.kid;
          const pem = pems[kid];
          if (!pem) {
            return resolve({
              valid: false,
              message: "Invalid token 2",
            });
          }

          jwt.verify(token, pem, function (err, payload) {
            if (err) {
              return resolve({
                valid: false,
                message: "Invalid token 3",
              });
            } else {
              return resolve({
                valid: true,
                payload,
              });
            }
          });
        } else {
          return resolve({
            valid: false,
            message: "Download error",
          });
        }
      }
    );
  });
}

export async function authorizer(event) {
  return await validateToken(event?.headers?.Authorization);
}
