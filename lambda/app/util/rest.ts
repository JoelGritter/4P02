import { APIGatewayProxyEvent } from 'aws-lambda';
export function internalServerError(message = 'Operation failed') {
  return {
    statusCode: 500,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ success: false, message }),
  };
}

export function success(data?: any, message?: string) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      success: true,
      message,
      data,
    }),
  };
}

export function created(data: any, message?: string) {
  return {
    statusCode: 201,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      success: true,
      message,
      data,
    }),
  };
}

export function parseBody<T>(event: APIGatewayProxyEvent): T {
  return JSON.parse(event.body as string) as T;
}

// TODO: FOrmatting might be wrong
export function unauthorized(message = 'Unauthorized') {
  return {
    statusCode: 401,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      success: false,
      message,
    }),
  };
}

export function badRequest(message = 'Bad Request') {
  return {
    statusCode: 400,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      success: false,
      message,
    }),
  };
}
