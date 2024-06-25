"use client";
import styles from "./home.module.css";
import Login from "../components/Login/Login";

export default function Home() {
  return (
    <div className={styles.container}>
      <Login />
    </div>
  );
}
