import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import wretch from 'wretch';
import UserContext from '../context/UserContext';

const useAuth = () => {
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const { setUser } = useContext(UserContext);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const login = async (email: string, password: string) => {
    try {
      const response = await wretch(`${BASE_URL}/auth/jwt/create/`)
        .post({ email, password })
        .json<{ access: string, refresh: string }>();

      const { access, refresh } = response;

      // Store tokens in local storage
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);

      // Fetch the user object
      const userResponse = await wretch(`${BASE_URL}/auth/users/me/`)
        .auth(`Bearer ${access}`)
        .get()
        .json();

      // Store user in context
      setUser(userResponse);

      // Redirect to the home page or dashboard
      router.push('/dashboard');
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await wretch(`${BASE_URL}/auth/users/`)
        .post({ email, password })
        .res();

      router.push('/login');
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  return { login, register, error };
};

export default useAuth;
