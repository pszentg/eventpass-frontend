import React from "react";
import styles from "./UserInfo.module.css";

const UserInfo = ({ user }: { user: any }) => {
  return (
    <div className={styles.userInfo}>
      <h2 className={styles.userInfoTitle}>User Information</h2>
      <p className={styles.userInfoText}>
        <strong>Name:</strong> {user.name}
      </p>
      <p className={styles.userInfoText}>
        <strong>Email:</strong> {user.email}
      </p>
      {/* Add more user information as needed */}
    </div>
  );
};

export default UserInfo;
