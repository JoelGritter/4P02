import { Role } from "./../schemas/user.model";
import { connectToDatabase } from "./mongo";
import { LambdaCallback } from "./../types/lambdaCallback";
import { internalServerError, unauthorized } from "./rest";
import UserModel, { User } from "../schemas/user.model";
import { authorizer } from "../util/auth";

export const lambdaWrapper: (c: LambdaCallback) => LambdaCallback = (
  callback: LambdaCallback
) => {
  const options = {};
  return async (event, context) => {
    try {
      return await callback(event, context, options);
    } catch (error) {
      // TODO: Use error codes from error if available
      console.error(error);
      return internalServerError("Operation failed!");
    }
  };
};

export const auth: (c: LambdaCallback) => LambdaCallback = (
  callback: LambdaCallback
) => {
  return async (event, context, options) => {
    await connectToDatabase();
    const { valid, payload, message } = await authorizer(event);
    if (!valid) {
      return internalServerError(message);
    } else {
      const userDoc = await UserModel.findOne({
        cognitoId: payload["cognito:username"],
      });

      if (userDoc) {
        options.userDoc = userDoc;
        return callback(event, context, options);
      } else {
        const userDoc = await UserModel.create({
          cognitoId: payload["cognito:username"],
          email: payload.email,
        });
        options.userDoc = userDoc;
        return callback(event, context, options);
      }
    }
  };
};

export const roleAuth: (roles: Role[], c: LambdaCallback) => LambdaCallback = (
  roles,
  callback: LambdaCallback
) => {
  return auth(async (event, context, options) => {
    const user = options.userDoc as User;

    let allowed = false;

    for (let role of roles) {
      if (user.roles.includes(role)) {
        allowed = true;
      }
    }

    if (allowed) {
      callback(event, context, options);
    } else {
      return unauthorized();
    }
  });
};
