import React, { useState } from "react";
import "./Login.css";

// Accessible & semantic login form component.
// Adds id/name, labels, autocomplete hints, and allows pressing Enter.
const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const API_BASE = process.env.REACT_APP_API_URL || "";

  const handleLogin = async (e) => {
    if (e) e.preventDefault(); // support form submit
    const { username, password } = credentials;
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const base = API_BASE || ""; // relative path fallback
      const url = `${base}/api/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem("token", data.token);
          onLogin();
        } else {
          setError(data.error || "Invalid username or password.");
        }
      } else {
        const err = await response.json().catch(() => ({}));
        setError(err.error || "Failed to connect to the server.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-heading">
        <span className="login-kicker">Your daily baseline</span>
        <h1>Welcome back</h1>
        <p>Keep the small promises that move your health forward.</p>
      </div>
      <form onSubmit={handleLogin} aria-label="Login form" className="login-form">
        <div className="login-fields">
          <label htmlFor="login-username">
            Username
          </label>
          <input
            id="login-username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="Username"
            value={credentials.username}
            onChange={(e) =>
              setCredentials((prev) => ({ ...prev, username: e.target.value }))
            }
            aria-required="true"
          />
          <label htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials((prev) => ({ ...prev, password: e.target.value }))
            }
            aria-required="true"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="login-submit"
          aria-busy={submitting ? "true" : "false"}
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
      {error && (
        <p role="alert" className="login-error">
          {error}
        </p>
      )}
    </div>
  );
};

export default Login;
