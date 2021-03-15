import { roleAuth } from './../util/wrappers';
import AssignmentModel, { Assignment } from './../schemas/assignment.model';
import { User } from './../schemas/user.model';
import { badRequest, parseBody, unauthorized } from '../util/rest';
import { success } from '../util/rest';
import { lambda } from '../util/wrappers';

export const getAll = lambda(
  roleAuth(['admin'], async (event) => {
    const courses = await AssignmentModel.find();
    return success(courses);
  })
);

export const addAssignment = lambda(
  roleAuth(['admin', 'prof'], async (event, context, { userDoc }) => {
    const newAssignment = parseBody<Assignment>(event);

    const reqUser = userDoc as User;
    const { cognitoId } = reqUser;

    //List who created a given assignment
    if (reqUser.roles.includes('prof')) {
      newAssignment.createdBy = cognitoId;
    } else {
      newAssignment.createdBy = 'admin';
    }

    const resAssignment = await AssignmentModel.create(newAssignment);
    return success(resAssignment);
  })
);

export const updateAssignment = lambda(
  roleAuth(['admin', 'prof'], async (event, context, { userDoc }) => {
    const resAssignment = await AssignmentModel.findById(
      event.pathParameters.id
    );
    const newAssignment = parseBody<Assignment>(event);

    const reqUser = userDoc as User;
    const { cognitoId } = reqUser;

    if (
      reqUser.roles.includes('admin') ||
      resAssignment.createdBy == cognitoId
    ) {
      if (newAssignment._id) delete newAssignment._id;

      // prevent prof from removing themselves as assignment creator
      if (
        newAssignment.createdBy != cognitoId &&
        newAssignment.createdBy != 'admin'
      ) {
        newAssignment.createdBy = cognitoId;
      }

      const updatedAssignment = await AssignmentModel.findByIdAndUpdate(
        event.pathParameters.id,
        newAssignment,
        {
          new: true,
        }
      );

      return success(updatedAssignment);
    } else {
      return unauthorized('Insufficient Privileges: Cannot update assignment');
    }
  })
);

export const deleteAssignment = lambda(
  roleAuth(['admin', 'prof'], async (event, context, { userDoc }) => {
    const resAssignment = await AssignmentModel.findById(
      event.pathParameters.id
    );

    const reqUser = userDoc as User;
    const { cognitoId } = reqUser;

    if (
      reqUser.roles.includes('admin') ||
      resAssignment.createdBy == cognitoId
    ) {
      const deleteRes = await AssignmentModel.findByIdAndDelete(
        event.pathParameters.id
      );

      return success(deleteRes);
    } else {
      return unauthorized('Insufficient Privileges: Cannot update assignment');
    }
  })
);

export const getAssignment = lambda(
  roleAuth(['admin', 'prof'], async (event, context, { userDoc }) => {
    const resAssignment = await AssignmentModel.findById(
      event.pathParameters.id
    );

    const reqUser = userDoc as User;
    const { cognitoId } = reqUser;

    if (
      reqUser.roles.includes('admin') ||
      resAssignment.createdBy == cognitoId
    ) {
      return success(resAssignment);
    } else {
      return unauthorized('Insufficient Privileges: Cannot access assignment');
    }
  })
);
