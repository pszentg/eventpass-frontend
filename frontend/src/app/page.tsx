"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Login from "@/components/Login/Login";
import styles from "./home.module.css";
import useUserValidation from "@/hooks/useUserValidation";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const { user, isValidating, error } = useUserValidation();
      if (user.role) {
        if (user.role === "client") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    };
    checkToken();
  }, [useUserValidation, router]);

  return (
    <div className={styles.container}>
      <Login />
    </div>
  );
};

export default HomePage;
