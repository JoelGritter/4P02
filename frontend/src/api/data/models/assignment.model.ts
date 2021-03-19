export default interface Assignment {
  name?: string;
  _id?: string;
  courseID: string;
  dueDate?: string;
  creatorId?: string;
  posted?: boolean;
}
