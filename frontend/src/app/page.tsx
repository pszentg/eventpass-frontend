"use client";
import Login from "@/components/Login/Login";
import styles from "./home.module.css";

const HomePage = () => {
  return (
    <div className={styles.container}>
      <Login />
    </div>
  );
};

export default HomePage;
