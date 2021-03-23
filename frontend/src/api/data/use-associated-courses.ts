import { fetcher } from './../util';
import useSWR from 'swr';
import { apiJoin } from '../util';
import useMe from './use-me';
import Course from './models/course.model';

export default function useAssociatedCourses() {
  const { data, mutate, error } = useSWR(apiJoin('course/associated'), fetcher);

  const { me } = useMe();

  const loading = !data && !error;
  const failed = !!error;

  const courses: Course[] = data?.data;

  return {
    loading,
    failed,
    allCourses: courses,
    profCourses:
      me &&
      courses?.filter((course) =>
        course.currentProfessors?.includes(me.cognitoId)
      ),
    studentCourses:
      me &&
      courses?.filter((course) => course.students?.includes(me.cognitoId)),
    mutate,
  };
}
