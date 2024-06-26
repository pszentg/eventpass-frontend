import useSWR from 'swr';
import wretch from 'wretch';
import Cookies from 'js-cookie';
import { useContext } from 'react';
import { useUserContext } from '@/context/UserContext';

const fetcher = (url: string) => {
  const token = Cookies.get('access');
  if (!token) throw new Error('No token found');
  return wretch(url)
    .auth(`Bearer ${token}`)
    .get()
    .json();
};

const useUserValidation = () => {
  const { setUser } = useUserContext();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const { data, error, isValidating } = useSWR(`${BASE_URL}/auth/users/me/`, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  if (data) {
    setUser(data);
  }

  return {
    user: data,
    isValidating,
    error,
  };
};

export default useUserValidation;
