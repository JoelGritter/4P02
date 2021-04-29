import { expect } from 'chai';
import { fakeCourse } from './mocks/course.mock';
import { fakeProf, fakeAdmin } from './mocks/user.mock';
import {
  clearRequireCache,
  expectSuccess,
  mockAuth,
  usesDb,
} from './mocks/mockUtils';
import sinon from 'sinon';

//Swap to Prof
describe('Prof course tests', () => {
  before(() => {
    clearRequireCache();
    usesDb();
    mockAuth(fakeProf);
  });

  it('Get All Courses Prof', async () => {
    const { getAllProf } = require('../app/handlers/course');

    await expectSuccess(
      getAllProf,
      (data) => {
        expect(data).deep.equal(fakeCourse);
      },
      fakeCourse
    );
  });
  after(() => {
    sinon.restore();
  });
});
