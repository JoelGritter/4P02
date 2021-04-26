import { atom } from 'recoil';

const authAtom = atom<any>({
  key: 'authAtom',
  default: null,
});

export default authAtom;
