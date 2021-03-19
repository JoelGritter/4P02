import { roleAuth, auth } from './../util/wrappers';
import AssignmentModel, { Assignment } from './../schemas/assignment.model';
import CourseModel from './../schemas/course.model';
import { User } from './../schemas/user.model';
import { parseBody, unauthorized } from '../util/rest';
import { success } from '../util/rest';
import { lambda } from '../util/wrappers';

export const getAll = lambda(
  roleAuth(['admin'], async (event) => {
    const assignments = await AssignmentModel.find();
    return success(assignments);
  })
);

export const getAllCourseAssigns = lambda(
  auth(async (event, context, { userDoc }) => {
    const resCourse = await CourseModel.findById(event.pathParameters.id);

    const reqUser = userDoc as User;
    const { cognitoId } = reqUser;

    if (reqUser.roles.includes('admin') || resCourse.currentProfessors.includes(cognitoId) || resCourse.students.includes(cognitoId)){
      const assignments = await AssignmentModel.find({
        courseID: event.pathParameters.id,
      });
      return success(assignments);
    } else {
      return unauthorized('Insufficient Privileges: Cannot retrieve course assignments');
    }
  })
);

export const addAssignment = lambda(
  roleAuth(['admin', 'prof'], async (event, context, { userDoc }) => {
    const newAssignment = parseBody<Assignment>(event);
    const resCourse = await CourseModel.findById(newAssignment.courseID);

    const reqUser = userDoc as User;
    const { cognitoId } = reqUser;

    //List who created a given assignment
    newAssignment.createdBy = cognitoId;

    if (
      reqUser.roles.includes('admin') ||
      resCourse.currentProfessors.includes(cognitoId)
    ) {
      const resAssignment = await AssignmentModel.create(newAssignment);
      return success(resAssignment);
    } else {
      return unauthorized(
        'Insufficient Privileges: Cannot add assignment to course'
      );
    }
  })
);

export const updateAssignment = lambda(
  roleAuth(['admin', 'prof'], async (event, context, { userDoc }) => {
    const resAssignment = await AssignmentModel.findById(
      event.pathParameters.id
    );
    const newAssignment = parseBody<Assignment>(event);
    const resCourse = await CourseModel.findById(resAssignment.courseID);

    const reqUser = userDoc as User;
    const { cognitoId } = reqUser;

    if (
      reqUser.roles.includes('admin') ||
      resAssignment.createdBy === cognitoId ||
      resCourse.currentProfessors.includes(cognitoId)
    ) {
      if (newAssignment._id) delete newAssignment._id;

      // maintain assignment creator
      newAssignment.createdBy = resAssignment.createdBy;

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
    const resCourse = await CourseModel.findById(resAssignment.courseID);

    const reqUser = userDoc as User;
    const { cognitoId } = reqUser;

    if (
      reqUser.roles.includes('admin') ||
      resAssignment.createdBy === cognitoId ||
      resCourse.currentProfessors.includes(cognitoId)
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
    const resCourse = await CourseModel.findById(resAssignment.courseID);

    const reqUser = userDoc as User;
    const { cognitoId } = reqUser;

    if (
      reqUser.roles.includes('admin') ||
      resAssignment.createdBy === cognitoId ||
      resCourse.currentProfessors.includes(cognitoId)
    ) {
      return success(resAssignment);
    } else {
      return unauthorized('Insufficient Privileges: Cannot access assignment');
    }
  })
);
