import { roleAuth } from "./../util/wrappers";
import UserModel, { User } from "./../schemas/user.model";
import { badRequest, parseBody } from "../util/rest";
import { success } from "../util/rest";
import { lambdaWrapper, auth } from "../util/wrappers";

export const get = lambdaWrapper(
  auth(async (event, context, { userDoc }) => {
    return success(userDoc);
  })
);

export const update = lambdaWrapper(
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

export const addAdmin = lambdaWrapper(
  roleAuth(["admin"], async (event, context, { userDoc }) => {
    const reqUser = userDoc as User;
    const { cognitoId, email } = parseBody(event);

    if (cognitoId === reqUser.cognitoId) {
      return success();
    }

    const userToUpdate = await UserModel.findOne({ cognitoId, email });

    const roles = userToUpdate.roles;

    if (!roles.includes("admin")) {
      roles.push("admin");
      userToUpdate.roles = roles;
      userToUpdate.save();
    }
  })
);

export const removeAdmin = lambdaWrapper(
  roleAuth(["admin"], async (event, context, { userDoc }) => {
    const reqUser = userDoc as User;
    const { cognitoId, email } = parseBody(event);

    if (cognitoId === reqUser.cognitoId) {
      return badRequest("Cannot remove yourself as an admin!");
    }

    const userToUpdate = await UserModel.findOne({ cognitoId, email });

    const roles = userToUpdate.roles;

    if (roles.includes("admin")) {
      userToUpdate.roles = roles.filter((value) => value !== "admin");
      userToUpdate.save();
    }
    return success();
  })
);
