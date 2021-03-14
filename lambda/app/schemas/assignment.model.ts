import { Schema, model, Document } from "mongoose";

export interface Assignment extends Document{
  name: string;
  course: string;
  createdBy: string;
  dueDate: Date;
  posted: boolean; // Indicates if assignment is viewable or not
}

const AssignmentModel = model(
  "Assignment",
  new Schema<Assignment>({
    name: String,
    course: String,
    createdBy: String,
    dueDate: Date,
    posted: Boolean, // Indicates if assignment is viewable or not
  })
);

export default AssignmentModel;