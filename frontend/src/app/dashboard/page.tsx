"use client";
import { useContext } from "react";
import UserContext from "../../context/UserContext";
import UserInfo from "../../components/UserInfo/UserInfo";
import styles from "./dashboard.module.css";
import Sidenav from "@/components/Common/Sidenav/Sidenav";

const Dashboard = () => {
  const { user } = useContext(UserContext);

  return (
    <div className={styles.container}>
      <Sidenav />
      <div className={styles.content}>
        {user ? <UserInfo user={user} /> : <p>Loading user information...</p>}
      </div>
    </div>
  );
};

export default Dashboard;
