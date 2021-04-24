import { User } from './../../app/schemas/user.model';

export const fakeAdmin: User = {
  cognitoId: 'fakeCognitoId',
  email: 'fake@email.com',
  roles: ['admin'],
} as User;

export const fakeProf: User = {
  cognitoId: 'fakeCognitoId',
  email: 'fake@email.com',
  roles: ['prof'],
} as User;

export const fakeUser: User = {
  cognitoId: 'fakeCognitoId',
  email: 'fake@email.com',
  roles: [],
} as User;
