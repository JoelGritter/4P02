import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Breadcrumbs, Grid, Button, Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { CourseForm } from '../../components/CourseForm';
import { update } from '../../api/util';
import Course from '../../api/data/models/course.model';
import { useHistory, useParams, Route } from 'react-router';
import useGet from '../../api/data/use-get';
import { Link } from 'react-router-dom';
import RequestStatus from '../../components/RequestStatus';

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  headerContainer: {
    display: 'flex',
    margin: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'flex-end',
  },
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

export default function EditCoursePage() {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  const { id } = useParams<any>();

  const { data: course, failed, loading, mutate } = useGet<Course>(
    `/course/${id}`
  );
  const [editCourse, setEditCourse] = useState<Course>({});

  const resCourse = { ...course, ...editCourse };
  const history = useHistory();

  const updateCourse = async () => {
    const { success, message, data } = await update(`/course/${id}`, resCourse);
    if (!success) {
      enqueueSnackbar(message ?? `Couldn't update "${resCourse.name}"!`);
    } else {
      enqueueSnackbar(message ?? `Updated course "${resCourse.name}"`);
      history.push(`/courses/${data._id}`);
      mutate(data);
    }
  };

  return (
    <div className={classes.root}>
      {course && (
        <>
          <Grid item xs={12} md={9}>
            <div className={classes.root}>
              <Route>
                {({ location }) => {
                  const pathnames = history.location.pathname
                    .split('/')
                    .filter((x) => x);

                  return (
                    <Breadcrumbs aria-label="breadcrumb">
                      <Link
                        color="inherit"
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
                            {to === course._id ? course.name : to}
                          </Typography>
                        ) : (
                          <Link
                            to={(location) => ({
                              ...location,
                              pathname: location.pathname.split(to)[0] + to,
                            })}
                            className={classes.breadCrumbs}
                          >
                            {to === course._id ? course.name : to}
                          </Link>
                        );
                      })}
                    </Breadcrumbs>
                  );
                }}
              </Route>
            </div>
          </Grid>
          <div className={classes.headerContainer}>
            <Typography variant="h4">Edit Course</Typography>
          </div>
          <div className={classes.fieldsContainer}>
            <CourseForm course={resCourse} setCourse={setEditCourse} />
          </div>
          <div className={classes.buttonContainer}>
            <Button
              variant="outlined"
              color="secondary"
              className={classes.button}
              component={Link}
              to={`courses/${course._id}`}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={updateCourse}
            >
              Save
            </Button>
          </div>
        </>
      )}
      <RequestStatus
        failed={failed}
        loading={loading}
        failedMessage="Could not load course!"
      />
    </div>
  );
}
