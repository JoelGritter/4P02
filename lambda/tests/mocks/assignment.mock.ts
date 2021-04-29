import { Assignment, TestCase } from './../../app/schemas/assignment.model';

export const fakeTestCase: TestCase = {
  input: '2',
  output: '3',
  hidden: false,
} as TestCase;

export const fakeAssignment: Assignment = ({
  name: 'fakeAssignmentName',
  description: 'fakeAssignmentDescription',
  courseID: 'fakeCourseId',
  createdBy: 'fakeCognitoId',
  openDate: new Date('April-5-2021'),
  closeDate: new Date('April-30-2021'),
  lateDate: new Date('April-20-2021'),
  maxGrade: 10,
  weight: 0.05,
  attachments: [],
  questions: [],
  testCases: [fakeTestCase],
} as any) as Assignment;
