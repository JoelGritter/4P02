import { User } from './../../app/schemas/user.model';

export const fakeAdmin: User = {
  cognitoId: 'fakeCognitoId',
  email: 'fake@email.com',
  roles: ['admin'],
  name: 'fakeadmin',
} as User;

export const fakeProf: User = {
  cognitoId: 'fakeCognitoId',
  email: 'fake@email.com',
  roles: ['prof'],
  name: 'fakeprof',
} as User;

export const fakeUser: User = {
  cognitoId: 'fakeCognitoId',
  email: 'fake@email.com',
  roles: [],
  name: 'fakeuser',
} as User;
