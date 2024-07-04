import React from "react";
import styles from "./UserInfo.module.css";
import QRCode from "qrcode.react";
import { usePathname } from "next/navigation";

const UserInfo = ({ user }: { user: any }) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL; // Ensure this is set in your environment variables
  const qrCodeValue = `${BASE_URL}/add_user_to_group/${user.id}`;

  return (
    <div className={styles.userInfo}>
      <h2 className={styles.userInfoTitle}>User Information</h2>
      <p className={styles.userInfoText}>
        <strong>Name:</strong> {user.name}
      </p>
      <p className={styles.userInfoText}>
        <strong>Email:</strong> {user.email}
      </p>
      <div className={styles.qrCode}>
        <QRCode value={qrCodeValue} />
      </div>
      {/* Add more user information as needed */}
    </div>
  );
};

export default UserInfo;
