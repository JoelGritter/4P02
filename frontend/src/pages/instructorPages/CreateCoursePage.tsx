import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Breadcrumbs, Typography, Grid, Button } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { CourseForm } from '../../components/CourseForm';
import { post } from '../../api/util';
import Course, { emptyCourse } from '../../api/data/models/course.model';
import { useHistory, Route } from 'react-router';
import { Link } from 'react-router-dom';

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

export default function CreateCoursePage() {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [course, setCourse] = useState<Course>(emptyCourse);
  const history = useHistory();

  const addCourse = async () => {
    const { success, message, data } = await post('/course', course);
    if (!success) {
      enqueueSnackbar(
        message ?? `Couldn't add "${course.name}" to your courses!`
      );
    } else {
      enqueueSnackbar(message ?? `Added ${course.name} to your courses!`);
      history.push(`/courses/${data._id}`);
    }
  };

  return (
    <div className={classes.root}>
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
                      {to}
                    </Link>
                  );
                })}
              </Breadcrumbs>
            );
          }}
        </Route>
      </Grid>
      <div className={classes.headerContainer}>
        <Typography variant="h4">Create Course</Typography>
      </div>
      <div className={classes.fieldsContainer}>
        <CourseForm course={course} setCourse={setCourse} />
      </div>
      <div className={classes.buttonContainer}>
        <Button
          variant="outlined"
          color="secondary"
          className={classes.button}
          onClick={() => {
            setCourse(emptyCourse);
          }}
        >
          Clear
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={addCourse}
        >
          Create
        </Button>
      </div>
    </div>
  );
}
