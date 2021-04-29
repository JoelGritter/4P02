import { fakeAdmin } from './mocks/user.mock';
import { fakeCourse } from './mocks/course.mock';
import { mockAuth, usesDb, expectSuccess } from './mocks/mockUtils';
mockAuth(fakeAdmin);
import { mock } from 'sinon';
import {
  addCourse,
  deleteCourse,
  updateCourse,
  getCourse,
  getAllAssociated,
  getAll,
  getAllProf,
} from './../app/handlers/course';
import { expect } from 'chai';
import CourseModel from '../app/schemas/course.model';

describe('Logged in user', () => {
  before(() => {
    usesDb();
  });

  it('Course Creation', async () => {
    const s = mock(CourseModel);
    s.expects('create').exactly(1).resolves(fakeCourse);
    await expectSuccess(
      addCourse,
      (data) => {
        expect(data).deep.equal(fakeCourse);
      },
      fakeCourse
    );
  });

  it('Course Get', async () => {
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
  });

  //Switch account to Prof?
  it('Get All Associated Courses', async () => {
    const f = mock(CourseModel);
    f.expects('find').exactly(3).resolves(fakeCourse);
    await expectSuccess(
      getAllAssociated,
      (data) => {
        expect(data).deep.equal(fakeCourse);
      },
      fakeCourse
    );
  });

  it('Get All Courses', async () => {
    await expectSuccess(
      getAll,
      (data) => {
        expect(data).deep.equal(fakeCourse);
      },
      fakeCourse
    );
  });

  //Swap to Prof
  /*it('Get All Courses Prof', async () => {
    await expectSuccess(
        getAllProf,
        (data) => {
          expect(data).deep.equal(fakeCourse);
        },
        fakeCourse,
      );
  });*/

  it('Course Update', async () => {
    const f = mock(CourseModel);
    const s = mock(CourseModel);
    f.expects('findById').exactly(1).resolves(fakeCourse);
    s.expects('findByIdAndUpdate').exactly(1).resolves(fakeCourse);
    await expectSuccess(
      updateCourse,
      (data) => {
        expect(data).deep.equal(fakeCourse);
      },
      fakeCourse,
      { id: fakeCourse.id }
    );
  });

  it('Course Deletion', async () => {
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
  });
});
