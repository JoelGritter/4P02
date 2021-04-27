import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ProfCourses from './components/ProfCourses';
import StudentCourses from './components/StudentCourses';
import useAssociatedCourses from '../../api/data/use-associated-courses';
import emptyImage from '../../assets/undraw_empty_xct9.svg';

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
    emptyImg: {
      maxWidth: '600px',
      width: '100%',
      maxHeight: '600px',
      paddingBottom: theme.spacing(4),
      paddingTop: theme.spacing(4),
      paddingRight: theme.spacing(4),
      paddingLeft: theme.spacing(4),
    },
    emptyContainer: {
      textAlign: 'center',
    },
  })
);

export default function HomePage() {
  const classes = useStyles();
  const {
    profCourses,
    studentCourses,
    loading,
    failed,
  } = useAssociatedCourses();

  const nothing =
    !loading &&
    !failed &&
    studentCourses &&
    profCourses &&
    !studentCourses[0] &&
    !profCourses[0];

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12} md={9} className={classes.coursesContainer}>
          <ProfCourses />
          <StudentCourses />
          {nothing && (
            <div className={classes.emptyContainer}>
              <img src={emptyImage} alt="" className={classes.emptyImg} />
              <Typography color="primary" variant="h4">
                No courses to show
              </Typography>
            </div>
          )}
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
