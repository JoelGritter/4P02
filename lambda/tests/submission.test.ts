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
import { fakeCourse } from './mocks/course.mock';

describe('Submission Handlers Tests', () => {
  beforeEach(() => {
    delete require.cache[require.resolve('../app/handlers/submission')];
    mockAuth(fakeAdmin);
  });

  it('Get all submissions', async () => {
    const { getAll } = require('./../app/handlers/submission');
    const f = mock(SubmissionModel);
    f.expects('find').exactly(1).resolves([fakeSubmission]);
    await expectSuccess(
      getAll,
      (data) => {
        expect(JSON.stringify(data[0])).equal(JSON.stringify(fakeSubmission));
      },
      fakeSubmission
    );
    f.restore();
  });

  it('Get single assignment submission', async () => {
    const { getMySubmission } = require('../app/handlers/submission');
    const f = mock(SubmissionModel);
    f.expects('findOne').exactly(1).resolves(fakeDocument(fakeSubmission));
    await expectSuccess(
      getMySubmission,
      (data) => {
        expect(JSON.stringify(data)).equal(JSON.stringify(fakeSubmission));
      },
      fakeSubmission,
      { id: fakeSubmission.assignID }
    );
    f.restore();
  });

  it('Get all assignment submissions', async () => {
    const { getAssignmentSubmissions } = require('../app/handlers/submission');
    const a = mock(AssignmentModel);
    const c = mock(CourseModel);
    const f = mock(SubmissionModel);
    a.expects('findById').exactly(1).resolves(fakeAssignment);
    c.expects('findById').exactly(1).resolves(fakeCourse);
    f.expects('find').exactly(1).resolves([fakeSubmission]);
    await expectSuccess(
      getAssignmentSubmissions,
      (data) => {
        expect(JSON.stringify(data[0])).equal(JSON.stringify(fakeSubmission));
      },
      fakeSubmission,
      { id: fakeSubmission.assignID }
    );
    f.restore();
    c.restore();
    a.restore();
  });

  it('Submit', async () => {
    const { submit } = require('../app/handlers/submission');
    const a = mock(AssignmentModel);
    const s = mock(SubmissionModel);
    a.expects('findById').exactly(1).resolves(fakeAssignment);
    s.expects('findOneAndUpdate')
      .exactly(1)
      .resolves(fakeDocument(fakeSubmission));
    await expectSuccess(
      submit,
      (data) => {
        expect(JSON.stringify(data)).equal(JSON.stringify(fakeSubmission));
      },
      fakeSubmission,
      { id: fakeSubmission.assignID }
    );
    a.restore();
    s.restore();
  });

  it('Grade', async () => {
    const { grade } = require('../app/handlers/submission');
    const a = mock(AssignmentModel);
    const c = mock(CourseModel);
    const s = mock(SubmissionModel);
    a.expects('findById').exactly(1).resolves(fakeAssignment);
    c.expects('findById').exactly(1).resolves(fakeCourse);
    s.expects('findOneAndUpdate')
      .exactly(1)
      .resolves(fakeDocument(fakeSubmission));
    await expectSuccess(
      grade,
      (data) => {
        expect(JSON.stringify(data)).equal(JSON.stringify(fakeSubmission));
      },
      fakeSubmission,
      { id: fakeSubmission.assignID }
    );
    a.restore();
    c.restore();
    s.restore();
  });

  it('Delete assignment submissions', async () => {
    const {
      deleteAssignmentSubmissions,
    } = require('../app/handlers/submission');
    const a = mock(AssignmentModel);
    const c = mock(CourseModel);
    const s = mock(SubmissionModel);
    a.expects('findById').exactly(1).resolves(fakeAssignment);
    c.expects('findById').exactly(1).resolves(fakeCourse);
    s.expects('deleteMany').exactly(1).resolves([fakeSubmission]);
    await expectSuccess(
      deleteAssignmentSubmissions,
      (data) => {
        expect(JSON.stringify(data[0])).equal(JSON.stringify(fakeSubmission));
      },
      fakeSubmission,
      { id: fakeSubmission.assignID }
    );
    a.restore();
    c.restore();
    s.restore();
  });

  afterEach(() => {
    sinon.restore();
  });
});
