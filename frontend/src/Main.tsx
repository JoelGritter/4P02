import React from 'react';
import { Switch, Route, Redirect, useLocation, Link } from 'react-router-dom';
import AssignmentPage from './pages/AssignmentPage';
import CoursesPage from './pages/CoursePage';
import HomePage from './pages/home/HomePage';
import ProfilePage from './pages/ProfilePage';
import HelpPage from './pages/HelpPage';
import TestsPage from './pages/TestsPage';
import EditAssignmentPage from './pages/instructorPages/EditAssignmentPage';
import CreateCoursePage from './pages/instructorPages/CreateCoursePage';
import {
  Breadcrumbs,
  Link as MatLink,
  Typography,
  makeStyles,
} from '@material-ui/core';
import AdminHome from './pages/admin/AdminHome';
import Nav from './components/Nav';
import EditCoursePage from './pages/instructorPages/EditCoursePage';
import { Helmet } from 'react-helmet-async';
import CreateAssignmentPage from './pages/instructorPages/CreateAssignmentPage';
import useMe from './api/data/use-me';
import useGet from './api/data/use-get';
import Course from './api/data/models/course.model';
import Assignment from './api/data/models/assignment.model';
import { swrNoFetchOptions } from './api/util';

const useStyles = makeStyles((theme) => ({
  crumbs: {
    marginBottom: theme.spacing(1),
  },
}));

export default function Main() {
  const classes = useStyles();
  const { me, success } = useMe();
  const { pathname } = useLocation();
  const courseId = pathname.split('/')[2];
  const assignId = pathname.split('/')[4];
  const { data: assignment } = useGet<Assignment>(
    `/assign/${assignId}`,
    swrNoFetchOptions
  );
  const { data: course } = useGet<Course>(
    `course/${courseId}`,
    swrNoFetchOptions
  );

  const incompleteProfile = success && !me.name;

  const breadcrumbsNameMap: { [key: string]: string } = {
    profile: 'My Profile',
    admin: 'Admin',
    users: 'Users',
    courses: 'Courses',
    assignments: 'Assignments',
    tests: 'Tests',
  };

  return (
    <>
      <div style={{ minHeight: '100vh' }}>
        <Nav>
          <Route>
            {({ location }) => {
              const pathnames = location.pathname.split('/').filter((x) => x);

              return (
                <Breadcrumbs aria-label="breadcrumb" className={classes.crumbs}>
                  {pathnames.map((value, index) => {
                    const last = index === pathnames.length - 1;
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                    return last ? (
                      <Typography color="textPrimary" key={to}>
                        {value === course?._id
                          ? course?.name
                          : value === assignment?._id
                          ? assignment?.name
                          : breadcrumbsNameMap[value] !== null
                          ? breadcrumbsNameMap[value]
                          : value}
                      </Typography>
                    ) : (
                      <MatLink
                        component={Link}
                        color="inherit"
                        to={to}
                        key={to}
                      >
                        {value === course?._id
                          ? course?.name
                          : value === assignment?._id
                          ? assignment?.name
                          : breadcrumbsNameMap[value] !== null
                          ? breadcrumbsNameMap[value]
                          : value}
                      </MatLink>
                    );
                  })}
                </Breadcrumbs>
              );
            }}
          </Route>
          <Switch>
            {incompleteProfile && pathname !== '/profile' && (
              <Redirect to="/profile" />
            )}
            <Route path="/courses/create">
              <Helmet>
                <title>UAssign - Create Course</title>
              </Helmet>
              <CreateCoursePage />
            </Route>
            <Route path="/courses/:id/edit">
              <Helmet>
                <title>UAssign - Edit Course</title>
              </Helmet>
              <EditCoursePage />
            </Route>
            <Route path="/courses/:courseId/assignments/create">
              <Helmet>
                <title>UAssign - Create Assignments</title>
              </Helmet>
              <CreateAssignmentPage />
            </Route>
            <Route path="/courses/:courseId/assignments/:id/edit">
              <Helmet>
                <title>UAssign - Edit Assignments</title>
              </Helmet>
              <EditAssignmentPage />
            </Route>
            <Route path="/courses/:courseId/assignments/:id">
              <Helmet>
                <title>UAssign - Assignment</title>
              </Helmet>
              <AssignmentPage />
            </Route>
            <Route path="/courses/:id">
              <Helmet>
                <title>UAssign - Course Page</title>
              </Helmet>
              <CoursesPage />
            </Route>
            <Route path="/profile">
              <Helmet>
                <title>UAssign - My Profile</title>
              </Helmet>
              <ProfilePage />
            </Route>
            <Route path="/help">
              <Helmet>
                <title>UAssign - Help Page</title>
              </Helmet>
              <HelpPage />
            </Route>
            <Route path="/tests">
              <Helmet>
                <title>UAssign - Tests</title>
              </Helmet>
              <TestsPage />
            </Route>
            <Route path="/admin">
              <Helmet>
                <title>UAssign - Admin</title>
              </Helmet>
              <AdminHome />
            </Route>
            <Route path="/home">
              <Helmet>
                <title>UAssign - Home</title>
              </Helmet>
              <HomePage />
            </Route>
            <Route path="/">
              <Helmet>
                <title>UAssign - Home</title>
              </Helmet>
              <HomePage />
            </Route>
          </Switch>
        </Nav>
      </div>
    </>
  );
}
