"use client";

import { useState, ChangeEvent, FormEvent, useContext, useEffect } from "react";
import useSWR from "swr";
import wretch from "wretch";
import UserContext from "@/context/UserContext";
import { AuthActions } from "../auth/utils"; // Import AuthActions
import styles from "./settings.module.css";
import EventAdminSettings from "@/components/EventAdmin/Settings";

interface User {
  id: string;
  name: string;
}

const fetcher = (url: string, options: RequestInit) =>
  wretch(url).options(options).get().json();

export default function SettingsPage() {
  const { user, setUser } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [password, setPassword] = useState(""); // State to hold the password

  const { getToken } = AuthActions(); // Correctly refer to getToken

  useEffect(() => {
    if (user?.name) {
      setNewName(user.name);
    }
  }, [user]);

  const { mutate } = useSWR(`/auth/users/me`, fetcher, {
    revalidateOnFocus: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleNameClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    if (user) {
      const updatedUser = { ...user, name: newName };
      setUser(updatedUser);

      const token = await getToken("access");

      await mutate(
        async () => {
          const response = await wretch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/auth/users/me/`
          )
            .auth(`Bearer ${token}`) // Use .auth() to set the Bearer token
            .put({
              name: newName,
              current_password: password, // Sending the current password
            })
            .res();

          if (!response.ok) {
            throw new Error("Failed to update user");
          }

          return updatedUser;
        },
        { revalidate: false }
      );
    }
  };

  return (
    <div className={styles.settings}>
      <h1>Settings</h1>
      <form onSubmit={handleSave}>
        <div className={styles.field}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newName}
            onChange={handleChange}
            className={styles.settingsInput}
            onClick={handleNameClick}
            readOnly={!isEditing}
            style={{ cursor: !isEditing ? "pointer" : "text" }}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="password">Current Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Current Password"
            className={styles.settingsInput}
            required
          />
        </div>
        <button type="submit" className={styles.saveButton}>
          Save Settings
        </button>
      </form>
      {user?.role === "admin" && <EventAdminSettings />}
    </div>
  );
}
