import { Schema, model, Document } from 'mongoose';

export interface Submission extends Document {
  owner: string; // cognitoID of submitter
  assignID: string; // ID for assignment this submission obj belongs to
  submissionDate: Date; // date of submission
  attachments: string[]; // array of file ID's for student submitted attachments
  answers: string[]; // student submitted plaintext answers to assignment questions
  grade: number; // marker assigned grade
  feedback: string; // marker feedback (global to entire submission)
  outputs: string[]; // automated test outputs for this submission
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
    attachments: [String],
    answers: [String],
    grade: Number,
    feedback: String,
    outputs: [String],
  })
);

export default SubmissionModel;