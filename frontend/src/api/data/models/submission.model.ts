export default interface Submission {
  _id?: string;
  _owner?: string; // cognitoID of submitter
  assignID?: string; // ID for assignment this submission obj belongs to
  submissionDate: Date; // date of submission
  codeZip: String;
  //attachments: string[]; // array of file ID's for student submitted attachments
  answers: string[]; // student submitted plaintext answers to assignment questions
  grade: number; // marker assigned grade
  feedback: string; // marker feedback (global to entire submission)
  outputs: string[]; // automated test outputs for this submission
}

export const emptySubmission: Submission = {
  submissionDate: new Date(),
  codeZip: '',
  answers: [],
  grade: 0,
  feedback: '',
  outputs: [],
};
