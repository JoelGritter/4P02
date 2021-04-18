import { Breadcrumbs, Typography, Grid } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import useMe from '../../api/data/use-me';
import ProfCourses from './components/ProfCourses';
import StudentCourses from './components/StudentCourses';
import { Route, useHistory } from 'react-router';
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
    breadCrumbs: {
      textDecoration: 'none',
      color: 'rgba(0, 0, 0, 0.54)',
    },
  })
);

export default function HomePage() {
  const classes = useStyles();

  const { me } = useMe();

  const history = useHistory();
  const pathnames = history.location.pathname.split('/').filter((x) => x);

  const isProf = me?.roles?.includes('prof');

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12} md={9}>
          <div className={classes.root}>
            <Route>
              <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" to="/" className={classes.breadCrumbs}>
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
                      className={classes.breadCrumbs}
                    >
                      {to}
                    </Link>
                  );
                })}
              </Breadcrumbs>
            </Route>
          </div>
        </Grid>
        <Grid item xs={12} md={9} className={classes.coursesContainer}>
          {isProf && <ProfCourses />}
          <StudentCourses />
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
