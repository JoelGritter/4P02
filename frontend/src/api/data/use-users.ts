import useSWR from 'swr';
import { apiJoin, fetcher } from './../util';
import User from './models/user.model';

export default function useUsers() {
  const { data, mutate, error } = useSWR(apiJoin('user/'), fetcher);

  const loading = !data && !error;
  const failed = !!error;

  const users: User[] = data?.data;

  return {
    loading,
    failed,
    users,
    mutate,
  };
}
