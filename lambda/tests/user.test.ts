import { fakeUser } from './mocks/user.mock';
import { mockAuth, usesDb, expectSuccess } from './mocks/mockUtils';
mockAuth();
import { mock } from 'sinon';
import { me, updateMe } from './../app/handlers/user';
import { expect } from 'chai';
import UserModel from '../app/schemas/user.model';

describe('Logged in user', () => {
  before(() => {
    usesDb();
  });

  it('Get current logged in user', async () => {
    await expectSuccess(me, (data) => {
      expect(data).deep.equal(fakeUser);
    });
  });

  it('Update your own profile', async () => {
    const s = mock(UserModel);
    s.expects('findOneAndUpdate').exactly(1).resolves(fakeUser);
    await expectSuccess(
      updateMe,
      (data) => {
        expect(data).deep.equal(fakeUser);
      },
      fakeUser
    );
  });
});
