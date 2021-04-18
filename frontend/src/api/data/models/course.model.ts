export default interface Course {
  name?: string;
  _id?: string;
  description?: string;
  currentProfessors?: string[];
  moderators?: string[];
  students?: string[];
}

export const emptyCourse: Course = {
  _id: '',
  name: '',
  description: '',
  currentProfessors: [],
  students: [],
  moderators: [],
};
