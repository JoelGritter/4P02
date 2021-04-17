export default interface Submission {
  _id?: string;
  owner?: string; // cognitoID of submitter
  assignID?: string; // ID for assignment this submission obj belongs to
  submissionDate: Date; // date of submission
  codeZip: String;
  //attachments: string[]; // array of file ID's for student submitted attachments
  answers: string[]; // student submitted plaintext answers to assignment questions
  grade: number; // marker assigned grade
  feedback: string; // marker feedback (global to entire submission)
  outputs: string[]; // automat1ed test outputs for this submission
  testCaseResults: { [key: string]: TestCaseResult };
}

export interface TestCaseResult extends Document {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  correct: boolean;
  hidden: boolean;
}

export const emptySubmission: Submission = {
  submissionDate: new Date(),
  codeZip: '',
  answers: [],
  grade: 0,
  feedback: '',
  outputs: [],
  testCaseResults: {},
};
