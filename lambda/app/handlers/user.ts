import { roleAuth } from './../util/wrappers';
import UserModel, { User } from './../schemas/user.model';
import { badRequest, parseBody } from '../util/rest';
import { success } from '../util/rest';
import { lambda, auth } from '../util/wrappers';

export const getAll = lambda(
  roleAuth(['admin'], async (event) => {
    const users = await UserModel.find();
    return success(users);
  })
);

// To aid with finding users for profs, only returns what's absolutely needed for the user, for now email, cognitoId
export const getAllPublic = lambda(
  roleAuth(['admin', 'prof'], async () => {
    const users = await UserModel.find();
    return success(
      users.map(({ cognitoId, email, name }) => ({
        cognitoId,
        email,
        name,
      }))
    );
  })
);

// Similar reasons to above
export const getAllProfPublic = lambda(
  roleAuth(['admin', 'prof'], async () => {
    const users = await UserModel.find({ roles: 'prof' });
    return success(
      users.map(({ cognitoId, email, name }) => ({
        cognitoId,
        email,
        name,
      }))
    );
  })
);

export const get = lambda(
  roleAuth(['admin'], async (event) => {
    const query = parseBody<any>(event);

    const res = await UserModel.findOne(query);

    if (res) {
      return success(res);
    } else {
      return badRequest('User not found!');
    }
  })
);

export const me = lambda(
  auth(async (event, context, { userDoc }) => {
    return success(userDoc);
  })
);

export const updateMe = lambda(
  auth(async (event, context, { userDoc }) => {
    const reqUser = userDoc as User;
    const newUser = parseBody<User>(event);
    const { cognitoId } = userDoc;
    // Prohibit updating some fields
    if (newUser.cognitoId) delete newUser.cognitoId;
    if (newUser.email) delete newUser.email;
    if (newUser.roles) delete newUser.roles;
    // TODO: Add some kinda validation
    const updatedUser = await UserModel.findOneAndUpdate(
      { cognitoId },
      { ...reqUser.toObject(), ...newUser },
      {
        new: true,
      }
    );
    return success(updatedUser);
  })
);

export const addAdmin = lambda(
  roleAuth(['admin'], async (event, context, { userDoc }) => {
    const reqUser = userDoc as User;
    const { cognitoId, email } = parseBody(event);

    if (cognitoId === reqUser.cognitoId) {
      return success();
    }

    const query = {} as any;

    if (cognitoId) {
      query.cognitoId = cognitoId;
    }
    if (email) {
      query.email = email;
    }
    const userToUpdate = await UserModel.findOne(query);

    if (userToUpdate) {
      const roles = userToUpdate.roles;

      if (!roles.includes('admin')) {
        roles.push('admin');
        userToUpdate.roles = roles;
        userToUpdate.save();
      }
      return success();
    } else {
      return badRequest('User not found!');
    }
  })
);

export const removeAdmin = lambda(
  roleAuth(['admin'], async (event, context, { userDoc }) => {
    const reqUser = userDoc as User;
    const { cognitoId, email } = parseBody(event);

    if (cognitoId === reqUser.cognitoId || email === reqUser.email) {
      return badRequest('Cannot remove yourself as an admin!');
    }

    const query = {} as any;

    if (!cognitoId && !email) {
      return badRequest('Cannot find user!');
    }

    if (cognitoId) {
      query.cognitoId = cognitoId;
    }
    if (email) {
      query.email = email;
    }
    const userToUpdate = await UserModel.findOne(query);

    if (userToUpdate) {
      const roles = userToUpdate.roles;

      if (roles.includes('admin')) {
        userToUpdate.roles = roles.filter((value) => value !== 'admin');
        userToUpdate.save();
      }
      return success();
    } else {
      return badRequest('Could not find user!');
    }
  })
);

export const addProf = lambda(
  roleAuth(['admin'], async (event) => {
    const { cognitoId, email } = parseBody(event);

    if (!cognitoId && !email) {
      return badRequest('Cannot find user!');
    }

    const query = {} as any;

    if (cognitoId) {
      query.cognitoId = cognitoId;
    }
    if (email) {
      query.email = email;
    }
    const userToUpdate = await UserModel.findOne(query);

    if (userToUpdate) {
      const roles = userToUpdate.roles;

      if (!roles.includes('prof')) {
        roles.push('prof');
        userToUpdate.roles = roles;
        userToUpdate.save();
      }
      return success();
    } else {
      return badRequest('User not found!');
    }
  })
);

export const removeProf = lambda(
  roleAuth(['admin'], async (event) => {
    const { cognitoId, email } = parseBody(event);

    const query = {} as any;

    if (cognitoId) {
      query.cognitoId = cognitoId;
    }
    if (email) {
      query.email = email;
    }
    const userToUpdate = await UserModel.findOne(query);

    if (userToUpdate) {
      const roles = userToUpdate.roles;

      if (roles.includes('prof')) {
        userToUpdate.roles = roles.filter((value) => value !== 'prof');
        userToUpdate.save();
      }
      return success();
    } else {
      return badRequest('Could not find user!');
    }
  })
);
