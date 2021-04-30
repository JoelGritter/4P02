import { fakeAdmin, fakeProf } from './mocks/user.mock';
import { fakeSubmission } from './mocks/submission.mock';
import { fakeAssignment } from './mocks/assignment.mock';
import {
  mockAuth,
  expectSuccess,
  usesDb,
  fakeDocument,
} from './mocks/mockUtils';
import sinon, { mock } from 'sinon';
import { expect } from 'chai';
import SubmissionModel from './../app/schemas/submission.model';
import AssignmentModel from '../app/schemas/assignment.model';
import CourseModel from './../app/schemas/course.model';
import { fakeCourse2 } from './mocks/course.mock';
import { S3 } from 'aws-sdk';

describe('File Handlers Tests', () => {
  beforeEach(() => {
    delete require.cache[require.resolve('../app/handlers/file')];
    mockAuth(fakeAdmin);
  });

  it('Put file submission', async () => {
    const s = mock(S3.prototype);
    const c = mock(CourseModel);
    c.expects('findById').exactly(1).resolves(fakeCourse2);
    s.expects('getSignedUrl').exactly(1).returns('fakeSignedUrl');
    const { submissionPutUrl } = require('./../app/handlers/file');
    await expectSuccess(
      submissionPutUrl,
      (data) => {
        expect(data.signedUrl).equal('fakeSignedUrl');
      },
      {
        courseId: 'fakeCourseId',
        assignmentId: 'fakeAssignmentId',
        objectKey: 'fakeObjectKey',
        contentType: 'fakeContentType',
      }
    );
    s.restore();
    c.restore();
  });

  it('Get file submission', async () => {
    const s = mock(S3.prototype);
    const c = mock(CourseModel);
    c.expects('findById').exactly(1).resolves(fakeCourse2);
    s.expects('getSignedUrl').exactly(1).returns('fakeSignedUrl');
    const { submissionGetUrl } = require('./../app/handlers/file');
    await expectSuccess(
      submissionGetUrl,
      (data) => {
        expect(data.signedUrl).equal('fakeSignedUrl');
      },
      {
        courseId: 'fakeCourseId',
        assignmentId: 'fakeAssignmentId',
        objectKey: 'fakeObjectKey',
        cognitoId: 'fakeCognitoId',
      }
    );
    s.restore();
    c.restore();
  });

  it('Submission created message', async () => {
    const obj = require('./../app/handlers/file');
    sinon.stub(obj, 'submissionCreated');
  });

  it('Submission removed message', async () => {
    const obj = require('./../app/handlers/file');
    sinon.stub(obj, 'submissionRemoved');
  });

  afterEach(() => {
    sinon.restore();
  });
});
