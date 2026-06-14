import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://10.238.173.228:5000";

export const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }
    
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long.");
    }

    setIsSubmitting(true);
    try {
      console.log("📡 Attempting Reset Password fetch to:", `${API_URL}/api/auth/reset-password/${token}`);
      const response = await fetch(`${API_URL}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      let data = {};
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error(`Server error (${response.status}): ${response.statusText}`);
      }

      if (response.ok) {
        toast.success("Password reset successful! Please login with your new password.");
        navigate("/login");
      } else {
        toast.error(data.message || "Invalid or expired token.");
      }
    } catch (error) {
      console.error("Reset Password Error:", error);
      let errorMessage = "An unknown error occurred.";
      if (error.name === "TypeError" && error.message === "Failed to fetch") {
        errorMessage = `🌐 Network Error: Cannot connect to ${API_URL || 'the backend'}. Check your .env.local and ensure the server is running on your network.`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section style={{ background: "#0f172a", minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div className="container">
        <div className="login-form-container" style={{ maxWidth: "500px", margin: "0 auto", backgroundColor: "#1e293b", padding: "4rem", borderRadius: "1rem" }}>
          <h1 className="main-heading mb-3">Set New Password</h1>
          <p style={{ fontSize: "1.4rem", color: "#94a3b8", marginBottom: "2rem" }}>
            Please enter your new password below.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label className="form-label" style={{ display: "block", marginBottom: "0.8rem", fontSize: "1.6rem" }}>New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ 
                  width: "100%",
                  padding: "1rem",
                  backgroundColor: "white", 
                  color: "black", 
                  border: "1px solid #475569",
                  borderRadius: "0.5rem"
                }}
              />
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <label className="form-label" style={{ display: "block", marginBottom: "0.8rem", fontSize: "1.6rem" }}>Confirm New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ 
                  width: "100%",
                  padding: "1rem",
                  backgroundColor: "white", 
                  color: "black", 
                  border: "1px solid #475569",
                  borderRadius: "0.5rem"
                }}
              />
            </div>

            <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <input 
                type="checkbox" 
                id="showPass" 
                checked={showPassword} 
                onChange={() => setShowPassword(!showPassword)}
                style={{ width: "2rem", height: "2rem", cursor: "pointer" }}
              />
              <label htmlFor="showPass" style={{ fontSize: "1.4rem", color: "#94a3b8", cursor: "pointer" }}>
                Show Passwords
              </label>
            </div>

            <button 
              type="submit" 
              className="btn btn-submit" 
              disabled={isSubmitting}
              style={{ width: "100%", opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? "Updating..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};