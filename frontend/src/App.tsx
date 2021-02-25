import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AddCoursePage from "./pages/AddCoursePage";
import AssignmentsPage from "./pages/AssignmentsPage";
import CoursesPage from "./pages/CoursesPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import TestsPage from "./pages/TestsPage";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";

export default function App() {
  const theme = createMuiTheme({
    palette: {
      type: "dark",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Paper style={{ height: "100vh" }}>
        <Router>
          <div>
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
              <Route path="/home">
                <HomePage />
              </Route>
              <Route path="/">
                <HomePage />
              </Route>
            </Switch>
          </div>
        </Router>
      </Paper>
    </ThemeProvider>
  );
}
