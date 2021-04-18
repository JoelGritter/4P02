import useSWR, { ConfigInterface } from 'swr';
import { apiJoin, fetcher } from './../util';

export default function useGet<T>(path: string, options?: ConfigInterface) {
  const { data, mutate, error } = useSWR(apiJoin(path), fetcher, options);

  const loading = !data && !error;
  const failed = !!error;

  const res = data?.data as T;

  return {
    loading,
    failed,
    data: res,
    mutate,
  };
}
