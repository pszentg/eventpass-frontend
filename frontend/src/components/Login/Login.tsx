"use client";
import wretch from "wretch";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthActions } from "@/app/auth/utils";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
} from "@mui/material";

interface UserResponse {
  role: string;
}

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { login, storeToken, getToken } = AuthActions();
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
      return;
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
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" style={{ marginBottom: 16 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="default@example.com"
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: 16 }}
          >
            Login
          </Button>
        </form>
        <Box mt={2}>
          <Button
            onClick={handleRegisterClick}
            color="secondary"
            fullWidth
            variant="outlined"
          >
            Create new account
          </Button>
        </Box>
        <Box mt={2} textAlign="center">
          <Link href="/reset-password" underline="hover">
            Reset Password
          </Link>
          <br />
          <Link href="/privacy-policy" underline="hover">
            Privacy Policy
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
