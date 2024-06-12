'use client';

import { AuthActions } from '@/app/auth/utils';
import { useRouter } from 'next/navigation';
import React from 'react';

const Sidenav = () => {
    const router = useRouter();
    const { logout, removeTokens } = AuthActions();

    const handleLogout = () => {
    logout()
        .res(() => {
        removeTokens();

        router.push('/');
        })
        .catch(() => {
        removeTokens();
        router.push('/');
        });
    };

    return (
    <div className="flex flex-shrink-0 flex-col h-full">
      <div className="flex-grow"></div>
        <div className="flex items-center justify-center">
          <button
              onClick={handleLogout}
              className="bottom-0 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors items-center justify-center"
            >
              Logout
          </button>
        </div>
    </div>
    );
  };
  
export default Sidenav;
