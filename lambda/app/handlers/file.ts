import { lambda, auth } from './../util/wrappers';
import { connectToDatabase } from './../util/mongo';
import { authorizer } from './../util/auth';
import CourseModel from '../schemas/course.model';
import UserModel from '../schemas/user.model';
import { S3 } from 'aws-sdk';
import { success, unauthorized } from '../util/rest';
const s3 = new S3({ region: 'us-east-1' });

// Functions

const buck = (objectKey: string) => ({
  Bucket: 'uassign-api-dev-s3bucket-1ubat74rzbquo',
  Key: objectKey,
});

export const signedPutUrl = lambda(
  auth(async (event, context, { userDoc }) => {
    return success('wut');
    // const { courseId, assignmentId, objectKey } = event.pathParameters;

    // const course = await CourseModel.findById(courseId);

    // if (course.students.includes(userDoc.cognitoId)) {
    //   const signedUrl = s3.getSignedUrl(
    //     'putObject',
    //     buck(
    //       `submissions/${courseId}}/${assignmentId}/${userDoc.cognitoId}/${objectKey}`
    //     )
    //   );
    //   return success({ signedUrl });
    // } else {
    //   return unauthorized();
    // }
  })
);

export const signedGetUrl = lambda(
  auth(async (event, context, { userDoc }) => {
    const { courseId, assignmentId, objectKey } = event.pathParameters;

    const course = await CourseModel.findById(courseId);

    if (
      course.students.includes(userDoc.cognitoId) ||
      course.moderators.includes(userDoc.cognitoId) ||
      course.currentProfessors.includes(userDoc.cognitoId)
    ) {
      const signedUrl = s3.getSignedUrl(
        'getObject',
        buck(
          `submissions/${courseId}}/${assignmentId}/${userDoc.cognitoId}/${objectKey}`
        )
      );
      return success({ signedUrl });
    } else {
      return unauthorized();
    }
  })
);

// Triggers

export async function submissionCreated(event: any) {
  // Nothing yet
  console.log(event);
}

export async function submissionRemoved(event: any) {
  // Nothing yet
  console.log(event);
}

// Authenticators

export function submissionGetAuth(event: any, context: any, callback: any) {
  context.callbackWaitsForEmptyEventLoop = false;
  authHelper(event, 'GET')
    .then((result) => {
      if (result) {
        callback(null, generateAllow('me', event.methodArn));
      } else {
        callback('Unauthorized');
      }
    })
    .catch((err) => {
      console.error(err);
      callback('Internal Server Error');
    });
}

export function submissionModifyAuth(event: any, context: any, callback: any) {
  context.callbackWaitsForEmptyEventLoop = false;
  authHelper(event, 'PUT')
    .then((result) => {
      if (result) {
        callback(null, generateAllow('me', event.methodArn));
      } else {
        callback('Unauthorized');
      }
    })
    .catch((err) => {
      console.error(err);
      callback('Internal Server Error');
    });
}

// Helpers

async function authHelper(event: any, method: 'GET' | 'PUT'): Promise<boolean> {
  const { courseId, assignmentId, cognitoId } = event.pathParameters;

  await connectToDatabase();

  const { valid, payload } = await authorizer(event);

  if (!valid) {
    return false;
  }

  const reqUser = await UserModel.findOne({
    cognitoId: payload['cognito:username'],
  });

  if (reqUser.roles.includes('admin')) {
    return true;
  } else {
    const course = await CourseModel.findById(courseId);
    if (reqUser.roles.includes('prof')) {
      return (
        method === 'GET' && course.currentProfessors.includes(reqUser.cognitoId)
      );
    } else {
      return (
        cognitoId === reqUser.cognitoId &&
        (course.students.includes(reqUser.cognitoId) ||
          (method === 'GET' && course.moderators.includes(reqUser.cognitoId)))
      );
    }
  }
}

// Help function to generate an IAM policy
function generatePolicy(principalId, effect, resource) {
  // Required output:
  const authResponse: any = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument: any = {};
    policyDocument.Version = '2012-10-17'; // default version
    policyDocument.Statement = [];
    const statementOne: any = {};
    statementOne.Action = 'execute-api:Invoke'; // default action
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  // Optional output with custom properties of the String, Number or Boolean type.
  // authResponse.context = {
  //   stringKey: 'stringval',
  //   numberKey: 123,
  //   booleanKey: true,
  // };
  return authResponse;
}

function generateAllow(principalId, resource) {
  return generatePolicy(principalId, 'Allow', resource);
}
function generateDeny(principalId, resource) {
  return generatePolicy(principalId, 'Deny', resource);
}
