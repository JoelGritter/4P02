import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Box, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import useAssociatedCourses from '../../../api/data/use-associated-courses';
import CourseCard from '../../../components/CourseCard';
import RequestStatus from '../../../components/RequestStatus';

const useStyles = makeStyles((theme: Theme) => ({
  innerCoursesContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

export default function ProfCourses() {
  const classes = useStyles();
  const { profCourses, loading, failed } = useAssociatedCourses();

  return (
    <>
      {profCourses && profCourses.length > 0 && (
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
          <Grid container spacing={1} className={classes.innerCoursesContainer}>
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
      <RequestStatus
        loading={loading}
        failed={failed}
        failedMessage="Failed to load courses!"
      />
    </>
  );
}
