import { S3 } from '@aws-sdk/client-s3';
import { success } from '../util/rest';
import fs from 'fs';

export const runTest = async (event) => {
  const s3 = new S3({ region: 'us-east-1' });
  const obj = await s3.getObject({
    Bucket: 'uassign-api-dev-s3bucket-1ubat74rzbquo',
    Key: 'woweee.zip',
  });

  const body = obj.Body;

  const writeStream = fs.createWriteStream('/tmp/code.zip');

  await (body as any).pipe(writeStream as any);

  return success('Nice');
};
