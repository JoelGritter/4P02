import { roleAuth, auth } from './../util/wrappers';
import AssignmentModel, { Assignment } from './../schemas/assignment.model';
import SubmissionModel, {
  filterSubmissionForStudent,
  Submission,
} from './../schemas/submission.model';
import CourseModel from './../schemas/course.model';
import { User } from './../schemas/user.model';
import { badRequest, parseBody, unauthorized } from '../util/rest';
import { success } from '../util/rest';
import { lambda } from '../util/wrappers';

// these functions are really just an extension of the assignment API

// get all submissions in collection
export const getAll = lambda(
  roleAuth(['admin'], async (event) => {
    const submissions = await SubmissionModel.find();
    return success(submissions);
  })
);

// get individual student submission for given assignment
export const getMySubmission = lambda(
  auth(async (event, context, { userDoc }) => {
    const { assignmentId } = event.pathParameters;
    const reqUser = userDoc as User;
    const { cognitoId } = reqUser;
    const submission = await SubmissionModel.findOne({
      owner: cognitoId,
      assignID: assignmentId,
    });

    if (!submission) {
      return badRequest('Could not find submission!');
    }

    return success(filterSubmissionForStudent(submission));
  })
);

// returns all submissions for given assignment - for admins, mods, profs
export const getAssignmentSubmissions = lambda(
  auth(async (event, context, { userDoc }) => {
    const aID = event.pathParameters.id;
    const reqUser = userDoc as User;
    const assignment = await AssignmentModel.findById(aID);
    if (await validateElevatedPrivileges(assignment, reqUser)) {
      const subs = await SubmissionModel.find({
        assignID: aID,
      });
      return success(subs);
    } else
      return unauthorized(
        'Insufficient privileges: cannot retrieve submissions'
      );
  })
);

// creates or updates (upserts) submission for current assignment
// submit functionality should probably be restricted from non-students on frontend
export const submit = lambda(
  auth(async (event, context, { userDoc }) => {
    const aID = event.pathParameters.id;
    const reqUser = userDoc as User;
    const { cognitoId } = reqUser;
    const sub = parseBody<Submission>(event);

    sub.owner = cognitoId;
    sub.assignID = aID;
    sub.submissionDate = new Date(); // Handle sub date on backend -> circumvent frontend canoodling
    sub.grade = 0; // students trying to give themselves a grade? HA! Get dunked on kiddo.
    sub.feedback = '';

    // validate submission date
    const assign = await AssignmentModel.findById(aID);
    if (
      sub.submissionDate < assign.openDate ||
      sub.submissionDate > assign.closeDate
    ) {
      return badRequest('Cannot submit: not within submission interval');
    }

    // find if submission for this assignment from this user already exists
    const updatedSubmission = await SubmissionModel.findOneAndUpdate(
      {
        owner: cognitoId,
        assignID: aID,
      },
      sub,
      {
        new: true,
        upsert: true,
      }
    );
    return success(filterSubmissionForStudent(updatedSubmission));
  })
);

// updates submission for given assignment with specified owner with grade + feedback
export const grade = lambda(
  auth(async (event, context, { userDoc }) => {
    const aID = event.pathParameters.id;
    const reqUser = userDoc as User;
    const { cognitoId } = reqUser;
    const graded = parseBody<Submission>(event);
    const assignment = await AssignmentModel.findById(aID);
    if (await validateElevatedPrivileges(assignment, reqUser)) {
      // submission grade mandatory - feedback optional
      if (!graded.grade)
        return badRequest('Cannot grade: submission grade required');
      if (!graded.owner)
        return badRequest('Cannot grade: submission owner cannot be anonymous');

      // prevent modification of user submitted properties
      delete graded.answers;
      delete graded.assignID;
      delete graded.codeZip;
      //delete graded.attachments;
      delete graded.submissionDate;

      const updatedSubmission = await SubmissionModel.findOneAndUpdate(
        {
          owner: graded.owner,
          assignID: aID,
        },
        graded,
        {
          new: true,
        }
      );
      return success(updatedSubmission);
    } else
      return unauthorized(
        'Cannot grade assignment: elevated course privileges required'
      );
  })
);

// deletes all submissions that correspond to given assignment id
// to be used in conjunction w/ deletion of an assignment
export const deleteAssignmentSubmissions = lambda(
  roleAuth(['admin', 'prof'], async (event, context, { userDoc }) => {
    const aID = event.pathParameters.id;
    const reqUser = userDoc as User;
    const { cognitoId } = reqUser;
    const resAssignment = await AssignmentModel.findById(aID);
    const resCourse = await CourseModel.findById(resAssignment.courseID);
    if (
      reqUser.roles.includes('admin') ||
      resAssignment.createdBy === cognitoId ||
      resCourse.currentProfessors.includes(cognitoId)
    ) {
      const deleteSubs = await SubmissionModel.deleteMany({
        assignID: aID,
      });
      return success(deleteSubs);
    } else {
      return unauthorized('Insufficient Privileges: Cannot delete submissions');
    }
  })
);

/*======================*/
/*** HELPER FUNCTIONS ***/
/*======================*/

// verifies that current user is authorized to view other students assignment submissions
export async function validateElevatedPrivileges(
  assignment: Assignment,
  reqUser: User
) {
  const resCourse = await CourseModel.findById(assignment.courseID);
  if (
    reqUser.roles.includes('admin') ||
    resCourse.currentProfessors.includes(reqUser.cognitoId) ||
    resCourse.moderators.includes(reqUser.cognitoId)
  )
    return true;
  else return false;
}
