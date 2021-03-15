import { Schema, model, Document } from 'mongoose';

export interface Course extends Document {
  name: string;
  studentCapacity: number;
  // announcements: Announcement[],
  // gradebook: Assessment[],
  currentProfessors: string[];
  description: string;
}

const CourseModel = model(
  'Course',
  new Schema<Course>({
    name: {
      type: String,
      required: true,
    },
    studentCapacity: Number,
    // announcements: [String],
    // gradebook: [String],
    currentProfessors: [String], // use userID to reference
    description: String,
  })
);

export default CourseModel;
