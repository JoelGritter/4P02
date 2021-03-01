import {
  APIGatewayEventRequestContext,
  APIGatewayProxyEvent,
} from "aws-lambda";

export type LambdaCallback = (
  event: APIGatewayProxyEvent,
  context: APIGatewayEventRequestContext,
  options?: any
) => Promise<any>;
