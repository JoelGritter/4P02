import { Button } from '@material-ui/core';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useGet from '../api/data/use-get';
import { Helmet } from 'react-helmet-async';
import Course from '../api/data/models/course.model';
import Assignment from '../api/data/models/assignment.model';
import RequestStatus from '../components/RequestStatus';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AssignmentCard from '../components/AssignmentCard';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(1),
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: theme.spacing(1),
  },
  assignHeader: {
    margin: theme.spacing(1),
  },
  subHeader: {
    color: 'grey',
    margin: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  assignmentContainer: {},
  createCourseButton: {
    marginLeft: 5,
    height: 75,
  },
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
    data: assignment,
    loading: loadingAssignments,
    failed: failedAssignments,
  } = useGet<Assignment | any>(`/assign/course/${id}`);
  const classes = useStyles();

  return (
    <>
      <Helmet>
        <title>uAssign - {course?.name || 'Course Loading...'}</title>
      </Helmet>
      <div className={classes.root}>
        {assignment && course && (
          <>
            <div className={classes.header}>
              <Typography variant="h4">{course.name}</Typography>
              <Button
                component={Link}
                to={`/courses/${id}/edit`}
                variant="contained"
                color="primary"
              >
                Edit Course
              </Button>
            </div>
            <Typography className={classes.subHeader}>
              {course.description}
            </Typography>
            <div className={classes.assignmentContainer}>
              <Typography variant="h5" className={classes.assignHeader}>
                Assignments
              </Typography>
              {assignment.map((assignments: Assignment) => {
                return <AssignmentCard assignment={assignments} />;
              })}
              <Button
                className={classes.createCourseButton}
                component={Link}
                fullWidth
                to={`/courses/${id}/assignments/create`}
                variant="contained"
                color="primary"
              >
                Create Assignment
              </Button>
            </div>
          </>
        )}
        <RequestStatus
          failed={failedCourse || failedAssignments}
          loading={loadingCourse || loadingAssignments}
          failedMessage="Could not load course!"
        />
      </div>
    </>
  );
}
