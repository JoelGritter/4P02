import SubmissionModel, { Submission } from './../schemas/submission.model';
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

const input = '1\n2\n3\n'; // Test case input
const output = '1\n2\n3\n'; // Test case expected output
const compile_and_run = 'touch out.txt\nls\npython3 main.py > out.txt\nls';

function doThing(): Promise<any> {
  return new Promise((resolve, reject) => {
    // Run stuff
    cd('/tmp/code');
    exec('touch compile_and_run.sh', () => {
      echo(compile_and_run).to('compile_and_run.sh');
      exec(`chmod +x compile_and_run.sh`);
      echo(input).exec('./compile_and_run.sh', (c, s, e) => {
        const stdout = cat('out.txt');
        resolve({ yes: stdout.trim() === output.trim(), stdout });
      });
    });
  });
}

export const getTestResults = lambda(
  auth(async (event, context, { userDoc }) => {
    const submissionId = event.pathParameters.submissionId;

    const submission = await SubmissionModel.findById(submissionId);

    if (!submission) {
      return badRequest('Submission does not exists');
    }

    const assignment = await AssignmentModel.findById(submission.assignID);

    const course = await CourseModel.findById(assignment.courseID);

    if (!assignment) {
      return badRequest('Assignment does not exist');
    }

    if (!course) {
      return badRequest('Course does not exist');
    }

    if (
      course.students.includes(userDoc.cognitoId) ||
      course.moderators.includes(userDoc.cognitoId) ||
      course.currentProfessors.includes(userDoc.cognitoId)
    ) {
    } else {
      return unauthorized('You do not have access to this course');
    }
  })
);

export const runTest = async (event) => {
  const s3 = new S3({ region: 'us-east-1' });

  // Get and unzip file
  const obj = await s3.getObject({
    Bucket: 'uassign-api-dev-s3bucket-1ubat74rzbquo',
    Key: 'example_project.zip',
  });

  const body = obj.Body;

  const writeStream = fs.createWriteStream('/tmp/code.zip');

  await (body as any).pipe(writeStream as any);

  await execAsync(`unzip -j /tmp/code.zip -d /tmp/code`);

  const { stdout, stderr } = await execAsync('ls /tmp/code');

  const { yes, stdout: progOut, stderr: err } = await doThing();

  return success({ stdout, yes, progOut });
};
