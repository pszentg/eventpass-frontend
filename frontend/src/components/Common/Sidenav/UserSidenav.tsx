import { useRouter } from "next/navigation";
import styles from "./Sidenav.module.css";
import { AuthActions } from "@/app/auth/utils";
import UserContext from "@/context/UserContext";
import { useContext } from "react";

const UserSidenav = () => {
  const user = useContext(UserContext);
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
          <a href="/dashboard">Dashboard</a>
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
