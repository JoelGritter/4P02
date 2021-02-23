import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import LoginPage from "./pages/LoginPage";
import AddCoursePage from "./pages/AddCoursePage";
import AssignmentsPage from "./pages/AssignmentsPage";
import CoursesPage from "./pages/CoursesPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import TestsPage from "./pages/TestsPage";

const useStyles = makeStyles({
  root: {},
});

export default function App() {
  const classes = useStyles();

  return (
    <Router>
      <div>
        <Switch>
          <Route path="/login" component={LoginPage}>
            <LoginPage />
          </Route>
          <Route path="/addCourse" component={AddCoursePage}>
            <AddCoursePage />
          </Route>
          <Route path="/assignments" component={AssignmentsPage}>
            <AssignmentsPage />
          </Route>
          <Route path="/courses" component={CoursesPage}>
            <CoursesPage />
          </Route>
          <Route path="/home" component={HomePage}>
            <HomePage />
          </Route>
          <Route path="/profile" component={ProfilePage}>
            <ProfilePage />
          </Route>
          <Route path="/tests" component={TestsPage}>
            <TestsPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
