export default interface User {
  cognitoId: string;
  email: string;
  initialized?: boolean;
  roles?: Role[];
}

export type Role = 'admin' | 'prof';
