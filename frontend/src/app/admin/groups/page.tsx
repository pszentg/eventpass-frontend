"use client";
import ManageGroups from "@/components/ManageGroups/ManageGroups";
import styles from "./groups.module.css";
import UserContext from "@/context/UserContext";
import { useContext } from "react";

const AdminGroups = () => {
  const user = useContext(UserContext);

  return (
    <div className={styles.content}>
      <h1>Manage Groups</h1>
      {user ? (
        <div>
          <p>Welcome, {user.name}</p>
          <p>Your role: {user.role}</p>
          <ManageGroups />
        </div>
      ) : (
        <p>Loading group information...</p>
      )}
    </div>
  );
};

export default AdminGroups;
