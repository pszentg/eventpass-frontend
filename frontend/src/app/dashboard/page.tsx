"use client";

import useSWR from "swr";
import { fetcher } from "@/app/fetcher";
import { AuthActions } from "@/app/auth/utils";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";

const BASE_URL = process.env.BASE_URL? process.env.BASE_URL : "http://localhost:8000";
const ADD_GROUP_URL = `${BASE_URL}/add_to_group/`

export default function Home() {
  const router = useRouter();

  const { data: user } = useSWR("/auth/users/me", fetcher);

  const { logout, removeTokens } = AuthActions();

  const handleLogout = () => {
    logout()
      .res(() => {
        removeTokens();

        router.push("/");
      })
      .catch(() => {
        removeTokens();
        router.push("/");
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 text-center">
        <h1 className="text-2xl font-bold mb-4">Hi, {user?.name}!</h1>
        <div className="flex flex-col items-center justify-center">
          <QRCodeSVG value={ `${ADD_GROUP_URL}${user?.id}`} />
        </div>
        <ul className="mb-4">
          <li>Username: {user?.name}</li>
          <li>Email: {user?.email}</li>
        </ul>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors justify-center"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
