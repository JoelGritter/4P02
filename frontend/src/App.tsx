import React, { useState } from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { onAuthUIStateChange } from '@aws-amplify/ui-components';
import Amplify from 'aws-amplify';
import Auth from '@aws-amplify/auth';
import { AmplifyAuthenticator, AmplifySignUp } from '@aws-amplify/ui-react';
import { SnackbarProvider } from 'notistack';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import Main from './Main';
import { Redirect, Route, Switch } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { useRecoilState, useRecoilValue } from 'recoil';
import authAtom from './sharedState/atoms/auth.atom';
import jwtTokenAtom from './sharedState/atoms/jwtToken.atom';
import loginState from './sharedState/selectors/loginState.selector';

const awsConfig = {
  aws_project_region: process.env.REACT_APP_AWS_PROJECT_REGION,
  aws_cognito_region: process.env.REACT_APP_AWS_COGNITO_REGION,
  aws_user_pools_id: process.env.REACT_APP_AWS_USER_POOLS_ID,
  aws_user_pools_web_client_id:
    process.env.REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID,
};

Amplify.configure(awsConfig);

const Authenticator = () => {
  return (
    <>
      <AmplifyAuthenticator>
        <AmplifySignUp
          slot="sign-up"
          usernameAlias="email"
          formFields={[
            {
              type: 'email',
            },
            {
              type: 'password',
            },
          ]}
        />
      </AmplifyAuthenticator>
    </>
  );
};

const App = () => {
  const [darkMode] = useState(false);
  const [, setAuthState] = useRecoilState(authAtom);
  const [jwtToken, setJwtToken] = useRecoilState(jwtTokenAtom);

  const [alreadyLoggedInUser, setAlreadyLoggedInUser] = useState<any>(null);

  React.useEffect(() => {
    (async () => {
      const user = await Auth.currentUserInfo();
      setAlreadyLoggedInUser(user);
    })();
  }, []);

  React.useEffect(() => {
    onAuthUIStateChange((nextAuthState, authData: any) => {
      setAuthState(nextAuthState);
      const _jwtToken = authData?.signInUserSession?.idToken?.jwtToken;
      if (_jwtToken) {
        localStorage.setItem('jwtToken', 'Bearer ' + _jwtToken);
        const tokenFromStorage = localStorage.getItem('jwtToken');
        setJwtToken(tokenFromStorage);
      } else {
        setJwtToken(null);
      }
    });
  }, [setAuthState, setJwtToken]);

  const loggedIn = useRecoilValue(loginState);

  const theme = createMuiTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: '#0055ff',
      },
      secondary: {
        main: '#fe7f00',
      },
      background: {
        default: `#f5f5f5`,
      },
    },
    typography: {
      fontFamily: ['Lexend'].join(','),
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <SnackbarProvider>
            <CssBaseline />
            {alreadyLoggedInUser && <Authenticator />}
            <Switch>
              <Route path="/login">
                <>
                  {loggedIn && jwtToken && <Redirect to="/courses" />}
                  {!loggedIn && <Authenticator />}
                </>
              </Route>
              <Route path="/" exact>
                <LandingPage />
              </Route>
              <Route>
                <Authenticator />
                {loggedIn && jwtToken && <Main />}
                {!loggedIn && <LandingPage />}
              </Route>
            </Switch>
          </SnackbarProvider>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
