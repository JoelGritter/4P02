export interface AuthPayload {
  at_hash: string;
  sub: string;
  aud: string;
  email_verified: boolean;
  event_id: string;
  token_use: string;
  auth_time: number;
  iss: string;
  exp: number;
  iat: number;
  email: string;
  'cognito:username': string;
}
