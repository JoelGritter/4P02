import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Link, useParams } from 'react-router-dom';
import useGet from '../api/data/use-get';
import Assignment from '../api/data/models/assignment.model';
import { Helmet } from 'react-helmet-async';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import RequestStatus from '../components/RequestStatus';
import moment from 'moment';

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
  dueContainer: {},
  createCourseButton: {
    marginLeft: 5,
    height: 75,
  },
}));

export default function AssignmentsPage() {
  const { id }: { courseId: string; id: string } = useParams();
  const { data: assignment, loading, failed } = useGet<Assignment | any>(
    `/assign/${id}`
  );
  const classes = useStyles();

  console.log(assignment);

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
                to={`/courses/${id}/edit`}
                variant="contained"
                color="primary"
              >
                Edit Assignment
              </Button>
            </div>
            <Typography className={classes.subHeader}>
              course name - code
            </Typography>
            <div className={classes.dueContainer}>
              <Typography variant="h5" className={classes.assignHeader}>
                Due {moment(assignment?.dueDate).format('LL - h:mm a')}
              </Typography>
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
