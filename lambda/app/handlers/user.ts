import { roleAuth } from "./../util/wrappers";
import UserModel, { User } from "./../schemas/user.model";
import { badRequest, internalServerError, parseBody } from "../util/rest";
import { success } from "../util/rest";
import { lambda, auth } from "../util/wrappers";

export const get = lambda(
  auth(async (event, context, { userDoc }) => {
    return success(userDoc);
  })
);

export const update = lambda(
  auth(async (event, context, { userDoc }) => {
    const user = parseBody<User>(event);
    const { cognitoId } = userDoc;
    if (user.roles) delete user.roles; // Prohibit updating this field
    // TODO: Add some kinda validation
    const updatedUser = await UserModel.updateOne({ cognitoId }, user, {
      new: true,
    });
    return success(updatedUser);
  })
);

export const addAdmin = lambda(
  roleAuth(["admin"], async (event, context, { userDoc }) => {
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

      if (!roles.includes("admin")) {
        roles.push("admin");
        userToUpdate.roles = roles;
        userToUpdate.save();
      }
      return success();
    } else {
      return badRequest("User not found!");
    }
  })
);

export const removeAdmin = lambda(
  roleAuth(["admin"], async (event, context, { userDoc }) => {
    const reqUser = userDoc as User;
    const { cognitoId, email } = parseBody(event);

    if (cognitoId === reqUser.cognitoId || email === reqUser.email) {
      return badRequest("Cannot remove yourself as an admin!");
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

      if (roles.includes("admin")) {
        userToUpdate.roles = roles.filter((value) => value !== "admin");
        userToUpdate.save();
      }
      return success();
    } else {
      return badRequest("Could not find user!");
    }
  })
);


export const addProf = lambda(
  roleAuth(["admin"], async (event, _, { userDoc }) => {
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

      if (!roles.includes("prof")) {
        roles.push("prof");
        userToUpdate.roles = roles;
        userToUpdate.save();
      }
      return success();
    } else {
      return badRequest("User not found!");
    }
  })
);

export const removeProf = lambda(
  roleAuth(["admin"], async (event) => {
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

      if (roles.includes("prof")) {
        userToUpdate.roles = roles.filter((value) => value !== "prof");
        userToUpdate.save();
      }
      return success();
    } else {
      return badRequest("Could not find user!");
    }
  })
);
