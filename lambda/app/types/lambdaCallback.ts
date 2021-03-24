import { User } from './../schemas/user.model';
import {
  APIGatewayEventRequestContext,
  APIGatewayProxyEvent,
} from 'aws-lambda';

type LambdaCallbackResult = any;

export interface CustomOptions {
  userDoc: User;
}

export type LambdaCallback = (
  event: APIGatewayProxyEvent,
  context: APIGatewayEventRequestContext,
  options: CustomOptions
) => Promise<LambdaCallbackResult>;
