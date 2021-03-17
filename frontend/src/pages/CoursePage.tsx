import { Button, CircularProgress, Typography } from '@material-ui/core';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useGet from '../api/data/use-get';
import { Helmet } from 'react-helmet-async';
import Course from '../api/data/models/course.model';

// TODO: Add redirect functionality/error handling if course does not exist
export default function CoursesPage() {
  const { id } = useParams() as any;
  const { data: course, loading, failed } = useGet<Course>(`/course/${id}`);
  return (
    <>
      <Helmet>
        <title>uAssign - {course?.name || 'Course Loading...'}</title>
      </Helmet>
      <div>
        {course && (
          <>
            <pre>{JSON.stringify(course, null, 2)}</pre>
            <Button
              component={Link}
              to={`/courses/${id}/edit`}
              variant="contained"
              color="primary"
            >
              Edit Course
            </Button>
          </>
        )}
        {loading && <CircularProgress />}
        {failed && (
          <Typography variant="body1" color="error">
            Could not load course!
          </Typography>
        )}
      </div>
    </>
  );
}
