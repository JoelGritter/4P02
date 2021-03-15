import React from 'react';
import { useParams } from 'react-router-dom';
import useGet from '../api/data/use-get';

// TODO: Add redirect functionality/error handling if course does not exist
export default function CoursesPage() {
  const { id } = useParams() as any;
  const { data: course } = useGet(`/course/${id}`);
  return (
    <div>
      <pre>{JSON.stringify(course, null, 2)}</pre>
    </div>
  );
}
