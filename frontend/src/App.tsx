import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AssignmentsPage from './pages/AssignmentsPage';
import CoursesPage from './pages/CoursePage';
import HomePage from './pages/home/HomePage';
import ProfilePage from './pages/ProfilePage';
import TestsPage from './pages/TestsPage';
import CreateCoursePage from './pages/instructorPages/CreateCoursePage';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { CssBaseline, Paper } from '@material-ui/core';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import Amplify, { Auth } from 'aws-amplify';
import AdminHome from './pages/admin/AdminHome';
import Nav from './components/Nav';
import { AmplifyAuthenticator, AmplifySignUp } from '@aws-amplify/ui-react';
import { SnackbarProvider } from 'notistack';
import EditCoursePage from './pages/instructorPages/EditCoursePage';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { Helmet } from 'react-helmet-async';
import CreateAssignmentPage from './pages/instructorPages/CreateAssignmentPage';
import useMe from './api/data/use-me';

const awsConfig = {
  aws_project_region: process.env.REACT_APP_AWS_PROJECT_REGION,
  aws_cognito_region: process.env.REACT_APP_AWS_COGNITO_REGION,
  aws_user_pools_id: process.env.REACT_APP_AWS_USER_POOLS_ID,
  aws_user_pools_web_client_id:
    process.env.REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID,
};

Amplify.configure(awsConfig);

export const App = () => {
  const [darkMode] = useState(false);

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
  });

  useEffect(() => {
    (async () => {
      const data = await Auth.currentSession();
      const jwtToken = data.getIdToken().getJwtToken();
      localStorage.setItem('jwtToken', 'Bearer ' + jwtToken);
    })();
  }, []);

  const { me, success } = useMe();

  const incompleteProfile = success && !me.name;

  const { pathname } = useLocation();

  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <SnackbarProvider>
          <CssBaseline />
          <Paper style={{ minHeight: '100vh' }}>
            <Nav>
              <Switch>
                {incompleteProfile && pathname !== '/profile' && (
                  <Redirect to="/profile" />
                )}
                <Route path="/login">
                  <Helmet>
                    <title>uAssign - Login</title>
                  </Helmet>
                  <LoginPage />
                </Route>
                <Route path="/courses/create">
                  <Helmet>
                    <title>uAssign - Create Course</title>
                  </Helmet>
                  <CreateCoursePage />
                </Route>
                <Route path="/courses/:id/edit">
                  <Helmet>
                    <title>uAssign - Edit Course</title>
                  </Helmet>
                  <EditCoursePage />
                </Route>
                <Route path="/courses/:courseId/assignments/create">
                  <Helmet>
                    <title>uAssign - Create Assignments</title>
                  </Helmet>
                  <CreateAssignmentPage />
                </Route>
                <Route path="/assignments">
                  <Helmet>
                    <title>uAssign - Assignments</title>
                  </Helmet>
                  <AssignmentsPage />
                </Route>
                <Route path="/courses/:id">
                  <Helmet>
                    <title>uAssign - Course Page</title>
                  </Helmet>
                  <CoursesPage />
                </Route>
                <Route path="/profile">
                  <Helmet>
                    <title>uAssign - My Profile</title>
                  </Helmet>
                  <ProfilePage />
                </Route>
                <Route path="/tests">
                  <Helmet>
                    <title>uAssign - Tests</title>
                  </Helmet>
                  <TestsPage />
                </Route>
                <Route path="/admin">
                  <Helmet>
                    <title>uAssign - Admin</title>
                  </Helmet>
                  <AdminHome />
                </Route>
                <Route path="/home">
                  <Helmet>
                    <title>uAssign - Home</title>
                  </Helmet>
                  <HomePage />
                </Route>
                <Route path="/">
                  <Helmet>
                    <title>uAssign - Home</title>
                  </Helmet>
                  <HomePage />
                </Route>
              </Switch>
            </Nav>
          </Paper>
        </SnackbarProvider>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
};

function AuthWrapper() {
  const [authState, setAuthState] = React.useState();
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    return onAuthUIStateChange((nextAuthState: any, authData: any) => {
      setAuthState(nextAuthState);
      setUser(authData);
    });
  }, []);

  return authState === AuthState.SignedIn && user ? (
    <App />
  ) : (
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
  );
}

export default AuthWrapper;
