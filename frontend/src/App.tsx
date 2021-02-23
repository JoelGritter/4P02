import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AddCoursePage from "./pages/AddCoursePage";
import AssignmentsPage from "./pages/AssignmentsPage";
import CoursesPage from "./pages/CoursesPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import TestsPage from "./pages/TestsPage";

export default function App() {
  return (
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
  );
}
