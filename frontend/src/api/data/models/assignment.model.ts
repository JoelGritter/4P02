export default interface Assignment {
  _id?: string;
  name: string; // Assignment title
  description: string; // assignment description
  courseID?: string; // id of course this assignment belongs to
  createdBy?: string; // cognitoId of assignment creator
  openDate: Date; // date upon which this assignment appears to students (and submissions are accepted)
  closeDate: Date; // date after which no more submissions are allowed
  lateDate: Date; // date after which a submission is deemed late - must be in between open and close date [OPTIONAL - no late = no lates accepted]
  maxGrade: number; // grade corresponding to 100% on this assignment
  weight: number; // percentage weight of final mark for this assignment
  attachments: string[]; // File ID's for attached files
  questions: string[]; // Plaintext questions for this assignment
  testInputs: string[]; // inputs for automated code testing
  testOutputs: string[]; // expected outputs for automated testing
}

export const emptyAssignment: Assignment = {
  name: '',
  description: '',
  openDate: new Date(),
  closeDate: new Date(),
  lateDate: new Date(),
  maxGrade: 0,
  weight: 0,
  attachments: [],
  questions: [],
  testInputs: [],
  testOutputs: [],
};
