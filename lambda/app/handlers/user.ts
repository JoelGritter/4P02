import { connectToDatabase } from "../util/mongo";

// const roleAuth()

export async function get(event, context, callback) {
  await connectToDatabase();
  const response = {
    statusCode: 200,
    body: {
      id: event.requestContext.authorizer.jwt.claims["cognito:username"],
      eamil: event.requestContext.authorizer.jwt.claims.email,
    },
  };

  callback(null, response);
}

export async function post(event, context, callback) {
  await connectToDatabase();
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "Password sent.",
    }),
  };

  callback(null, response);
}
