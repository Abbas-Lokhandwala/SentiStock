import React from "react";
import { Link } from "react-router-dom";

export const Navigation = () => {
  return (
    <nav
      id="menu"
      className="navbar"
      style={{
        backgroundColor: "#0a192f",
        padding: "15px 30px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        boxShadow: "0 0 12px rgba(0, 255, 255, 0.1)"
      }}
    >
      <div
        className="container"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <a
          className="navbar-brand page-scroll"
          href="#page-top"
          style={{ display: "flex", alignItems: "center", gap: "12px" }}
        >
          <img
            src="img/logo.png"
            alt="SentiStock Logo"
            style={{
              height: "48px",
              width: "48px",
              objectFit: "contain"
            }}
          />
          <span
            style={{
              fontWeight: "900",
              fontSize: "26px",
              letterSpacing: "1px",
              color: "#5ca9fb"
            }}
          >
            SENTISTOCK
          </span>
        </a>

        <ul className="nav navbar-nav navbar-right" style={{ display: "flex", gap: "20px" }}>
          <li><a href="#about" className="page-scroll" style={{ color: "#fff" }}>About</a></li>
          <li><a href="#testimonials" className="page-scroll" style={{ color: "#fff" }}>Testimonials</a></li>
          <li><a href="#team" className="page-scroll" style={{ color: "#fff" }}>Team</a></li>
          <li><a href="#contact" className="page-scroll" style={{ color: "#fff" }}>Contact</a></li>
          <li><Link to="/auth" style={{ color: "#5ca9fb", fontWeight: "bold" }}>Register/Sign In</Link></li>
        </ul>
      </div>
    </nav>
  );
};
