import {
  Submission,
  TestCaseResult,
} from './../../app/schemas/submission.model';

export const fakeTestCaseResult: TestCaseResult = {
  input: '2',
  expectedOutput: '3',
  actualOutput: '3',
  correct: true,
  hidden: false,
} as TestCaseResult;

export const fakeSubmission: Submission = ({
  owner: 'fakeCognitoId',
  assignID: 'fakeAssignmentId',
  submissionDate: new Date('April-15-2021'),
  codeZip: 'fakeCodeZip',
  answers: [],
  grade: 0,
  feedback: '',
  outputs: [],
  testCaseResults: { key: fakeTestCaseResult },
} as any) as Submission;

export const nullGradeSubmission: Submission = ({
  owner: 'fakeCognitoId',
  assignID: 'fakeAssignmentId',
  submissionDate: new Date('April-15-2021'),
  codeZip: 'fakeCodeZip',
  answers: [],
  grade: null,
  feedback: '',
  outputs: [],
  testCaseResults: { key: fakeTestCaseResult },
} as any) as Submission;

export const nullOwnerSubmission: Submission = ({
  owner: null,
  assignID: 'fakeAssignmentId',
  submissionDate: new Date('April-15-2021'),
  codeZip: 'fakeCodeZip',
  answers: [],
  grade: null,
  feedback: '',
  outputs: [],
  testCaseResults: { key: fakeTestCaseResult },
} as any) as Submission;
