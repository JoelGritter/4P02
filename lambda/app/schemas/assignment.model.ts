import { Schema, model, Document } from 'mongoose';

export interface Assignment extends Document {
  name: string;
  courseID: string;
  createdBy: string;
  dueDate: Date;
  posted: boolean; // Indicates if assignment is viewable or not
}

const AssignmentModel = model(
  'Assignment',
  new Schema<Assignment>({
    name: {
      type: String,
      required: true,
    },
    courseID: {
      type: String,
      required: [true, 'Assignment must be made for a course'],
    },
    createdBy: {
      type: String,
      required: true,
    },
    dueDate: Date,
    posted: Boolean, // Indicates if assignment is viewable or not
  })
);

export default AssignmentModel;
