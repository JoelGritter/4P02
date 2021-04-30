import { User } from './../../app/schemas/user.model';

export const fakeAdmin: User = {
  cognitoId: 'fakeCognitoId',
  email: 'fakeAdmin@email.com',
  roles: ['admin'],
  name: 'fakeadmin',
} as User;

export const fakerAdmin: User = {
  cognitoId: 'SuperfakeCognitoId',
  email: 'SuperFakeAdmin@email.com',
  roles: ['admin'],
  name: 'superfakeadmin',
} as User;

export const fakeProf: User = {
  cognitoId: 'proffakeCognitoId',
  email: 'proffakeProf@email.com',
  roles: ['prof'],
  name: 'fakeprof',
} as User;

export const fakeProf2: User = {
  cognitoId: 'fakeProfCognitoId',
  email: 'fakeProf2@email.com',
  roles: ['prof'],
  name: 'fakeprof2',
} as User;
  
export const fakeAdminProf: User = {
  cognitoId: 'profadminfakeCognitoId',
  email: 'profadminfakeProf@email.com',
  roles: ['prof', 'admin'],
  name: 'fakeprofadmin',
} as User;

export const fakeUser: User = {
  cognitoId: 'userfakeCognitoId',
  email: 'userfakeUser@email.com',
  roles: [],
  name: 'fakeuser',
} as User;