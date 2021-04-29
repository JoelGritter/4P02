import { Role } from './../../app/schemas/user.model';
import lambdaTester from 'lambda-tester';
import { Handler } from 'aws-lambda';
import { fakeUser } from './user.mock';
import { LambdaCallback } from '../../app/types/lambdaCallback';
import * as wrappers from '../../app/util/wrappers';
import { stub, mock } from 'sinon';
import * as mongoExports from './../../app/util/mongo';
import { checkRole } from '../../app/util/wrappers';
import { unauthorized } from '../../app/util/rest';
// Emulates a mongodb document
export function fakeDocument(obj): any {
  return {
    ...obj,
    toObject: () => ({ ...obj }),
  };
}

// Call as first import, mocks the auth wrapper to return 'user' as the current logged in user
export function mockAuth(user = fakeUser) {
  // console.log('Mock auth called', { user });
  // console.trace();
  const mockAuthWrapper: (c: LambdaCallback) => LambdaCallback = (callback) => {
    return async (event, context, options) => {
      return await callback(event, context, {
        ...options,
        userDoc: fakeDocument(user),
      });
    };
  };
  stub(wrappers, 'auth').callsFake(mockAuthWrapper);
  // const mockRoleAuthWrapper: (
  //   roles: Role[],
  //   c: LambdaCallback
  // ) => LambdaCallback = (roles, callback) => {
  //   return async (event, context, options) => {
  //     // console.log('It get here', { user, check: checkRole(roles, user) });
  //     if (checkRole(roles, user)) {
  //       const res = await callback(event, context, {
  //         ...options,
  //         userDoc: fakeDocument(user),
  //       });
  //       return res;
  //     } else {
  //       return unauthorized();
  //     }
  //   };
  // };
  // stub(wrappers, 'roleAuth').callsFake(mockRoleAuthWrapper);
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

export function clearRequireCache() {
  Object.keys(require.cache).forEach(function (key) {
    delete require.cache[key];
  });
}
