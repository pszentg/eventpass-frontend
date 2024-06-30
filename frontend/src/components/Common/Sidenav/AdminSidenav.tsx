import { useRouter } from "next/navigation";
import styles from "./Sidenav.module.css";
import { useContext } from "react";
import UserContext from "@/context/UserContext";
import { AuthActions } from "@/app/auth/utils";

const AdminSidenav = () => {
  const router = useRouter();
  const { logout, removeTokens } = AuthActions();

  const handleLogout = () => {
    logout()
      .res(() => {
        removeTokens();
        router.push("/");
      })
      .catch(() => {
        removeTokens();
        router.push("/");
      });
  };

  return (
    <div className={styles.sidenav}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <a href="/admin/dashboard">Admin Dashboard</a>
        </li>
        <li className={styles.navItem}>
          <a href="/admin/profile">Profile</a>
        </li>
        <li className={styles.navItem}>
          <a href="/admin/settings">Settings</a>
        </li>
        <li>
          <a href="/admin/groups" className={styles.navItem}>
            Manage Groups
          </a>
        </li>
        <li>
          <a href="/admin/events" className={styles.navItem}>
            Manage Events
          </a>
        </li>
      </ul>
      <button onClick={handleLogout} className={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
};

export default AdminSidenav;
