import { Assignment, TestCase } from './../../app/schemas/assignment.model';

export const fakeTest: TestCase = {
  input: 'fakeInput',
  output: 'fakeOutput',
  hidden: true,
} as TestCase;

export const fakeAssignment: Assignment = ({
  name: 'fakeAssignmentName',
  description: 'fakeAssignmentDescription',
  courseID: 'fakeCourseId',
  createdBy: 'fakeCognitoId',
  openDate: new Date('April-5-2021'),
  closeDate: new Date('April-30-2030'),
  lateDate: new Date('April-20-2030'),
  maxGrade: 10,
  weight: 0.05,
  attachments: [],
  questions: [],
  testCases: [fakeTest],
} as any) as Assignment;

export const invalidDateAssignment: Assignment = ({
  name: 'fakeAssignmentName',
  description: 'fakeAssignmentDescription',
  courseID: 'fakeCourseId',
  createdBy: 'fakeCognitoId',
  openDate: new Date('January-5-2011'),
  closeDate: new Date('January-30-2011'),
  lateDate: new Date('January-20-2011'),
  maxGrade: 10,
  weight: 0.05,
  attachments: [],
  questions: [],
  testCases: [fakeTest],
} as any) as Assignment;
