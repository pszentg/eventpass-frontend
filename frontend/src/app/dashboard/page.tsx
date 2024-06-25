'use client';

import { QRCodeSVG } from 'qrcode.react';
import React, { useContext } from 'react';
import Spinner from '../components/Common/Spinner';
import { UserContext } from '../context/UserContext';

const BASE_URL = process.env.BASE_URL ? process.env.BASE_URL : 'http://localhost:8000';
const ADD_GROUP_URL = `${BASE_URL}/add_to_group/`;

export default function Dashboard() {
  const { user, isLoading, isValidating } = useContext(UserContext);

  if (isLoading || isValidating) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 text-center">
        <h1 className="text-2xl font-bold mb-4">Hi, {user?.name}!</h1>
        <div className="flex flex-col items-center justify-center">
          <QRCodeSVG value={`${ADD_GROUP_URL}${user?.id}`} />
        </div>
        <ul className="mb-4">
          <li>Username: {user?.name}</li>
          <li>Email: {user?.email}</li>
        </ul>
      </div>
    </div>
  );
}
