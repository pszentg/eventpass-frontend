"use client";
import { ReactNode, useEffect } from "react";
import AdminSidenav from "@/components/Common/Sidenav/AdminSidenav";
import styles from "./layout.module.css";
import { useRouter } from "next/navigation";
import useUserValidation from "@/hooks/useUserValidation";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { user, isValidating, error } = useUserValidation();
  const router = useRouter();

  useEffect(() => {
    if (error) {
      router.push("/");
    }
  });

  if (isValidating) {
    return <div className={styles.spinner}>Loading...</div>; // Add your spinner component or styling here
  }

  return (
    <div className={styles.container}>
      <AdminSidenav />
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default AdminLayout;
