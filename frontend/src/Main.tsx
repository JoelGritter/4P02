import React from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import AssignmentPage from './pages/AssignmentPage';
import CoursesPage from './pages/CoursePage';
import HomePage from './pages/home/HomePage';
import ProfilePage from './pages/ProfilePage';
import TestsPage from './pages/TestsPage';
import EditAssignmentPage from './pages/instructorPages/EditAssignmentPage';
import CreateCoursePage from './pages/instructorPages/CreateCoursePage';
import { Paper } from '@material-ui/core';
import AdminHome from './pages/admin/AdminHome';
import Nav from './components/Nav';
import EditCoursePage from './pages/instructorPages/EditCoursePage';
import { Helmet } from 'react-helmet-async';
import CreateAssignmentPage from './pages/instructorPages/CreateAssignmentPage';
import useMe from './api/data/use-me';

export default function Main() {
  const { me, success } = useMe();
  const { pathname } = useLocation();

  const incompleteProfile = success && !me.name;

  return (
    <>
      <Paper style={{ minHeight: '100vh' }}>
        <Nav>
          <Switch>
            {incompleteProfile && pathname !== '/profile' && (
              <Redirect to="/profile" />
            )}
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
            <Route path="/courses/:courseId/assignments/:id/edit">
              <Helmet>
                <title>uAssign - Edit Assignments</title>
              </Helmet>
              <EditAssignmentPage />
            </Route>
            <Route path="/courses/:courseId/assignments/:id">
              <Helmet>
                <title>uAssign - Assignment</title>
              </Helmet>
              <AssignmentPage />
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
    </>
  );
}
