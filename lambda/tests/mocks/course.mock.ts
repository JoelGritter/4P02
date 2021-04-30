import { Course } from './../../app/schemas/course.model';
import { fakeAdminProf, fakeProf, fakeAdmin } from './user.mock';

export const fakeCourse: Course = {
  name: 'testCourse',
  currentProfessors: [fakeAdminProf.cognitoId],
} as Course;

export const emptyCourse: Course = {
  name: 'testCourse',
} as Course;
