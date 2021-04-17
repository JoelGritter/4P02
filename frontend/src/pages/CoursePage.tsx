import { Box, IconButton, Tooltip } from '@material-ui/core';
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
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import useMe from '../api/data/use-me';

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerIcons: {
    float: 'right',
  },
  assignHeader: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  subHeader: {
    color: 'grey',
    marginTop: theme.spacing(1),
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

  const { isProf, isAdmin } = useMe();
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
              <div className={classes.headerIcons}>
                {isProf && (
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
                {isAdmin && (
                  <Tooltip title="Delete Course">
                    <IconButton
                      className={classes.createCourseButton}
                      component={Link}
                      to={`/courses/${id}/delete`}
                      color="primary"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            </div>
            <Typography className={classes.subHeader}>
              {course.description}
            </Typography>
            <div className={classes.assignmentContainer}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h5" className={classes.assignHeader}>
                  Assignments
                </Typography>
                {isProf && (
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
          failed={failedCourse || failedAssignments}
          loading={loadingCourse || loadingAssignments}
          failedMessage="Could not load course!"
        />
      </div>
    </>
  );
}
