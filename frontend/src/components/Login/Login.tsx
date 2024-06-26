"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../../hooks/useAuth";
import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await login(email, password);
  };

  const handleRegisterClick = () => {
    router.push("/register");
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="default@example.com"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>
        <div className={styles.footer}>
          <p>
            <button
              onClick={handleRegisterClick}
              className={styles.registerButton}
            >
              Create new account
            </button>
          </p>
          <p>
            <a href="/reset-password" className={styles.link}>
              Reset Password
            </a>
          </p>
          <p>
            <a href="/privacy-policy" className={styles.link}>
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
