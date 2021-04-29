import { Course } from './../../app/schemas/course.model';
import { fakeProf, fakeAdmin } from './user.mock';

export const fakeCourse: Course = {
  name: 'testCourse',
  currentProfessors: [fakeProf.cognitoId],
} as Course;
