"use client";
import UserContext from "@/context/UserContext";
import styles from "./dashboard.module.css";
import { useContext, useState } from "react";
import AdminSidenav from "@/components/Common/Sidenav/AdminSidenav";

const AdminDashboard = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("AdminDashboard must be used within a UserProvider");
  }

  const { user } = context;

  if (!user) {
    return <p>Loading user information...</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Admin Dashboard</h1>
        <div>
          <p>Welcome, {user.name}</p>
          <p>Your role: {user.role}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
