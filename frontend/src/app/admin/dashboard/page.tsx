"use client";
import { useContext } from "react";
import UserContext from "@/context/UserContext";
import AdminSidenav from "@/components/Common/Sidenav/AdminSidenav";
import styles from "./dashboard.module.css";

const AdminDashboard = () => {
  const { user } = useContext(UserContext);

  return (
    <div className={styles.container}>
      <AdminSidenav />
      <div className={styles.content}>
        <h1>Admin Dashboard</h1>
        {user ? (
          <div>
            <p>Welcome, {user.name}</p>
            <p>Your role: {user.role}</p>
            {/* Add more admin-specific components here */}
          </div>
        ) : (
          <p>Loading user information...</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
