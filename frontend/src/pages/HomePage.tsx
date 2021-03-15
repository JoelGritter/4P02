import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import CourseCard from '../components/CourseCard';
import Course from '../api/data/models/course.model';
import useMe from '../api/data/use-me';
import useProfCourses from '../api/data/use-prof-courses';
import { Box, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    coursesContainer: {},
    calendarContainer: {},
    innerCoursesContainer: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  })
);

function ProfCourses() {
  const classes = useStyles();
  const { courses: profCourses } = useProfCourses();

  return (
    <>
      {profCourses && (
        <>
          <Box display="flex" justifyContent="space-between" paddingRight={1}>
            <Typography variant="h4">Courses I'm Teaching</Typography>
            <Button
              color="primary"
              variant="contained"
              component={Link}
              to="/courses/create"
            >
              Add course
            </Button>
          </Box>
          <Grid
            container
            xs={12}
            spacing={1}
            className={classes.innerCoursesContainer}
          >
            {profCourses.map((course) => {
              return (
                <Grid item xs={12} key={course._id}>
                  <CourseCard course={course} />
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
    </>
  );
}

export default function HomePage() {
  const classes = useStyles();

  const courseData: Course[] = [
    {
      name: 'firstcourse',
    },
    {
      name: 'sec',
    },
    {
      name: 'third',
    },
    {
      name: 'fourth',
    },
  ] as Course[];

  const { me } = useMe();

  const isProf = me?.roles?.includes('prof');

  return (
    <>
      <Grid container spacing={1}>
        <Grid item md={9} className={classes.coursesContainer}>
          {isProf && <ProfCourses />}
          <Typography variant="h4">My Courses</Typography>
          <Grid
            container
            item
            xs={12}
            spacing={1}
            className={classes.innerCoursesContainer}
          >
            {courseData.map((data, index) => {
              return (
                <Grid item xs={12}>
                  <CourseCard course={data} />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        <Grid
          container
          item
          md={3}
          spacing={1}
          className={classes.calendarContainer}
        >
          <Grid item xs={12}>
            <Typography
              gutterBottom
              variant="h5"
              color="primary"
              component="h5"
            >
              Deadlines
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
