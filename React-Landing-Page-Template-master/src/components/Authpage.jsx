import React, { useState } from "react";

const AuthPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div style={{
      backgroundImage: 'url("/img/auth-bg.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "10px",
        padding: "40px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
      }}>
        <h2 style={{ fontWeight: "800", marginBottom: "30px", color: "#333", textAlign: "center" }}>
          {isRegistering ? "Create Account" : "Welcome Back"}
        </h2>

        <form>
          {isRegistering && (
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" className="form-control" placeholder="John Doe" />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-control" placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" placeholder="••••••••" />
          </div>
          {isRegistering && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" className="form-control" placeholder="••••••••" />
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

        <p style={{ marginTop: "15px", fontSize: "14px", textAlign: "center" }}>
          {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            style={{ color: "#5ca9fb", cursor: "pointer", fontWeight: "600" }}
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
