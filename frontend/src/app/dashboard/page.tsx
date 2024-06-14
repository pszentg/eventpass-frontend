'use client';

import useSWR from 'swr';
import { fetcher } from '@/app/fetcher';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import Spinner from '../components/Generic/Spinner';

const BASE_URL = process.env.BASE_URL ? process.env.BASE_URL : 'http://localhost:8000';
const ADD_GROUP_URL = `${BASE_URL}/add_to_group/`;

export default function Dashboard() {
  const router = useRouter();

  const { data: user, isValidating } = useSWR('/auth/users/me', fetcher);
  const isClient = () => user.role === 'client';

  if (isValidating) {
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
