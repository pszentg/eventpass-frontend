"use client";
import { ReactNode, useContext, useEffect } from "react";
import UserSidenav from "@/components/Common/Sidenav/UserSidenav";
import styles from "./layout.module.css";
import useSWR from "swr";
import { fetcher } from "../auth/fetcher";
import UserContext from "@/context/UserContext";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface LayoutProps {
  children: ReactNode;
}

const ClientDashboardLayout = ({ children }: LayoutProps) => {
  const {
    data: fetchedUser,
    error,
    isValidating,
  } = useSWR<User>("/auth/users/me", fetcher);

  const context = useContext(UserContext);

  if (!context) {
    throw new Error("UserLayout must be used within a UserProvider");
  }

  const { user, setUser } = context;

  useEffect(() => {
    if (fetchedUser) {
      setUser(fetchedUser);
    }
  }, [fetchedUser, setUser]);
  if (isValidating) {
    return <div>Loading...</div>; // Replace with your spinner component
  }

  if (error) {
    return <div>Error loading user data</div>; // Handle error appropriately
  }

  return (
    <div className={styles.container}>
      <UserSidenav />
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default ClientDashboardLayout;
