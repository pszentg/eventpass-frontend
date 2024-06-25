"use client";
import { useContext } from "react";
import UserContext from "../../context/UserContext";
import UserInfo from "../../components/UserInfo/UserInfo";
import styles from "./dashboard.module.css";
import UserSidenav from "@/components/Common/Sidenav/UserSidenav";

const Dashboard = () => {
  const { user } = useContext(UserContext);

  return (
    <div className={styles.container}>
      <UserSidenav />
      <div className={styles.content}>
        {user ? <UserInfo user={user} /> : <p>Loading user information...</p>}
      </div>
    </div>
  );
};

export default Dashboard;
