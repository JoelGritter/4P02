import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Box, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import useAssociatedCourses from '../../../api/data/use-associated-courses';
import CourseCard from '../../../components/CourseCard';
import RequestStatus from '../../../components/RequestStatus';
import emptyImage from '../../../assets/undraw_empty_xct9.svg';

const useStyles = makeStyles((theme: Theme) => ({
  innerCoursesContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  emptyImg: {
    maxWidth: '400px',
    width: '100%',
    maxHeight: '400px',
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(4),
  },
  emptyContainer: {
    textAlign: 'center',
  },
}));

export default function ProfCourses() {
  const classes = useStyles();
  const { profCourses, loading, failed } = useAssociatedCourses();

  return (
    <>
      <>
        <Box display="flex" justifyContent="space-between" paddingRight={1}>
          <Typography variant="h4">Courses I'm Teaching</Typography>
          <div>
            <Button
              color="primary"
              variant="contained"
              component={Link}
              to="/courses/create"
            >
              Add course
            </Button>
          </div>
        </Box>

        {profCourses && profCourses.length > 0 && (
          <Grid container spacing={1} className={classes.innerCoursesContainer}>
            {profCourses.map((course) => {
              return (
                <Grid item xs={12} key={course._id}>
                  <CourseCard course={course} />
                </Grid>
              );
            })}
          </Grid>
        )}
        {!loading && !failed && !(profCourses && profCourses.length > 0) && (
          <>
            <div className={classes.emptyContainer}>
              <img src={emptyImage} alt="" className={classes.emptyImg} />
              <Typography color="primary" variant="h6">
                No courses to show
              </Typography>
            </div>
          </>
        )}
      </>
      <RequestStatus
        loading={loading}
        failed={failed}
        failedMessage="Failed to load courses!"
      />
    </>
  );
}
