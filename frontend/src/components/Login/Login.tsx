"use client";
import { useState, useContext, FormEvent } from "react";
import { useRouter } from "next/navigation";
import wretch from "wretch";
import UserContext from "../../context/UserContext";
import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { setUser } = useContext(UserContext);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await wretch("http://localhost:8000/auth/jwt/create/")
        .post({ email, password })
        .json<{ access: string; refresh: string }>();

      const { access, refresh } = response;

      // Store tokens in local storage
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      // Fetch the user object
      const user = await wretch("http://localhost:8000/auth/users/me/")
        .auth(`Bearer ${access}`)
        .get()
        .json();

      // Store user in context
      setUser(user);

      // Redirect to the home page or dashboard
      router.push("/dashboard");
    } catch (error) {
      setError("Invalid credentials. Please try again.");
    }
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
      </div>
    </div>
  );
};

export default Login;
