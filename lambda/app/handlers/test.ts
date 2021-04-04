import { S3 } from '@aws-sdk/client-s3';
import { success } from '../util/rest';
import fs from 'fs';
import util from 'util';
import cp from 'child_process';
import { cat, cd, echo, exec } from 'shelljs';
const execAsync = util.promisify(cp.exec);
const spawnAsync = util.promisify(cp.spawn);

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
