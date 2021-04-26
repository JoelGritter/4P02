import { atom } from 'recoil';

const jwtTokenAtom = atom<any>({
  key: 'jwtToken',
  default: null,
});

export default jwtTokenAtom;
