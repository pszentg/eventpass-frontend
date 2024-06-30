// /app/settings/page.tsx

"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import styles from "../../styles/settings.module.css";

interface Settings {
  name: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    name: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Handle form submission, e.g., save settings to a database or update user preferences
    console.log("Settings saved:", settings);
  };

  return (
    <div className={styles.settings}>
      <h1>Settings</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={settings.name}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Save Settings</button>
      </form>
    </div>
  );
}
