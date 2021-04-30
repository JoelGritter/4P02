import { User } from './../../app/schemas/user.model';

export const fakeAdmin: User = {
  cognitoId: 'fakeCognitoId',
  email: 'fakeAdmin@email.com',
  roles: ['admin'],
  name: 'fakeadmin',
} as User;

export const fakeProf: User = {
  cognitoId: 'fakeCognitoId',
  email: 'fakeProf@email.com',
  roles: ['prof'],
  name: 'fakeprof',
} as User;

export const fakeProf2: User = {
  cognitoId: 'fakeProfCognitoId',
  email: 'fakeProf2@email.com',
  roles: ['prof'],
  name: 'fakeprof2',
} as User;

export const fakeUser: User = {
  cognitoId: 'fakeCognitoId',
  email: 'fakeUser@email.com',
  roles: [],
  name: 'fakeuser',
} as User;
