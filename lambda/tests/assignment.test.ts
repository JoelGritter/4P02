import { fakeTest, fakeAssignment } from './mocks/assignment.mock';
import { fakeAdmin, fakeProf, fakeUser } from './mocks/user.mock';
import { fakeCourse } from './mocks/course.mock';
import { mockAuth, expectSuccess, fakeDocument } from './mocks/mockUtils';
import sinon, { mock } from 'sinon';
import { expect } from 'chai';
import AssignmentModel from '../app/schemas/assignment.model';
import CourseModel from '../app/schemas/course.model';

describe('Assignment as Admin', () => {
  beforeEach(() => {
    delete require.cache[require.resolve('../app/handlers/course')];
    mockAuth(fakeAdmin);
  });

  it('Get all assignments as admin', async () => {
    const { getAll } = require('../app/handlers/assignment');
    const a = mock(AssignmentModel);

    a.expects('find').exactly(1).resolves([fakeAssignment]);

    await expectSuccess(
      getAll,
      (data) => {
        expect(JSON.stringify(data)).equal(JSON.stringify([fakeAssignment]));
      },
      fakeAssignment
    );
    a.restore();
  });

  it('Add an assignment as admin', async () => {
    const { addAssignment } = require('../app/handlers/assignment');

    const c = mock(CourseModel);
    const a = mock(AssignmentModel);

    c.expects('findById').exactly(1).resolves(fakeCourse);
    a.expects('create').exactly(1).resolves(fakeAssignment);

    await expectSuccess(
      addAssignment,
      (data) => {
        expect(JSON.stringify(data)).equal(JSON.stringify(fakeAssignment));
      },
      fakeCourse
    );
    c.restore();
  });

  it('Update assignment as admin', async () => {
    const { updateAssignment } = require('../app/handlers/assignment');

    const c = mock(CourseModel);
    const a = mock(AssignmentModel);

    a.expects('findById').exactly(1).resolves(fakeAssignment);
    c.expects('findById').exactly(1).resolves(fakeCourse);
    a.expects('findByIdAndUpdate').exactly(1).resolves(fakeAssignment);

    await expectSuccess(
      updateAssignment,
      (data) => {
        expect(JSON.stringify(data)).equal(JSON.stringify(fakeAssignment));
      },
      fakeAssignment,
      { id: fakeAssignment.id }
    );
    a.restore();
    c.restore();
  });

  it('Delete assignments as admin', async () => {
    const { deleteAssignment } = require('../app/handlers/assignment');

    const c = mock(CourseModel);
    const a = mock(AssignmentModel);

    c.expects('findById').exactly(1).resolves(fakeCourse);
    a.expects('findById').exactly(1).resolves(fakeAssignment);
    a.expects('findByIdAndDelete').exactly(1).resolves(fakeAssignment);

    await expectSuccess(
      deleteAssignment,
      (data) => {
        expect(JSON.stringify(data)).equal(JSON.stringify(fakeAssignment));
      },
      fakeAssignment,
      { id: fakeAssignment }
    );
    c.restore();
    a.restore();
  });

  afterEach(() => {
    sinon.restore();
  });
});

describe('Assignments as Professor', () => {
  beforeEach(() => {
    delete require.cache[require.resolve('../app/handlers/course')];
    mockAuth(fakeProf);
  });

  it('Get all assignments as professor', async () => {
    const { getAll } = require('../app/handlers/assignment');
    const a = mock(AssignmentModel);

    a.expects('find').exactly(1).resolves([fakeAssignment]);

    await expectSuccess(
      getAll,
      (data) => {
        expect(JSON.stringify(data)).equal(JSON.stringify([fakeAssignment]));
      },
      fakeAssignment
    );
    a.restore();
  });

  it('Add an assignment as professor', async () => {
    const { addAssignment } = require('../app/handlers/assignment');

    const c = mock(CourseModel);
    const a = mock(AssignmentModel);

    c.expects('findById').exactly(1).resolves(fakeCourse);
    a.expects('create').exactly(1).resolves(fakeAssignment);

    await expectSuccess(
      addAssignment,
      (data) => {
        expect(JSON.stringify(data)).equal(JSON.stringify(fakeAssignment));
      },
      fakeCourse
    );
    c.restore();
  });

  it('Update assignment as professor', async () => {
    const { updateAssignment } = require('../app/handlers/assignment');

    const c = mock(CourseModel);
    const a = mock(AssignmentModel);

    a.expects('findById').exactly(1).resolves(fakeAssignment);
    c.expects('findById').exactly(1).resolves(fakeCourse);
    a.expects('findByIdAndUpdate').exactly(1).resolves(fakeAssignment);

    await expectSuccess(
      updateAssignment,
      (data) => {
        expect(JSON.stringify(data)).equal(JSON.stringify(fakeAssignment));
      },
      fakeAssignment,
      { id: fakeAssignment.id }
    );
    a.restore();
    c.restore();
  });

  it('Delete assignments as professor', async () => {
    const { deleteAssignment } = require('../app/handlers/assignment');

    const c = mock(CourseModel);
    const a = mock(AssignmentModel);

    c.expects('findById').exactly(1).resolves(fakeCourse);
    a.expects('findById').exactly(1).resolves(fakeAssignment);
    a.expects('findByIdAndDelete').exactly(1).resolves(fakeAssignment);

    await expectSuccess(
      deleteAssignment,
      (data) => {
        expect(JSON.stringify(data)).equal(JSON.stringify(fakeAssignment));
      },
      fakeAssignment,
      { id: fakeAssignment }
    );
    c.restore();
    a.restore();
  });

  afterEach(() => {
    sinon.restore();
  });
});

describe('Assignment as normal user', () => {
  beforeEach(() => {
    delete require.cache[require.resolve('../app/handlers/course')];
    mockAuth(fakeUser);
  });

  it('Get all course related assignments', async () => {
    const { getAllCourseAssigns } = require('../app/handlers/assignment');

    const s = mock(CourseModel);
    const a = mock(AssignmentModel);

    s.expects('findById').exactly(1).resolves(fakeCourse);
    a.expects('find').exactly(1).resolves([fakeAssignment]);

    await expectSuccess(
      getAllCourseAssigns,
      (data) => {
        expect(JSON.stringify(data[0])).equal(JSON.stringify(fakeAssignment));
      },
      fakeAssignment,
      { id: fakeCourse._id }
    );
    s.restore();
    a.restore();
  });

  it('Get my assignments as student/TA', async () => {
    const { getMyAssigns } = require('../app/handlers/assignment');

    const c = mock(CourseModel);
    const a = mock(AssignmentModel);

    c.expects('find').exactly(1).resolves([fakeCourse]);
    a.expects('find')
      .exactly(1)
      .resolves([fakeDocument(fakeAssignment)]);

    await expectSuccess(
      getMyAssigns,
      (data) => {
        expect(JSON.stringify(data[0])).equal(JSON.stringify(fakeAssignment));
      },
      fakeUser
    );
    a.restore();
    c.restore();
  });

  it('Get specific assignment for course as student/TA', async () => {
    const { getAssignment } = require('../app/handlers/assignment');

    const c = mock(CourseModel);
    const a = mock(AssignmentModel);

    c.expects('findById').exactly(1).resolves(fakeCourse);
    a.expects('findById').exactly(1).resolves(fakeAssignment);

    await expectSuccess(
      getAssignment,
      (data) => {
        expect(JSON.stringify(data)).equal(JSON.stringify(fakeAssignment));
      },
      fakeAssignment,
      { id: fakeCourse._id }
    );

    c.restore();
    a.restore();
  });

  afterEach(() => {
    sinon.restore();
  });
});
