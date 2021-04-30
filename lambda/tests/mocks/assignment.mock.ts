import { Assignment, TestCase } from './../../app/schemas/assignment.model';

export const fakeTest: TestCase = {
  input: 'fakeInput',
  output: 'fakeOutput',
  hidden: true,
} as TestCase;

export const fakeAssignment: Assignment = {
  name: 'fakeAssignment',
  description: 'fakeDescription',
  courseID: 'fakeID',
  createdBy: 'fakeProfessor',
  openDate: new Date(),
  closeDate: new Date(),
  lateDate: new Date(),
  maxGrade: 50,
  weight: 0.1,
  attachments: [],
  questions: ['Why?'],
  testCases: [fakeTest],
} as Assignment;
