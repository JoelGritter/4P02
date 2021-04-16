import { Schema, model, Document } from 'mongoose';
import { filterAssignmentForStudent } from './assignment.model';

export interface TestCaseResult extends Document {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  correct: boolean;
  hidden: boolean;
}

export interface Submission extends Document {
  owner: string; // cognitoID of submitter
  assignID: string; // ID for assignment this submission obj belongs to
  submissionDate: Date; // date of submission
  codeZip: string;
  //attachments: string[]; // array of file ID's for student submitted attachments
  answers: string[]; // student submitted plaintext answers to assignment questions
  grade: number; // marker assigned grade
  feedback: string; // marker feedback (global to entire submission)
  outputs: string[]; // automated test outputs for this submission
  testCaseResults: { [key: string]: TestCaseResult };
}

export function filterSubmissionForStudent(submission: Submission): Submission {
  const testCaseResults = { ...submission.testCaseResults };
  for (const key in testCaseResults) {
    const resCase = { ...testCaseResults[key] };
    if (resCase.hidden) {
      delete resCase.input;
      delete resCase.expectedOutput;
      delete resCase.actualOutput;
    }
    testCaseResults[key] = resCase as any;
  }
  return { ...submission.toObject(), testCaseResults } as Submission;
}

const SubmissionModel = model(
  'Submission',
  new Schema<Submission>({
    owner: {
      type: String,
      required: true,
    },
    assignID: {
      type: String,
      required: true,
    },
    submissionDate: {
      type: Date,
      required: true,
    },
    codeZip: String,
    //attachments: [String],
    answers: [String],
    grade: Number,
    feedback: String,
    outputs: [String],
    testCaseResults: {
      type: Object,
      default: {},
    },
  })
);

export default SubmissionModel;
