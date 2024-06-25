"use client";
import { useUserContext } from "@/context/UserContext";
import styles from "./dashboard.module.css";

const AdminDashboard = () => {
  const { user } = useUserContext();

  return (
    <div className={styles.container}>
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
