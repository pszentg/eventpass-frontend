"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import wretch from "wretch";
import Cookies from "js-cookie";
import { AuthActions } from "@/app/auth/utils";

interface ApiResponse {
  status: string;
  error?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const AddUserToGroupPage = () => {
  const pathname = usePathname();
  const { getToken } = AuthActions();
  const token = getToken("access");

  useEffect(() => {
    const segments = pathname.split("/");
    const userId = segments[segments.length - 1];
    const groupId = Cookies.get("selectedGroup");

    if (userId) {
      wretch(`${BASE_URL}/api/users/${userId}/add-group/${groupId}/`)
        .auth(`Bearer ${token}`)

        .post()
        .json((data: ApiResponse) => {
          if (data.status === "User added to group") {
            console.log("User added to group:", data);
          } else {
            console.error("Error:", data.error);
          }
        })
        .catch((error) => {
          console.error("Error adding user to group:", error);
        });
    }
  }, [pathname]);

  return <div>Adding user to group...</div>;
};

export default AddUserToGroupPage;
