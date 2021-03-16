import useSWR from 'swr';
import { apiJoin, fetcher } from './../util';
import User from './models/user.model';

export default function useMe() {
  const { data, mutate, error } = useSWR(apiJoin('user/me'), fetcher);

  const loading = !data && !error;
  const failed = !!error;

  const me: User = data?.data;

  return {
    loading,
    failed,
    me,
    mutate,
    isAdmin: me?.roles?.includes('admin'),
  };
}
