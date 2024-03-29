import { Schema, model, Document } from 'mongoose';

export type Role = 'admin' | 'prof';

export interface User extends Document {
  name: string;
  email: string;
  cognitoId: string;
  roles: Role[];
  initialized: boolean; // Indicates if signup process has been completed or not
}

const UserModel = model(
  'User',
  new Schema<User>({
    name: String,
    email: String,
    cognitoId: String,
    roles: [String],
    initialized: Boolean,
  })
);

export default UserModel;
