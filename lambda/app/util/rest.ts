export function internalServerError(message = "Operation failed") {
  return {
    statusCode: 500,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ success: false, message }),
  };
}

export function success(data: any, message: string) {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
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
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      success: true,
      message,
      data,
    }),
  };
}
