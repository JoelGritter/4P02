import { TestCase } from './../schemas/assignment.model';
import { TestCaseResult } from './../schemas/submission.model';
import SubmissionModel from './../schemas/submission.model';
import { lambda, auth } from './../util/wrappers';
import { S3 } from '@aws-sdk/client-s3';
import { badRequest, success, unauthorized } from '../util/rest';
import fs from 'fs';
import util from 'util';
import cp from 'child_process';
import { cat, cd, echo, exec } from 'shelljs';
import AssignmentModel from '../schemas/assignment.model';
import CourseModel from '../schemas/course.model';
const execAsync = util.promisify(cp.exec);

function runCode(
  codePath: string,
  testCase: TestCase
): Promise<TestCaseResult> {
  return new Promise((resolve, reject) => {
    // Run stuff
    cd(codePath);
    exec('touch compile_and_run.sh', () => {
      exec(`chmod +x compile_and_run.sh`);
      echo(testCase.input).exec('./compile_and_run.sh', (c, s, e) => {
        const actualOutput = cat('out.txt').trim();
        const expectedOutput = testCase.output.trim();
        resolve({
          input: testCase.input,
          expectedOutput,
          actualOutput,
          correct: actualOutput === expectedOutput,
          hidden: testCase.hidden,
        } as TestCaseResult);
      });
    });
  });
}

export const getTestResult = lambda(
  auth(async (event, context, { userDoc }) => {
    const assignmentId = event.pathParameters.assignmentId;
    const testCaseId = event.pathParameters.testCaseId;

    const submission = await SubmissionModel.findOne({
      owner: userDoc.cognitoId,
      assignID: assignmentId,
    });

    if (!submission) {
      return badRequest('Submission does not exists');
    }

    const assignment = await AssignmentModel.findById(assignmentId);

    const course = await CourseModel.findById(assignment.courseID);

    if (!assignment) {
      return badRequest('Assignment does not exist');
    }

    if (!course) {
      return badRequest('Course does not exist');
    }

    if (
      !(
        course.students.includes(userDoc.cognitoId) ||
        course.moderators.includes(userDoc.cognitoId) ||
        course.currentProfessors.includes(userDoc.cognitoId)
      )
    ) {
      return unauthorized('You do not have access to this course');
    }

    const testCase = assignment.testCases.find((c) => c._id === testCaseId);

    if (!testCase) {
      return badRequest('Test case does not exist');
    }

    if (submission.testCaseResults[testCase._id]) {
      return success(submission, 'Test run already completed');
    }

    const s3 = new S3({ region: 'us-east-1' });

    // Get and unzip file
    const zipObj = await s3.getObject({
      Bucket: 'uassign-api-dev-s3bucket-1ubat74rzbquo',
      Key: `s3/submissions/${course._id}}/${assignment._id}/${userDoc.cognitoId}/${submission.codeZip}`,
    });

    const body = zipObj.Body;

    const codePath = `/tmp/code${submission._id}`;
    const codeZipPath = `/tmp/code${submission._id}.zip`;

    const writeStream = fs.createWriteStream(codePath);

    await (body as any).pipe(writeStream as any);

    await execAsync(`unzip -j ${codeZipPath} -d ${codePath}`);

    const res = await runCode(codePath, testCase);

    submission.testCaseResults[testCaseId] = res;
    submission.save();

    return success(submission);
  })
);
