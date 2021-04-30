import lambdaTester from 'lambda-tester';
import { Handler } from 'aws-lambda';
import { fakeUser } from './user.mock';
import { LambdaCallback } from '../../app/types/lambdaCallback';
import * as wrappers from '../../app/util/wrappers';
import { stub, mock } from 'sinon';
import * as mongoExports from './../../app/util/mongo';

// Emulates a mongodb document
export function fakeDocument(obj: any): any {
  return {
    ...obj,
    toObject: () => ({ ...obj }),
    save: async () => {},
  };
}

// Call as first import, mocks the auth wrapper to return 'user' as the current logged in user
export function mockAuth(user = fakeUser) {
  const mockAuthWrapper: (c: LambdaCallback) => LambdaCallback = (callback) => {
    return async (event, context, options) => {
      return await callback(event, context, {
        ...options,
        userDoc: fakeDocument(user),
      });
    };
  };
  stub(wrappers, 'auth').callsFake(mockAuthWrapper);
}

// returns a promise that resolves to a given object
export async function promiseConst(obj: any) {
  return obj;
}

// Sets up a mock connectToDatabase
export const usesDb = () => {
  mock(mongoExports).expects('connectToDatabase').resolves();
};

// Utility wrapper to test lambda success, run tests with response data inside callback
export const expectSuccess = async (
  lambdaFn: Handler<any, any>,
  callback: (data: any) => void,
  body?: any,
  pathParameters?: any
) => {
  const meTest = lambdaTester(lambdaFn);
  const event: any = {
    pathParameters,
  };
  if (body !== undefined) {
    event.body = JSON.stringify(body);
  }
  await meTest.event(event).expectResolve((result: any) => {
    const body = JSON.parse(result.body);
    // console.log({ result });
    callback(body.data);
  });
};
