import React, { useState } from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import Amplify from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignUp } from '@aws-amplify/ui-react';
import { SnackbarProvider } from 'notistack';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import Main from './Main';
import { Redirect, Route, Switch } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

const awsConfig = {
  aws_project_region: process.env.REACT_APP_AWS_PROJECT_REGION,
  aws_cognito_region: process.env.REACT_APP_AWS_COGNITO_REGION,
  aws_user_pools_id: process.env.REACT_APP_AWS_USER_POOLS_ID,
  aws_user_pools_web_client_id:
    process.env.REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID,
};

Amplify.configure(awsConfig);

const App = () => {
  const [darkMode] = useState(false);
  const [authState, setAuthState] = React.useState<any>();
  const [jwtToken, setJwtToken] = useState<string | null>(null);

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
  }, []);

  const loggedIn = authState === AuthState.SignedIn;

  const theme = createMuiTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: '#d50000',
      },
      secondary: {
        main: '#757575',
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
            <Switch>
              <Route path="/login">
                <>
                  {loggedIn && jwtToken && <Redirect to="/" />}
                  {!loggedIn && (
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
                  )}
                </>
              </Route>
              <Route path="/" exact>
                {loggedIn && jwtToken && <Main />}
                {!loggedIn && <LandingPage />}
              </Route>
              <Route>
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
