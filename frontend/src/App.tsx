import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AddCoursePage from "./pages/AddCoursePage";
import AssignmentsPage from "./pages/AssignmentsPage";
import CoursesPage from "./pages/CoursesPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import TestsPage from "./pages/TestsPage";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { CssBaseline, Paper } from "@material-ui/core";
import red from "@material-ui/core/colors/red";

import Amplify, { Auth } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import AdminHome from "./pages/admin/AdminHome";
import Nav from "./components/Nav";

const awsConfig = {
  aws_project_region: "us-east-1",
  aws_cognito_region: "us-east-1",
  aws_user_pools_id: "us-east-1_rxv5ynpIW",
  aws_user_pools_web_client_id: "1etk2iv3214e73cfeiveinsfkn",
};

Amplify.configure(awsConfig);

export const App = () => {
  const [darkMode] = useState(false);

  const theme = createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light",
      primary: {
        main: red[800],
      },
      secondary: {
        main: red[500],
      },
    },
  });

  useEffect(() => {
    (async () => {
      const data = await Auth.currentSession();
      const jwtToken = data.getIdToken().getJwtToken();
      localStorage.setItem("jwtToken", "Bearer " + jwtToken);
    })();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Paper style={{ height: "100vh" }}>
        <Nav>
          <Switch>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Route path="/addCourse">
              <AddCoursePage />
            </Route>
            <Route path="/assignments">
              <AssignmentsPage />
            </Route>
            <Route path="/courses">
              <CoursesPage />
            </Route>
            <Route path="/profile">
              <ProfilePage />
            </Route>
            <Route path="/tests">
              <TestsPage />
            </Route>
            <Route path="/admin">
              <AdminHome />
            </Route>
            <Route path="/home">
              <HomePage />
            </Route>
            <Route path="/">
              <HomePage />
            </Route>
          </Switch>
        </Nav>
      </Paper>
    </ThemeProvider>
  );
};

export default withAuthenticator(App);
