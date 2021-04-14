import useSWR from 'swr';
import { apiJoin, fetcher } from './../util';

export default function useGets<T>(path: string) {
  const { data, mutate, error } = useSWR(apiJoin(path), fetcher);

  const loading = !data && !error;
  const failed = !!error;

  const res = data?.data as T[];

  return {
    loading,
    failed,
    data: res,
    mutate,
  };
}
