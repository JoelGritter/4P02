import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Breadcrumbs, Typography, Grid, Button } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { AssignmentForm } from '../../components/AssignmentForm';
import { post } from '../../api/util';
import Assignment, {
  emptyAssignment,
} from '../../api/data/models/assignment.model';
import { useParams } from 'react-router-dom';
import { useHistory, Route } from 'react-router';
import { Link } from 'react-router-dom';
import useGet from '../../api/data/use-get';
import Course from '../../api/data/models/course.model';

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  headerContainer: {
    display: 'flex',
    margin: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContainer: {},
  button: {
    margin: theme.spacing(1),
  },
  fieldsContainer: {
    marginTop: theme.spacing(2),
  },
  breadCrumbs: {
    textDecoration: 'none',
    color: 'rgba(0, 0, 0, 0.54)',
  },
}));

export default function CreateAssignmentPage() {
  const { courseId }: { courseId: string } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [assignment, setAssignment] = useState<Assignment>(emptyAssignment);
  const { data: course } = useGet<Course>(`course/${courseId}`);
  const history = useHistory();

  const addAssignment = async () => {
    assignment.courseID = courseId;
    const { success, message, data } = await post('/assign', assignment);
    if (!success) {
      enqueueSnackbar(
        message ?? `Couldn't add "${assignment.name}" to your course!`
      );
    } else {
      enqueueSnackbar(message ?? `Added ${assignment.name} to your course!`);
      history.push(`/courses/${courseId}/assignments/${data._id}`);
    }
  };

  return (
    <div className={classes.root}>
      {course && (
        <Grid item xs={12} md={9}>
          <Route>
            {({ location }) => {
              const pathnames = history.location.pathname
                .split('/')
                .filter((x) => x);

              return (
                <Breadcrumbs aria-label="breadcrumb">
                  <Link
                    color="textSecondary"
                    to="/"
                    className={classes.breadCrumbs}
                  >
                    Home
                  </Link>
                  {pathnames.map((value, index) => {
                    const last = index === pathnames.length - 1;
                    const to = `${pathnames.slice(index, index + 1)}`;

                    return last ? (
                      <Typography color="textPrimary" key={to}>
                        {to}
                      </Typography>
                    ) : (
                      <Link
                        to={(location) => ({
                          ...location,
                          pathname: location.pathname.split(to)[0] + to,
                        })}
                        key={to}
                        className={classes.breadCrumbs}
                      >
                        {to === courseId ? course.name : to}
                      </Link>
                    );
                  })}
                </Breadcrumbs>
              );
            }}
          </Route>
        </Grid>
      )}
      <div className={classes.headerContainer}>
        <Typography variant="h4">Create Assignment</Typography>
        <div className={classes.buttonContainer}>
          <Button
            variant="outlined"
            color="secondary"
            className={classes.button}
            onClick={() => {
              setAssignment({
                ...emptyAssignment,
                courseID: courseId,
              });
            }}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={addAssignment}
          >
            Create
          </Button>
        </div>
      </div>
      <div className={classes.fieldsContainer}>
        <AssignmentForm assignment={assignment} setAssignment={setAssignment} />
      </div>
    </div>
  );
}
