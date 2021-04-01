export default interface Assignment {
  name?: string;
  _id?: string;
  courseID: string;
  dueDate?: string;
  creatorId?: string;
  posted?: boolean;
  timestamp?: string;
}

export const emptyAssignment: Assignment = {
  name: '',
  _id: '',
  courseID: '',
  dueDate: '',
  creatorId: '',
  posted: false,
  timestamp: '',
};
