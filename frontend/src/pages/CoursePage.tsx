import { Box, IconButton, Tooltip } from '@material-ui/core';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useGet from '../api/data/use-get';
import { Helmet } from 'react-helmet-async';
import Course from '../api/data/models/course.model';
import Assignment from '../api/data/models/assignment.model';
import User from '../api/data/models/user.model';
import RequestStatus from '../components/RequestStatus';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AssignmentCard from '../components/AssignmentCard';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(1),
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  assignHeader: {
    marginTop: theme.spacing(2),
  },
  subHeader: {
    color: 'grey',
    marginTop: theme.spacing(2),
  },
  assignmentContainer: {},
  createCourseButton: {},
}));

// TODO: Add redirect functionality/error handling if course does not exist
export default function CoursesPage() {
  const { id } = useParams() as any;
  const {
    data: course,
    loading: loadingCourse,
    failed: failedCourse,
  } = useGet<Course>(`/course/${id}`);
  const {
    data: assignments,
    loading: loadingAssignments,
    failed: failedAssignments,
  } = useGet<Assignment | any>(`/assign/course/${id}`);
  const { data: user, loading: loadingUser, failed: failedUser } = useGet<User>(
    `/user/me`
  );
  const classes = useStyles();

  return (
    <>
      <Helmet>
        <title>uAssign - {course?.name || 'Course Loading...'}</title>
      </Helmet>
      <div className={classes.root}>
        {assignments && course && (
          <>
            <div className={classes.header}>
              <Typography variant="h4">{course.name}</Typography>
              {user.roles?.includes('prof') && (
                <Tooltip title="Edit Course">
                  <IconButton
                    className={classes.createCourseButton}
                    component={Link}
                    to={`/courses/${id}/edit`}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            <Typography className={classes.subHeader}>
              {course.description}
            </Typography>
            <div className={classes.assignmentContainer}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h5" className={classes.assignHeader}>
                  Assignments
                </Typography>
                {user.roles?.includes('prof') && (
                  <Tooltip title="Add Assignment">
                    <IconButton
                      className={classes.createCourseButton}
                      component={Link}
                      to={`/courses/${id}/assignments/create`}
                      color="primary"
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
              {assignments.map((a: Assignment) => {
                return <AssignmentCard assignment={a} key={a._id} />;
              })}
            </div>
          </>
        )}
        <RequestStatus
          failed={failedCourse || failedAssignments || failedUser}
          loading={loadingCourse || loadingAssignments || loadingUser}
          failedMessage="Could not load course!"
        />
      </div>
    </>
  );
}
