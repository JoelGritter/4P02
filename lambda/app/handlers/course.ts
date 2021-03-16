import { roleAuth } from './../util/wrappers';
import CourseModel, { Course } from './../schemas/course.model';
import UserModel, { User } from './../schemas/user.model';
import { badRequest, parseBody, unauthorized } from '../util/rest';
import { success } from '../util/rest';
import { lambda } from '../util/wrappers';

export const getAll = lambda(
  roleAuth(['admin'], async (event) => {
    const courses = await CourseModel.find();
    return success(courses);
  })
);

export const getAllProf = lambda(
  roleAuth(['prof'], async (event, context, { userDoc }) => {
    console.log({
      currentProfessors: userDoc.cognitoId,
    });
    const courses = await CourseModel.find({
      currentProfessors: userDoc.cognitoId,
    });
    return success(courses);
  })
);

// Retrieves a list of all courses in which the current
// user is a student, prof, or moderator
export const getAssociated = lambda(
  roleAuth(
    ['student', 'admin', 'prof'],
    async (event, context, { userDoc }) => {
      const cognitoId = userDoc.cognitoId;
      const courses = await CourseModel.find({
        $or: [
          { currentProfessors: cognitoId },
          { currentModerators: cognitoId },
          { currentStudents: cognitoId },
        ],
      });
      return success(courses);
    }
  )
);

export const addCourse = lambda(
  roleAuth(['admin', 'prof'], async (event, context, { userDoc }) => {
    const newCourse = parseBody<Course>(event);

    const reqUser = userDoc as User;
    const { cognitoId } = reqUser;

    // add current user to this new course if user is prof
    if (reqUser.roles.includes('prof')) {
      if (!newCourse.currentProfessors) {
        newCourse.currentProfessors = [];
      }
      newCourse.currentProfessors.push(cognitoId);
    }
    const resCourse = await CourseModel.create(newCourse);
    return success(resCourse);
  })
);

export const updateCourse = lambda(
  roleAuth(['admin', 'prof'], async (event, context, { userDoc }) => {
    const resCourse = await CourseModel.findById(event.pathParameters.id);
    const newCourse = parseBody<Course>(event);

    const reqUser = userDoc as User;
    const { cognitoId } = reqUser;

    // reject update if student capacity exceeded or added moderator is
    // already a student registered in the class
    if (newCourse.students.length > newCourse.studentCapacity) {
      return unauthorized('Student Limit Exceeded: Cannot update course');
    }
    let intersection = newCourse.moderators.filter((x) =>
      newCourse.students.includes(x)
    );
    if (intersection.length > 0)
      return unauthorized(
        'Student-Moderator Intersection: Cannot update course'
      );

    if (
      reqUser.roles.includes('admin') ||
      resCourse.currentProfessors.includes(cognitoId)
    ) {
      if (newCourse._id) delete newCourse._id;

      // prevent professor from removing themselves from course
      if (!newCourse.currentProfessors.includes(cognitoId)) {
        newCourse.currentProfessors.push(cognitoId);
      }

      const updatedCourse = await CourseModel.findByIdAndUpdate(
        event.pathParameters.id,
        newCourse,
        {
          new: true,
        }
      );

      return success(updatedCourse);
    } else {
      return unauthorized('Insufficient Privileges: Cannot update course');
    }
  })
);

export const deleteCourse = lambda(
  roleAuth(['admin'], async (event) => {
    return badRequest('Unsupported: Cannot delete course');
  })
);

export const getCourse = lambda(
  roleAuth(['admin', 'prof'], async (event, context, { userDoc }) => {
    const resCourse = await CourseModel.findById(event.pathParameters.id);

    const reqUser = userDoc as User;
    const { cognitoId } = reqUser;

    if (
      reqUser.roles.includes('admin') ||
      resCourse.currentProfessors.includes(cognitoId)
    ) {
      return success(resCourse);
    } else {
      return unauthorized('Insufficient Privileges: Cannot access course');
    }
  })
);
