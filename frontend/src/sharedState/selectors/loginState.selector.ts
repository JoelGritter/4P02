import { AuthState } from '@aws-amplify/ui-components';
import { selector } from 'recoil';
import authAtom from '../atoms/auth.atom';
import jwtTokenAtom from '../atoms/jwtToken.atom';

const loginState = selector({
  key: 'loginState',
  get: ({ get }) => {
    const authState = get(authAtom);
    const jwtTokenState = get(jwtTokenAtom);

    return jwtTokenState && authState === AuthState.SignedIn;
  },
});

export default loginState;
