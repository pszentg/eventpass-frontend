import { useRouter } from "next/navigation";
import styles from "./Sidenav.module.css";
import { useContext } from "react";
import UserContext from "@/context/UserContext";
import { AuthActions } from "@/app/auth/utils";

const AdminSidenav = () => {
  const router = useRouter();
  const user = useContext(UserContext);
  const { logout, removeTokens } = AuthActions();

  const handleLogout = () => {
    logout()
      .res(() => {
        removeTokens();
        logout();
        router.push("/");
      })
      .catch(() => {
        removeTokens();
        logout();
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
          <a href="/admin/groups">Manage Groups</a>
        </li>
        <li className={styles.navItem}>
          <a href="/profile">Profile</a>
        </li>
        <li className={styles.navItem}>
          <a href="/settings">Settings</a>
        </li>
      </ul>
      <button onClick={handleLogout} className={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
};

export default AdminSidenav;
