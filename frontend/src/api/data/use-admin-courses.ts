import useSWR from 'swr';
import { apiJoin, fetcher } from '../util';
import Course from './models/course.model';

export default function useAdminCourses() {
  const { data, mutate, error } = useSWR(apiJoin('course/'), fetcher);

  const loading = !data && !error;
  const failed = !!error;

  const courses: Course[] = data?.data;

  return {
    loading,
    failed,
    courses,
    mutate,
  };
}
