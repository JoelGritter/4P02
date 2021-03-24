import { User } from './../schemas/user.model';
import { APIGatewayProxyEvent } from 'aws-lambda';

type LambdaCallbackResult = any;

export interface CustomOptions {
  userDoc: User;
}

export type LambdaCallback = (
  event: APIGatewayProxyEvent,
  context: any, // Can't find the correct type, thanks aws
  options: CustomOptions
) => Promise<LambdaCallbackResult>;
