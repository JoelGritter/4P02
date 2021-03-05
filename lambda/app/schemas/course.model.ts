import { Schema, model, Document } from "mongoose";

export interface Course extends Document {
  name: string,
  studentCapacity: number,
  // announcements: Announcement[],
  // gradebook: Assessment[],
  currentProfessors: string[]
}

const CourseModel = model(
  "Course",
  new Schema<Course>({
    name: String,
    studentCapacity: Number,
    // announcements: [String],
    // gradebook: [String],
    currentProfessors: [String] // use userID to reference
  })
);

export default CourseModel;