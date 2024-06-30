"use client";
import { ReactNode, useContext, useEffect } from "react";
import AdminSidenav from "@/components/Common/Sidenav/AdminSidenav";
import styles from "./layout.module.css";
import useSWR from "swr";
import { fetcher } from "../auth/fetcher";
import UserContext from "@/context/UserContext";
import { User } from "@/types";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const {
    data: fetchedUser,
    error,
    isValidating,
  } = useSWR<User>("/auth/users/me", fetcher);

  const context = useContext(UserContext);

  if (!context) {
    throw new Error("AdminLayout must be used within a UserProvider");
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

  if (isValidating) {
    return <div className={styles.spinner}>Loading...</div>; // Add your spinner component or styling here
  }

  return (
    <div className={styles.container}>
      <AdminSidenav />
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default AdminLayout;
