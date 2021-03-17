import { Schema, model, Document } from 'mongoose';

export interface Course extends Document {
  name: string;
  // studentCapacity: number;
  // announcements: Announcement[],
  // gradebook: Assessment[],
  currentProfessors: string[];
  moderators: string[];
  students: string[];
  description: string;
}

const CourseModel = model(
  'Course',
  new Schema<Course>({
    name: {
      type: String,
      required: true,
    },
    // studentCapacity: Number,
    // announcements: [String],
    // gradebook: [String],
    currentProfessors: [String], // cognitoId of user
    moderators: [String], // cognitoId of user
    students: [String], // cognitoId of user
    description: String,
  })
);

export default CourseModel;
