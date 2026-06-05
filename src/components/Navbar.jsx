import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../store/auth"; // Assuming useAuth is available
import "./Navbar.css";

export const Navbar = () => {
  const { isLoggedIn, isAdmin } = useAuth(); // Get login status and admin status

    const navLinkStyle = ({ isActive }) => ({
        color: isActive ? "#60a5fa" : "#a7d9ff", // Light blue for non-active, vibrant blue for active
        textDecoration: "none",
        fontSize: "1.8rem", // Slightly larger attractive size
        fontWeight: "700", 
        display: "flex",
        alignItems: "center",
        gap: "0.8rem",
        padding: "0.8rem 1.2rem", // Balanced padding
        whiteSpace: "nowrap", // Prevents text from breaking inside links
        borderRadius: "0.8rem",
        transition: "all 0.3s ease",
        background: isActive ? "rgba(96, 165, 250, 0.15)" : "transparent",
    });

    return (
        <header style={{ 
            background: "#1e3a8a", // Matches the footer color exactly
            borderBottom: "2px solid #334155", // Subtler separator
            padding: "1.2rem 0", // Slightly larger height
            position: "sticky",
            top: 0,
            zIndex: 1000,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)"
        }}>
            <div className="container" style={{ 
                display: "flex", 
                justifyContent: "space-between", // Logo on left, Nav links on right
                alignItems: "center",
                maxWidth: "100%", // Ensures it stays within viewport width
                margin: "0 auto",
                padding: "0 2rem",
                flexWrap: "wrap", // Prevents horizontal overflow/scrolling
                gap: "2rem" 
            }}>
                <div className="logo-brand">
                    <NavLink to="/" style={{ 
                        fontSize: "3.5rem", // Larger prominent branding
                        fontWeight: "900", // Bolder weight for the logo
                        color: "#60a5fa", 
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "1.2rem",
                        letterSpacing: "-1px" // Modern logo kerning
                    }}>
                        🚀 <span style={{ color: "#fff" }}>SmartDesk</span>AI
                    </NavLink>
                </div>
                <nav>
                    <ul style={{ 
                        display: "flex", 
                        listStyle: "none", 
                        gap: "0.4rem", 
                        alignItems: "center",
                        flexWrap: "wrap", // Wraps items if screen is too narrow
                        margin: 0,
                        padding: 0
                    }}>
                        <li><NavLink to="/" style={navLinkStyle}>🏠 Home</NavLink></li>
                        <li><NavLink to="/about" style={navLinkStyle}>ℹ️ About</NavLink></li>
                        <li><NavLink to="/services" style={navLinkStyle}>🛠️ Services</NavLink></li>
                        <li><NavLink to="/contact" style={navLinkStyle}>📞 Contact</NavLink></li>
                        
                        {isLoggedIn && (
                            <>
                                <div style={{ width: "1px", height: "2.4rem", background: "#334155", margin: "0 1.2rem" }} />
                                <li><NavLink to="/chat" style={navLinkStyle}>💬 Chat</NavLink></li>
                                <li><NavLink to="/tickets" style={navLinkStyle}>🎫 My Tickets</NavLink></li>
                                <li><NavLink to="/dashboard" style={navLinkStyle}>📊 Dashboard</NavLink></li>
                            </>
                        )}

                        {isAdmin && isLoggedIn && (
                            <li><NavLink to="/admin-dashboard" style={navLinkStyle}>⚙️ Admin</NavLink></li>
                        )}

                        <div style={{ width: "1px", height: "2.4rem", background: "#334155", margin: "0 1.2rem" }} />
                        
                        {isLoggedIn ? (
                            <li><NavLink to="/logout" style={navLinkStyle}>🚪 Logout</NavLink></li>
                        ) : (
                            <>
                                <li><NavLink to="/register" style={navLinkStyle}>📝 Register</NavLink></li>
                                <li><NavLink to="/login" style={navLinkStyle}>🔐 Login</NavLink></li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};