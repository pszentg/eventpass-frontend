"use client";
import { ReactNode } from "react";
import AdminSidenav from "@/components/Common/Sidenav/AdminSidenav";
import styles from "./layout.module.css";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={styles.container}>
      <AdminSidenav />
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default AdminLayout;
