export interface PublicUser {
  cognitoId: string;
  email: string;
  name: string;
}

export default interface User extends PublicUser {
  initialized?: boolean;
  roles?: Role[];
}

export type Role = 'admin' | 'prof';
