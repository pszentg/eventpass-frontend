"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";
import Login from "../components/Login/Login";
import styles from "./home.module.css";

const HomePage = () => {
  const { validateToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const isValid = await validateToken();
      if (isValid) {
        router.push("/dashboard");
      }
    };
    checkToken();
  }, [validateToken, router]);

  return (
    <div className={styles.container}>
      <Login />
    </div>
  );
};

export default HomePage;
