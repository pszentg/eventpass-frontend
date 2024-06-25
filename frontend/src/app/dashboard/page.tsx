"use client";
import { useContext } from "react";
import UserContext from "../../context/UserContext";
import UserInfo from "../../components/UserInfo/UserInfo";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const { user } = useContext(UserContext);

  return (
    <div className={styles.container}>
      {user ? <UserInfo user={user} /> : <p>Loading user information...</p>}
    </div>
  );
};

export default Dashboard;
