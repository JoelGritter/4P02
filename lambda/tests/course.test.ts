import { fakeAdmin, fakeAdminProf, fakeProf } from './mocks/user.mock';
import { fakeCourse, emptyCourse } from './mocks/course.mock';
import { mockAuth, expectSuccess } from './mocks/mockUtils';
import sinon, { mock } from 'sinon';
import { expect } from 'chai';
import CourseModel from '../app/schemas/course.model';

describe('Admin course tests', () => {
  beforeEach(() => {
    delete require.cache[require.resolve('../app/handlers/course')];
    mockAuth(fakeAdminProf);
  });

  it('Course Creation', async () => {
    const { addCourse } = require('../app/handlers/course');
    const s = mock(CourseModel);
    s.expects('create').exactly(1).resolves(emptyCourse);
    await expectSuccess(
      addCourse,
      (data) => {
        expect(data).deep.equal(emptyCourse);
      },
      emptyCourse
    );
    s.restore();
  });

  it('Course Get', async () => {
    const { getCourse } = require('../app/handlers/course');
    const f = mock(CourseModel);
    f.expects('findOne').exactly(1).resolves(fakeCourse);
    await expectSuccess(
      getCourse,
      (data) => {
        expect(data).deep.equal(fakeCourse);
      },
      fakeCourse,
      { id: fakeCourse.id }
    );
    f.restore();
  });

  it('Get All Associated Courses', async () => {
    const { getAllAssociated } = require('../app/handlers/course');

    const f = mock(CourseModel);
    f.expects('find').exactly(3).resolves([fakeCourse]);
    await expectSuccess(
      getAllAssociated,
      (data) => {
        expect(data[0]).deep.equal(fakeCourse);
      },
      fakeCourse
    );
    f.restore();
  });

  it('Get All Courses', async () => {
    const { getAll } = require('../app/handlers/course');

    const f = mock(CourseModel);
    f.expects('find').exactly(1).resolves([fakeCourse]);
    await expectSuccess(
      getAll,
      (data) => {
        expect(data[0]).deep.equal(fakeCourse);
      },
      fakeCourse
    );
    f.restore();
  });

  it('Course Update', async () => {
    const { updateCourse } = require('../app/handlers/course');

    const f = mock(CourseModel);
    f.expects('findById').exactly(1).resolves(fakeCourse);
    f.expects('findByIdAndUpdate').exactly(1).resolves(fakeCourse);
    await expectSuccess(
      updateCourse,
      (data) => {
        expect(data).deep.equal(fakeCourse);
      },
      fakeCourse,
      { id: fakeCourse.id }
    );
    f.restore();
  });

  it('Course Deletion', async () => {
    const { deleteCourse } = require('../app/handlers/course');

    const s = mock(CourseModel);
    s.expects('findByIdAndDelete').exactly(1).resolves(fakeCourse);
    await expectSuccess(
      deleteCourse,
      (data) => {
        expect(data).deep.equal(fakeCourse);
      },
      fakeCourse,
      { id: fakeCourse.id }
    );
    s.restore();
  });

  afterEach(() => {
    sinon.restore();
  });
});

describe('Prof course tests', () => {
  beforeEach(() => {
    delete require.cache[require.resolve('../app/handlers/course')];
    mockAuth(fakeProf);
  });

  it('Get All Courses Prof', async () => {
    const { getAllProf } = require('../app/handlers/course');

    sinon.mock(CourseModel).expects('find').resolves([fakeCourse]);

    await expectSuccess(
      getAllProf,
      (data) => {
        expect(data[0]).deep.equal(fakeCourse);
      },
      fakeCourse
    );
  });

  afterEach(() => {
    sinon.restore();
  });
});
