import { APIGatewayProxyEvent } from "aws-lambda";
export type LambdaCallback = (event: APIGatewayProxyEvent) => Promise<any>;
