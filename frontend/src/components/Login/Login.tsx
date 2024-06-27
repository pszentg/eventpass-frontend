"use client";
import wretch from "wretch";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./Login.module.css";
import { AuthActions } from "@/app/auth/utils";

interface UserResponse {
  role: string;
}

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { login, storeToken, getToken } = AuthActions();
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      await login(email, password).json((json) => {
        storeToken(json.access, "access");
        storeToken(json.refresh, "refresh");
      });
    } catch (err: any) {
      setError(err.message);
    }

    const userResponse = await wretch(`${BASE_URL}/auth/users/me`)
      .auth(`Bearer ${getToken("access")}`)
      .get()
      .json<UserResponse>();
    if (userResponse.role === "client") {
      router.push("/admin/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  const handleRegisterClick = () => {
    router.push("/register");
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Login</h1>
        <form onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}
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
