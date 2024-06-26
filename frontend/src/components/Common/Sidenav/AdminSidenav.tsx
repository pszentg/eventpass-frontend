import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import Cookies from "js-cookie";
import styles from "./Sidenav.module.css";

const AdminSidenav = () => {
  const router = useRouter();
  const { user } = useUserContext();

  const handleLogout = () => {
    // Clear tokens and user data
    Cookies.remove("access");
    Cookies.remove("refresh");
    router.push("/");
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
