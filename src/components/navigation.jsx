import React from "react";
import { Link } from "react-router-dom";

export const Navigation = () => {
  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top">
      <div className="container nav-inner">
        <a href="#page-top" className="navbar-brand page-scroll brand">
          <img src="img/logo.png" alt="SentiStock" className="brand-logo" />
          <span className="brand-text">SENTISTOCK</span>
        </a>

        <ul className="nav navbar-nav navbar-right nav-links">
          <li><a href="#about" className="page-scroll">About</a></li>
          <li><a href="#testimonials" className="page-scroll">Testimonials</a></li>
          <li><a href="#contact" className="page-scroll">Contact</a></li>
          <li><Link to="/auth" className="auth-link">Register/Sign In</Link></li>
        </ul>
      </div>
    </nav>
  );
};
