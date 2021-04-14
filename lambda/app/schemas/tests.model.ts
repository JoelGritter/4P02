import { Schema, model, Document } from 'mongoose';

export interface TestCase {
  input: string;
  output: string;
  hidden: boolean;
}

export interface Assignment extends Document {}

const AssignmentModel = model(
  'Assignment',
  new Schema<Assignment>({
    name: {
      type: String,
      required: true,
    },
    description: String,
    courseID: {
      type: String,
      required: [true, 'Assignment must be made for a course'],
    },
    createdBy: {
      type: String,
      required: true,
    },
    openDate: {
      type: Date,
      required: true,
    },
    closeDate: {
      type: Date,
      required: true,
    },
    lateDate: Date,
    maxGrade: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    attachments: [String],
    questions: [String],
    testCases: {
      type: [
        {
          input: String,
          output: String,
          hidden: Boolean,
        },
      ],
      default: [],
    },
  })
);

export default AssignmentModel;
