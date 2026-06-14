import { useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://10.238.173.228:5000";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.error("Please enter your email address.");
    }

    setIsSubmitting(true);
    try {
      console.log("📡 Attempting Forgot Password fetch to:", `${API_URL}/api/auth/forgot-password`);
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      let data = {};
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const statusText = response.status === 404 ? "Route not found on server." : response.statusText;
        throw new Error(`Server error (${response.status}): ${statusText}`);
      }

      if (response.ok) {
        toast.success(data.message || "Password reset link sent to your email.");
        setEmail("");
      } else {
        toast.error(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      let errorMessage = "An unknown error occurred.";
      if (error.name === "TypeError" && error.message === "Failed to fetch") {
        errorMessage = `🌐 Network Error: Cannot reach ${API_URL || 'the server'}. If this address is old/wrong, update .env.local and RESTART Vite.`;
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
        <div className="login-form-container" style={{ maxWidth: "500px", margin: "0 auto" }}>
          <h1 className="main-heading mb-3">Reset Password</h1>
          <p style={{ fontSize: "1.4rem", color: "#94a3b8", marginBottom: "2rem" }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="email" className="form-label">Email Address or Username</label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                style={{ 
                  backgroundColor: "white", 
                  color: "black", 
                  border: "1px solid #475569" 
                }}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-submit" 
              disabled={isSubmitting}
              style={{ width: "100%", marginTop: "1rem", opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>

            <div style={{ marginTop: "2rem", textAlign: "center" }}>
              <p>
                Remember your password?{" "}
                <NavLink to="/login" style={{ textDecoration: "underline", color: "var(--btn-color)" }}>
                  Back to Login
                </NavLink>
              </p>
            </div>
          </form>
        </div>
      </div>
      
      <style>{`
        .login-form-container {
          background-color: #1e293b;
          padding: 4rem;
          border-radius: 1rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        .form-label {
          display: block;
          margin-bottom: 0.8rem;
          font-size: 1.6rem;
        }
      `}</style>
    </section>
  );
};