import { fakeUser, fakeAdmin, fakeProf } from './mocks/user.mock';
import {
  clearRequireCache,
  expectSuccess,
  mockAuth,
  usesDb,
} from './mocks/mockUtils';
import sinon, { mock } from 'sinon';
import { expect } from 'chai';
import UserModel from '../app/schemas/user.model';

describe('User tests', () => {
  before(() => {
    clearRequireCache();
    usesDb();
    mockAuth(fakeAdmin);
  });

  it('Get current logged in user', async () => {
    const { me } = require('../app/handlers/user');
    await expectSuccess(me, (data) => {
      expect(data).deep.equal(fakeAdmin);
    });
  });

  it('Add user as prof', async () => {
    const { addProf } = require('../app/handlers/user');
    const s = mock(UserModel);
    s.expects('findOne').exactly(1).resolves(fakeProf);
    await expectSuccess(
      addProf,
      (data) => {
        expect(data).deep.equal(undefined);
      },
      fakeProf
    );
    s.restore();
  });

  it('Remove user as prof', async () => {
    const { addAdmin } = require('../app/handlers/user');
    const s = mock(UserModel);
    s.expects('findOne').exactly(1).resolves(fakeUser);
    await expectSuccess(
      addAdmin,
      (data) => {
        expect(data).deep.equal(undefined);
      },
      fakeUser
    );
    s.restore();
  });

  it('Add user as admin', async () => {
    const { addAdmin } = require('../app/handlers/user');
    const f = mock(UserModel);
    f.expects('findOne').exactly(1).resolves(fakeAdmin);
    await expectSuccess(
      addAdmin,
      (data) => {
        expect(data).deep.equal(undefined);
      },
      fakeAdmin
    );
    f.restore();
  });

  it('Remove user as admin', async () => {
    const { removeAdmin } = require('../app/handlers/user');
    const g = mock(UserModel);
    g.expects('findOne').exactly(1).resolves(fakeUser);
    await expectSuccess(
      removeAdmin,
      (data) => {
        expect(data).deep.equal(undefined);
      },
      fakeUser
    );
    g.restore();
  });

  it('Get all profs', async () => {
    const { getAllProfPublic } = require('../app/handlers/user');
    const s = mock(UserModel);
    s.expects('find').exactly(1).resolves([fakeProf]);
    await expectSuccess(getAllProfPublic, (data) => {
      expect(data).deep.equal([
        {
          cognitoId: fakeProf.cognitoId,
          email: fakeProf.email,
          name: fakeProf.name,
        },
      ]);
    });
    s.restore();
  });

  it('Get all users', async () => {
    const { getAll } = require('../app/handlers/user');
    const s = mock(UserModel);
    s.expects('find').exactly(1).resolves([fakeUser, fakeAdmin, fakeProf]);
    await expectSuccess(getAll, (data) => {
      expect(data).deep.equal([fakeUser, fakeAdmin, fakeProf]);
    });
    s.restore();
  });

  it('Get all users public', async () => {
    const { getAllPublic } = require('../app/handlers/user');
    const s = mock(UserModel);
    s.expects('find').exactly(1).resolves([fakeUser, fakeAdmin, fakeProf]);
    await expectSuccess(getAllPublic, (data) => {
      expect(data).deep.equal([
        {
          cognitoId: fakeUser.cognitoId,
          email: fakeUser.email,
          name: fakeUser.name,
        },
        {
          cognitoId: fakeAdmin.cognitoId,
          email: fakeAdmin.email,
          name: fakeAdmin.name,
        },
        {
          cognitoId: fakeProf.cognitoId,
          email: fakeProf.email,
          name: fakeProf.name,
        },
      ]);
    });
    s.restore();
  });

  it('Get user by User Object', async () => {
    const { get } = require('../app/handlers/user');
    const s = mock(UserModel);
    s.expects('findOne').exactly(1).resolves(fakeAdmin);
    await expectSuccess(
      get,
      (data) => {
        expect(data).deep.equal(fakeAdmin);
      },
      fakeAdmin
    );
    s.restore();
  });

  it('Get user by cognitoID', async () => {
    const { getPublic } = require('../app/handlers/user');
    const s = mock(UserModel);
    s.expects('findOne').exactly(1).resolves(fakeAdmin);
    await expectSuccess(
      getPublic,
      (data) => {
        expect(data).deep.equal(fakeAdmin);
      },
      fakeAdmin,
      { id: fakeAdmin.cognitoId }
    );
    s.restore();
  });

  it('Update your own profile', async () => {
    const { updateMe } = require('../app/handlers/user');
    const s = mock(UserModel);
    s.expects('findOneAndUpdate').exactly(1).resolves(fakeAdmin);
    await expectSuccess(
      updateMe,
      (data) => {
        expect(data).deep.equal(fakeAdmin);
      },
      fakeAdmin
    );
  });

  after(() => {
    sinon.restore();
  });
});
