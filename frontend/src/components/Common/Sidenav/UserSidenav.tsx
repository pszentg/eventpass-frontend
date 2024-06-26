import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import styles from "./Sidenav.module.css";

const UserSidenav = () => {
  const router = useRouter();

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
          <a href="/dashboard">Dashboard</a>
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

export default UserSidenav;
