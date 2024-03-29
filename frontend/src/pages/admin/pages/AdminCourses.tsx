import { Box, Button, Grid, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import useAdminCourses from '../../../api/data/use-admin-courses';
import CourseCard from '../../../components/CourseCard';
import RequestStatus from '../../../components/RequestStatus';

const useStyles = makeStyles((theme: Theme) => ({
  courseGrid: {
    marginTop: theme.spacing(2),
  },
}));

export default function AdminCourses() {
  const classes = useStyles();
  const { courses, loading, failed } = useAdminCourses();
  return (
    <div>
      <Box justifyContent="flex-end" display="flex">
        <Button
          component={Link}
          to="/courses/create"
          color="primary"
          variant="contained"
        >
          Add Course
        </Button>
      </Box>
      <Grid container spacing={2} className={classes.courseGrid}>
        {courses?.map((course) => (
          <Grid item xs={12} md={4} lg={3} key={course._id}>
            <CourseCard course={course}></CourseCard>
          </Grid>
        ))}
      </Grid>
      <RequestStatus
        loading={loading}
        failed={failed}
        failedMessage="Failed to load courses!"
      />
    </div>
  );
}
