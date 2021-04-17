import { roleAuth, auth } from './../util/wrappers';
import AssignmentModel, {
  Assignment,
  filterAssignmentForStudent,
} from './../schemas/assignment.model';
import SubmissionModel, { Submission } from './../schemas/submission.model';
import CourseModel from './../schemas/course.model';
import { User } from './../schemas/user.model';
import { badRequest, parseBody, unauthorized } from '../util/rest';
import { success } from '../util/rest';
import { lambda } from '../util/wrappers';

export const getAll = lambda(
  roleAuth(['admin'], async (event) => {
    const assignments = await AssignmentModel.find();
    return success(assignments);
  })
);

// returns all assignments for single course
export const getAllCourseAssigns = lambda(
  auth(async (event, context, { userDoc }) => {
    const resCourse = await CourseModel.findById(event.pathParameters.id);

    const reqUser = userDoc as User;
    const { cognitoId } = reqUser;

    if (
      reqUser.roles.includes('admin') ||
      resCourse.currentProfessors.includes(cognitoId) ||
      resCourse.moderators.includes(cognitoId)
    ) {
      const assignments = await AssignmentModel.find({
        courseID: event.pathParameters.id,
      });
      return success(assignments);
    } else if (resCourse.students.includes(cognitoId)) {
      const assignments = await AssignmentModel.find({
        courseID: event.pathParameters.id,
      });
      const filtered = assignments.map(filterAssignmentForStudent);
      return success([...filtered]);
    } else {
      return unauthorized(
        'Insufficient Privileges: Cannot retrieve course assignments'
      );
    }
  })
);

// get assignments of current user, if user is a student (get courses of student, then get assignments of those courses)
export const getMyAssigns = lambda(
  auth(async (event, context, { userDoc }) => {
    const reqUser = userDoc as User;

    const userCourses = await CourseModel.find({
      students: userDoc.cognitoId,
    });

    let result: Assignment[] = [];

    await Promise.all(
      userCourses.map(async (course) => {
        const assignments = await AssignmentModel.find({
          courseID: course._id,
        });
        result = [...result, ...assignments];
      })
    );

    return success(result.map(filterAssignmentForStudent));
  })
);

export const addAssignment = lambda(
  roleAuth(['admin', 'prof'], async (event, context, { userDoc }) => {
    const newAssignment = parseBody<Assignment>(event);
    const resCourse = await CourseModel.findById(newAssignment.courseID);

    const reqUser = userDoc as User;
    const { cognitoId } = reqUser;

    newAssignment.createdBy = cognitoId; //List who created a given assignment
    if (!newAssignment.openDate) newAssignment.openDate = new Date();
    // default open date is now, default close date is 24hrs from now
    else newAssignment.openDate = new Date(newAssignment.openDate);
    if (!newAssignment.closeDate) {
      newAssignment.closeDate = new Date();
      newAssignment.closeDate.setDate(newAssignment.openDate.getDate() + 1);
    } else newAssignment.closeDate = new Date(newAssignment.closeDate);
    if (newAssignment.lateDate)
      newAssignment.lateDate = new Date(newAssignment.lateDate);
    if (!newAssignment.maxGrade) newAssignment.maxGrade = 100.0; // default grade scale to 100 points (percentage compatibility)
    if (!newAssignment.weight) newAssignment.weight = 0.05; // default assignment weight to 5% (idk why, don't ask)
    let errmsg = validateAssignDetails(newAssignment); // validate assignment property values
    if (errmsg != null) return badRequest(errmsg);

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

      // maintain assignment creator and validate dates
      newAssignment.createdBy = resAssignment.createdBy;
      newAssignment.openDate
        ? (newAssignment.openDate = new Date(newAssignment.openDate))
        : (newAssignment.openDate = resAssignment.openDate);
      newAssignment.closeDate
        ? (newAssignment.closeDate = new Date(newAssignment.closeDate))
        : (newAssignment.closeDate = resAssignment.closeDate);
      if (newAssignment.lateDate === undefined)
        newAssignment.lateDate = resAssignment.lateDate;
      if (newAssignment.lateDate == null) {
      } else if (newAssignment)
        newAssignment.lateDate = new Date(newAssignment.lateDate);
      let errmsg = validateAssignDetails(newAssignment);
      if (errmsg != null) return badRequest(errmsg);

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
      // delete assignment and all associated submissions
      const deleteRes = await AssignmentModel.findByIdAndDelete(
        event.pathParameters.id
      );
      return success(deleteRes);
    } else {
      return unauthorized('Insufficient Privileges: Cannot update assignment');
    }
  })
);

// returns a specific assignment for a specific course for an admin or professor
export const getAssignment = lambda(
  auth(async (event, context, { userDoc }) => {
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
    } else if (resCourse.students.includes(cognitoId)) {
      return success(filterAssignmentForStudent(resAssignment));
    } else {
      return unauthorized('Insufficient Privileges: Cannot access assignment');
    }
  })
);

/*======================*/
/*** HELPER FUNCTIONS ***/
/*======================*/

// validate assignment dates for sensibility
export function validateAssignDetails(assign: Assignment) {
  // check sensible selection for dates
  if (assign.closeDate < assign.openDate) {
    return 'Operation failed: Assignment close date must be after open date';
  }
  if (
    assign.lateDate &&
    (assign.lateDate < assign.openDate || assign.lateDate > assign.closeDate)
  ) {
    return 'Operation failed: Assignment late date must be between open and close dates';
  }
  if (assign.maxGrade < 1) {
    return 'Assignment must be worth at least 1 mark';
  }
  // zero weight assignments are a judgement call, perhaps could come in handy
  if (!(assign.weight >= 0 && assign.weight <= 1.0)) {
    return 'Assignment must account for a percentage of course grade within 0% - 100% range';
  }
  return null;
}
