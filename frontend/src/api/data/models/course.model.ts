import User from './user.model';

export default interface Course {
  name?: string;
  _id?: string;
  description?: string;
  currentProfessors?: string[];
}
