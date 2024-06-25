import { useRouter } from "next/navigation";
import styles from "./Sidenav.module.css";
import Cookies from "js-cookie";
import UserContext from "@/context/UserContext";
import { useContext } from "react";

const Sidenav = () => {
  const router = useRouter();
  const { user } = useContext(UserContext);

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
        {user && user.role === "client" && (
          <li className={styles.navItem}>
            <a href="/admin-dashboard">Admin Dashboard</a>
          </li>
        )}
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

export default Sidenav;
