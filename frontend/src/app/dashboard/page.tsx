"use client";
import UserInfo from "@/components/UserInfo/UserInfo";
import styles from "./dashboard.module.css";
import { useContext } from "react";
import UserContext from "@/context/UserContext";

const Dashboard = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("Dashboard must be used within a UserProvider");
  }

  const { user } = context;

  if (!user) {
    return <p>Loading user information...</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {user ? <UserInfo user={user} /> : <p>Loading user information...</p>}
      </div>
    </div>
  );
};

export default Dashboard;
