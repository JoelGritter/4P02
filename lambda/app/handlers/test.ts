import { TestCase } from './../schemas/assignment.model';
import {
  TestCaseResult,
  Submission,
  filterSubmissionForStudent,
} from './../schemas/submission.model';
import SubmissionModel from './../schemas/submission.model';
import { lambda, auth } from './../util/wrappers';
import { S3 } from '@aws-sdk/client-s3';
import { badRequest, parseBody, success, unauthorized } from '../util/rest';
import fs from 'fs';
import util from 'util';
import cp from 'child_process';
import { cat, cd, echo, exec } from 'shelljs';
import AssignmentModel from '../schemas/assignment.model';
import CourseModel from '../schemas/course.model';
const execAsync = util.promisify(cp.exec);
import { v4 as uuidv4 } from 'uuid';

function runCode(
  codePath: string,
  testCase: TestCase
): Promise<TestCaseResult> {
  const expectedOutput = testCase.output.trim();

  const codePromise = new Promise<TestCaseResult>((resolve, reject) => {
    // Run stuff
    cd(codePath);
    exec('touch compile_and_run.sh', () => {
      exec('dos2unix compile_and_run.sh');
      exec(`chmod +x compile_and_run.sh`);
      echo(testCase.input).exec('env -i sh compile_and_run.sh', (c, s, e) => {
        const actualOutput = cat('out.txt').trim();
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

  const timeoutPromise = new Promise<TestCaseResult>((resolve, reject) =>
    setTimeout(
      () =>
        resolve({
          input: testCase.input,
          expectedOutput,
          actualOutput: 'Timeout',
          correct: false,
          hidden: testCase.hidden,
          errorMessage: 'Timeout',
        } as TestCaseResult),
      4000
    )
  );
  return Promise.race<TestCaseResult>([codePromise, timeoutPromise]);
}

export const getTestResult = lambda(
  auth(async (event, context, { userDoc }) => {
    const { assignmentId, testCaseId, owner: reqOwner } = parseBody<any>(event);
    const owner = reqOwner ?? userDoc.cognitoId;
    const submission = await SubmissionModel.findOne({
      owner,
      assignID: assignmentId,
    });

    if (!submission) {
      return badRequest('Submission does not exist');
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
        course.currentProfessors.includes(userDoc.cognitoId) ||
        userDoc.roles.includes('admin')
      )
    ) {
      return unauthorized('You do not have access to this course');
    }

    let fltr = (x: Submission) => x;

    if (
      !(
        course.moderators.includes(userDoc.cognitoId) ||
        course.currentProfessors.includes(userDoc.cognitoId) ||
        userDoc.roles.includes('admin')
      )
    ) {
      fltr = filterSubmissionForStudent;
    }

    const testCase = assignment.testCases.find((test) => {
      // This does need to be ==
      return test._id == testCaseId;
    });

    if (!testCase) {
      return badRequest(
        'Test case does not exist' +
          JSON.stringify({
            testCaseId,
            testCase,
            testCases: assignment.testCases,
            someId: assignment.testCases[0]._id,
          })
      );
    }

    if (submission.testCaseResults[testCase._id.toString()]) {
      return success(fltr(submission), 'Test run already completed');
    }

    const s3 = new S3({ region: 'us-east-1' });

    // Get and unzip file
    const zipObj = await s3.getObject({
      Bucket: 'uassign-api-dev-s3bucket-1ubat74rzbquo',
      Key: `submissions/${course._id}}/${assignment._id}/${owner}/${submission.codeZip}`,
    });

    const body = zipObj.Body;
    const uid = uuidv4();
    const codePath = `/tmp/code${uid}`;
    const codeZipPath = `/tmp/code${uid}.zip`;

    await execAsync(`rm -rf ${codeZipPath}`);
    await execAsync(`rm -rf ${codePath}`);

    const writeStream = fs.createWriteStream(codeZipPath);

    await (body as any).pipe(writeStream as any);
    await execAsync(`unzip -j ${codeZipPath} -d ${codePath}`);

    const res = await runCode(codePath, testCase);

    submission.testCaseResults[testCaseId] = res;
    submission.markModified('testCaseResults');
    await submission.save();

    return success(fltr(submission));
  })
);
