"use client";
import { ReactNode, useEffect } from "react";
import UserSidenav from "@/components/Common/Sidenav/UserSidenav";
import styles from "./layout.module.css";
import { useRouter } from "next/navigation";
import useUserValidation from "@/hooks/useUserValidation";

const ClientDashboardLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { user, isValidating, error } = useUserValidation();

  useEffect(() => {
    if (error) {
      router.push("/");
    } else if (user && user.role !== "client") {
      router.push("/dashboard");
    }
  }, [user, error, router]);

  if (isValidating) {
    return <div className={styles.spinner}>Loading...</div>; // Add your spinner component or styling here
  }

  return (
    <div className={styles.container}>
      <UserSidenav />
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default ClientDashboardLayout;
