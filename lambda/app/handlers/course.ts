import { roleAuth } from "./../util/wrappers";
import CourseModel, { Course } from "./../schemas/course.model";
import { User } from "./../schemas/user.model";
import { badRequest, parseBody, unauthorized } from "../util/rest";
import { success } from "../util/rest";
import { lambda } from "../util/wrappers";

export const getAll = lambda(roleAuth(['admin'], async (event) => {
	const courses = await CourseModel.find();
	return success(courses);
}));

export const addCourse = lambda(roleAuth(['admin', 'prof'], async (event, context, { userDoc }) => {
	const newCourse = parseBody<Course>(event);

	const reqUser = userDoc as User;
	const { cognitoId } = reqUser;

	// add current user to this new course if user is prof
	if(reqUser.roles.includes('prof')){
		newCourse.currentProfessors.push(cognitoId);
	}

	const resCourse = await CourseModel.create(newCourse);
	return success(resCourse);
}));

export const updateCourse = lambda(roleAuth(['admin', 'prof'], async (event, context, { userDoc }) => {
	const resCourse = await CourseModel.findById(event.pathParameters.id);
	const newCourse = parseBody<Course>(event);

	const reqUser = userDoc as User;
	const { cognitoId } = reqUser;

	if(reqUser.roles.includes('admin') || resCourse.currentProfessors.includes(cognitoId)){
		if(newCourse._id) delete newCourse._id;

		// prevent professor from removing themselves from course
		if(!newCourse.currentProfessors.includes(cognitoId)){
			newCourse.currentProfessors.push(cognitoId);
		}

		const updatedCourse = await CourseModel.findByIdAndUpdate(event.pathParameters.id, newCourse, {
			new: true,
		});

		return success(updatedCourse);
	} else {
		return unauthorized("Insufficient Privileges: Cannot update course");
	}
}));

export const deleteCourse = lambda(roleAuth(['admin'], async (event) => {
	return badRequest("Unsupported: Cannot delete course");
}));

export const getCourse = lambda(roleAuth(['admin', 'prof'], async (event, context, { userDoc }) => {
	const resCourse = await CourseModel.findById(event.pathParameters.id);

	const reqUser = userDoc as User;
	const { cognitoId } = reqUser;

	if(reqUser.roles.includes('admin') || resCourse.currentProfessors.includes(cognitoId)){
		return success(resCourse);
	} else {
		return unauthorized("Insufficient Privileges: Cannot access course");
	}
}));