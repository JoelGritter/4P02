import { Course } from './../../app/schemas/course.model';
import { fakeProf, fakeProf2, fakeAdmin } from './user.mock';

export const fakeCourse: Course = {
  name: 'testCourse',
  currentProfessors: [fakeProf.cognitoId],
} as Course;

export const fakeCourse2: Course = {
  name: 'testCourse',
  currentProfessors: [fakeProf.cognitoId],
  students: ['fakeCognitoId'],
} as Course;

export const fakeCourse3: Course = {
  name: 'testCourse3',
  currentProfessors: [fakeProf2.cognitoId],
  moderators: ['fakeModCognitoId'],
  students: ['fakeStudentCognitoId'],
} as Course;
