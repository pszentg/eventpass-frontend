"use client";
import { useContext } from "react";
import UserContext from "../../context/UserContext";
import styles from "./admin-dashboard.module.css";
import Sidenav from "@/components/Common/Sidenav/Sidenav";

const AdminDashboard = () => {
  const { user } = useContext(UserContext);

  return (
    <div className={styles.container}>
      <Sidenav />
      <div className={styles.content}>
        <h1>Admin Dashboard</h1>
        {user ? (
          <div>
            <p>Welcome, {user.name}</p>
            <p>Your role: {user.role}</p>
            {/* Add more admin-specific information or actions here */}
            <div className={styles.adminActions}>
              <button className={styles.button}>Manage Users</button>
              <button className={styles.button}>View Reports</button>
              <button className={styles.button}>Settings</button>
            </div>
          </div>
        ) : (
          <p>Loading user information...</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
