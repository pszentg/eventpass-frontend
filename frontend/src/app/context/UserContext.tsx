'use client';
import React, { createContext, useState, useEffect } from 'react';
import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { AuthActions } from '../auth/utils';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
  isValidating: boolean;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
  isValidating: true,
});

const useJwtToken = () => {
  const { getToken, storeToken } = AuthActions();
  const [jwtToken, setJwtToken] = useState(getToken('access'));

  useEffect(() => {
    const token = getToken('access');
    if (token !== jwtToken) {
      setJwtToken(token);
    }
  }, [getToken, jwtToken]);

  return jwtToken;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const jwtToken = useJwtToken();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (jwtToken) {
      const {
        data: fetchedUser,
        error,
        isLoading,
        isValidating,
      } = useSWR('/auth/users/me', fetcher);

      if (isLoading) {
        setIsLoading(true);
      }

      if (isValidating) {
        setIsValidating(true);
      }

      if (error) {
        console.error('Error fetching user data:', error);
      } else if (fetchedUser) {
        setUser(fetchedUser);
      }
    }
  }, [jwtToken]);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, isValidating }}>
      {children}
    </UserContext.Provider>
  );
};
