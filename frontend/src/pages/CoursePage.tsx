import { Button } from '@material-ui/core';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useGet from '../api/data/use-get';
import { Helmet } from 'react-helmet-async';
import Course from '../api/data/models/course.model';
import RequestStatus from '../components/RequestStatus';

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
            <Button
              style={{ marginLeft: 5 }}
              component={Link}
              to={`/courses/${id}/assignments/create`}
              variant="contained"
              color="primary"
            >
              Create Assignment
            </Button>
          </>
        )}
        <RequestStatus
          failed={failed}
          loading={loading}
          failedMessage="Could not load course!"
        />
      </div>
    </>
  );
}
