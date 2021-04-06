import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Link, useParams } from 'react-router-dom';
import useGet from '../api/data/use-get';
import Assignment from '../api/data/models/assignment.model';
import { Helmet } from 'react-helmet-async';
import Typography from '@material-ui/core/Typography';
import { Box, Button } from '@material-ui/core';
import RequestStatus from '../components/RequestStatus';
import moment from 'moment';
import Course from '../api/data/models/course.model';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(1),
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  assignHeader: {},
  subHeader: {
    color: 'grey',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  dueContainer: {},
  createCourseButton: {
    height: 75,
  },
}));

export default function AssignmentPage() {
  const { courseId, id }: { courseId: string; id: string } = useParams();
  const { data: assignment, loading, failed } = useGet<Assignment>(
    `/assign/${id}`
  );
  const { data: course } = useGet<Course>(`course/${courseId}`);
  const classes = useStyles();

  return (
    <>
      <Helmet>
        <title>uAssign - {assignment?.name || 'Course Loading...'}</title>
      </Helmet>
      <div className={classes.root}>
        {assignment && (
          <>
            <div className={classes.header}>
              <Typography variant="h4">{assignment.name}</Typography>
              <Button
                component={Link}
                to={`/courses/${courseId}/assignments/${id}/edit`}
                variant="contained"
                color="primary"
              >
                Edit Assignment
              </Button>
            </div>
            <Typography className={classes.subHeader}>
              {course?.name}
            </Typography>
            <div className={classes.dueContainer}>
              <Typography variant="body1" color="textSecondary">
                Due
              </Typography>
              <Typography variant="body1">
                {moment(assignment?.lateDate ?? assignment?.closeDate).format(
                  'LL - h:mm a'
                )}
              </Typography>
              {assignment?.lateDate && (
                <>
                  <Box marginTop={1}>
                    <Typography variant="body1" color="textSecondary">
                      Late Due
                    </Typography>
                    <Typography variant="body1">
                      {moment(assignment?.closeDate).format('LL - h:mm a')}
                    </Typography>
                  </Box>
                </>
              )}
            </div>
          </>
        )}
        <RequestStatus
          failed={failed}
          loading={loading}
          failedMessage="Could not load course!"
        />
      </div>
    </>
  );
}
