"use client";
import { useRouter } from "next/navigation";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.push("/");
  };

  return (
    <nav className={styles.navbar}>
      <button onClick={handleBackClick} className={styles.button}>
        Vissza a főoldalra
      </button>
    </nav>
  );
};

export default Navbar;
