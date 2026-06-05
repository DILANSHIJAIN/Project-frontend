import { NavLink } from "react-router-dom";
import "./Footer.css";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        <div className="footer-brand">
          <h2>Ticketing System</h2>
          <p>Manage tickets easily and efficiently.</p>
        </div>

        <div className="footer-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>

        <div className="footer-auth">
          <NavLink to="/register">Register</NavLink>
          <NavLink to="/login">Login</NavLink>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Ticketing System. All rights reserved.</p>
      </div>
    </footer>
  );
};