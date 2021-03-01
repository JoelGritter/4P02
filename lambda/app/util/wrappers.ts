import { Document } from 'mongoose';
import { User } from './../schemas/user.model';
import { LambdaCallback } from "./../types/lambdaCallback";
import { APIGatewayProxyEvent } from "aws-lambda";
import { internalServerError } from "./rest";
import UserModel from "../schemas/user.model";
import { authorizer } from '../util/auth';

export const lambdaWrapper: (c: LambdaCallback) => LambdaCallback = (
  callback: LambdaCallback
) => {
  return async (event: APIGatewayProxyEvent) => {
    try {
      return await callback(event);
    } catch (error) {
      // TODO: Use error codes from error if available
      console.error(error);
      return internalServerError("Operation failed!");
    }
  };
};

export function adminAuth(
  callback: (event: APIGatewayProxyEvent, user: Document<User>) => Promise<any>
) : LambdaCallback {
  return async (event: APIGatewayProxyEvent) => {
    const { valid, payload, message } = await authorizer(event);
    if (!valid) {
      return internalServerError(message);
    } else {
      const userDoc = await UserModel.findOne({ cognitoId: payload._id });
      if (userDoc) {
        callback(event, userDoc);
      } else {
        return internalServerError("Could not find user");
      }
    }
  };
}