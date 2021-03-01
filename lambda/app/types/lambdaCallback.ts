import {
  APIGatewayEventRequestContext,
  APIGatewayProxyEvent,
} from "aws-lambda";

type LambdaCallbackResult = any;

export type LambdaCallback = (
  event: APIGatewayProxyEvent,
  context: APIGatewayEventRequestContext,
  options?: any
) => Promise<LambdaCallbackResult>;