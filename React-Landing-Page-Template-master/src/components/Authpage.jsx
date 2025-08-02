import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const AuthPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("https://sentistock-backend.onrender.com/api/stocks/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (res.ok) {
          history.push("/dashboard");
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("full_name");
        }
      } catch (err) {
        console.error("Token check failed:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("full_name");
      }
    };

    checkToken();
  }, [history]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegistering && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const endpoint = isRegistering
      ? "https://sentistock-backend.onrender.com/api/register/"
      : "https://sentistock-backend.onrender.com/api/login/";

    const payload = isRegistering
      ? { username: email, password: password, full_name: fullName }
      : { username: email, password: password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("full_name", data.full_name || data.name || "User");
        history.push("/dashboard");
      } else {
        alert(data.error || "Authentication failed.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error");
    }
  };

  return (
    <div
      style={{
        backgroundImage: 'url("/img/auth-bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          background: "rgba(0, 0, 0, 0.75)",
          color: "#fff",
          borderRadius: "10px",
          padding: "40px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(8px)",
        }}
      >
        <img
          src="/img/logo.ico"
          alt="logo"
          style={{ width: 60, margin: "0 auto 10px", display: "block" }}
        />
        <h1
          style={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#5ca9fb",
            marginBottom: "10px",
          }}
        >
          SentiStock
        </h1>

        <h2
          style={{
            fontWeight: "800",
            marginBottom: "30px",
            color: "#fff",
            textAlign: "center",
          }}
        >
          {isRegistering ? "Create Account" : "Welcome Back"}
        </h2>

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {isRegistering && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          <button
            type="submit"
            className="btn btn-custom btn-block"
            style={{ width: "100%", marginTop: "20px" }}
          >
            {isRegistering ? "Register" : "Sign In"}
          </button>
        </form>

        <p
          style={{
            marginTop: "15px",
            fontSize: "14px",
            textAlign: "center",
          }}
        >
          {isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <span
            style={{
              color: "#5ca9fb",
              cursor: "pointer",
              fontWeight: "600",
            }}
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Sign In" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
