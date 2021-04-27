import { nanoid } from 'nanoid';

export default interface Assignment {
  _id?: string;
  name: string; // Assignment title
  description: string; // assignment description
  courseID?: string; // id of course this assignment belongs to
  createdBy?: string; // cognitoId of assignment creator
  openDate: Date; // date upon which this assignment appears to students (and submissions are accepted)
  closeDate: Date; // date after which no more submissions are allowed
  lateDate?: Date | null; // date after which a submission is deemed late - must be in between open and close date [OPTIONAL - no late = no lates accepted]
  maxGrade: number; // grade corresponding to 100% on this assignment
  weight: number; // percentage weight of final mark for this assignment
  attachments: string[]; // File ID's for attached files
  questions: string[]; // Plaintext questions for this assignment
  testCases: TestCase[];
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
  testCases: [],
};

export interface TestCase {
  _id?: string;
  id?: string; // Front end needs
  input: string;
  output: string;
  hidden: boolean;
}

export function emptyTestCaseWithNewId(): TestCase {
  return {
    input: '',
    output: '',
    hidden: true,
    id: nanoid(),
  };
}

export const sampleAssignment: Assignment = {
  _id: 'fakeAssignmentId',
  name: 'Fake Assignment Name',
  description: 'Fake Assignment Description',
  courseID: 'fakeCourseId',
  createdBy: 'fakeProfCognitoId',
  openDate: new Date('January 1 2021'),
  closeDate: new Date('January 1, 2050'),
  maxGrade: 5,
  weight: 0.2,
  attachments: [],
  questions: [],
  testCases: [
    {
      _id: 'fakeTestCaseId',
      input: 'Fake Input',
      output: 'Fake Output',
      hidden: false,
    },
  ],
};
