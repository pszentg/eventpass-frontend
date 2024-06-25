"use client";
import { useContext } from "react";
import UserContext from "@/context/UserContext";
import AdminSidenav from "@/components/Common/Sidenav/AdminSidenav";
import ManageGroups from "@/components/ManageGroups/ManageGroups";
import styles from "./groups.module.css";

const AdminGroups = () => {
  const { user } = useContext(UserContext);

  return (
    <div className={styles.container}>
      <AdminSidenav />
      <div className={styles.content}>
        <h1>Manage Groups</h1>
        {user ? (
          <div>
            <p>Welcome, {user.name}</p>
            <p>Your role: {user.role}</p>
            <ManageGroups />
          </div>
        ) : (
          <p>Loading user information...</p>
        )}
      </div>
    </div>
  );
};

export default AdminGroups;
