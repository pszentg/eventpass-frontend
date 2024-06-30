import { useRouter } from "next/navigation";
import styles from "./Sidenav.module.css";
import { AuthActions } from "@/app/auth/utils";

const UserSidenav = ({ user }) => {
  const router = useRouter();
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
