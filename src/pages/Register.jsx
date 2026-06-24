import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth, API_URL } from "../store/auth"; // ✅ Clean central API_URL imported from auth store
import { toast } from "react-toastify";

export const Register = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const [otp, setOtp] = useState(""); // 🔑 Holds the 6-digit OTP string
  const [step, setStep] = useState(1); // ⏳ Step 1: Account Info | Step 2: OTP Verification Box
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();

  // HANDLE INPUT
  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  // HANDLE STEP 1 SUBMIT (Send OTP)
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    ["username", "email", "phone", "password"].forEach((field) => {
      if (!user[field]) newErrors[field] = true;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // ✅ FIXED: phone sent as a trimmed string to pass Zod schema verification
      const registerUser = {
        username: user.username.trim(),
        email: user.email.trim().toLowerCase(),
        phone: user.phone.toString().trim(), 
        password: user.password, 
      };

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerUser),
      });

      const data = await response.json();

      if (response.ok) {
        toast.info(data.message || "Verification code sent to your email.");
        setStep(2); // 🚀 Shift view straight to the OTP code verification screen
      } else {
        toast.error(data.extraDetails ? data.extraDetails : data.message);
      }
    } catch (error) {
      console.error("register", error);
      toast.error("An error occurred during registration initiation");
    }
  };

  // HANDLE STEP 2 SUBMIT (Verify OTP & Complete Sign Up)
  const handleOtpVerifySubmit = async (e) => {
    e.preventDefault();

    const cleanOtp = otp.replace(/\s+/g, "").trim(); // Removes any rogue spaces added by layout fonts

    if (!cleanOtp || cleanOtp.length !== 6) {
      toast.error("Please enter a valid 6-digit verification code.");
      return;
    }

    try {
      // ✅ FIXED: phone sent cleanly as a string format here as well
      const verifyPayload = {
        username: user.username.trim(),
        email: user.email.trim().toLowerCase(),
        phone: user.phone.toString().trim(),
        password: user.password,
        otp: cleanOtp,
      };

      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(verifyPayload),
      });

      const data = await response.json();

      if (response.ok) {
        storeTokenInLS(data.token);
        toast.success("Registration Successful!");

        setUser({
          username: "",
          email: "",
          phone: "",
          password: "",
        });
        setOtp("");
        navigate("/chat");
      } else {
        toast.error(data.extraDetails ? data.extraDetails : data.message);
      }
    } catch (error) {
      console.error("otp-verification-error", error);
      toast.error("An error occurred during OTP verification.");
    }
  };

  return (
    <>
      <section>
        <main>
          <div className="section-registration">
            <div className="container grid grid-two-cols">
              
              {/* FORM SECTION */}
              <div className="registration-form-container" style={{ order: 1 }}>
                <h1 className="main-heading mb-3">
                  {step === 1 ? "Registration Form" : "Verify Your Identity"}
                </h1>

                {step === 1 ? (
                  /* STEP 1 FORM: COLLECT DETAILS */
                  <form onSubmit={handleRegisterSubmit} noValidate>
                    {/* USERNAME */}
                    <div>
                      <label htmlFor="username" className="form-label">Username</label>
                      <input
                        type="text"
                        name="username"
                        placeholder="Enter Your Username"
                        id="username"
                        autoComplete="off"
                        value={user.username}
                        onChange={handleInput}
                        style={{
                          border: errors.username ? "3px solid #cc0000" : "1px solid #475569",
                          boxShadow: errors.username ? "0 0 8px rgba(204, 0, 0, 0.6)" : "none",
                          backgroundColor: "white",
                          color: "black",
                        }}
                      />
                    </div>

                    {/* EMAIL */}
                    <div>
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter Your Email"
                        id="email"
                        autoComplete="off"
                        value={user.email}
                        onChange={handleInput}
                        style={{
                          border: errors.email ? "3px solid #cc0000" : "1px solid #475569",
                          boxShadow: errors.email ? "0 0 8px rgba(204, 0, 0, 0.6)" : "none",
                          backgroundColor: "white",
                          color: "black",
                        }}
                      />
                    </div>

                    {/* PHONE */}
                    <div>
                      <label htmlFor="phone" className="form-label">Phone</label>
                      <input
                        type="number"
                        name="phone"
                        placeholder="Enter Your Phone"
                        id="phone"
                        autoComplete="off"
                        value={user.phone}
                        onChange={handleInput}
                        style={{
                          border: errors.phone ? "3px solid #cc0000" : "1px solid #475569",
                          boxShadow: errors.phone ? "0 0 8px rgba(204, 0, 0, 0.6)" : "none",
                          backgroundColor: "white",
                          color: "black",
                        }}
                      />
                    </div>

                    {/* PASSWORD */}
                    <div>
                      <label htmlFor="password" className="form-label">Password</label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Enter Your Password"
                        id="password"
                        autoComplete="off"
                        value={user.password}
                        onChange={handleInput}
                        style={{
                          border: errors.password ? "3px solid #cc0000" : "1px solid #475569",
                          boxShadow: errors.password ? "0 0 8px rgba(204, 0, 0, 0.6)" : "none",
                          backgroundColor: "white",
                          color: "black",
                        }}
                      />
                    </div>

                    <button type="submit" className="btn btn-submit">
                      Send Verification Code
                    </button>

                    <div style={{ marginTop: "1.5rem" }}>
                      <p>
                        Already have an account?{" "}
                        <NavLink to="/login" style={{ textDecoration: "underline", color: "var(--btn-color)" }}>
                          Login here
                        </NavLink>
                      </p>
                    </div>
                  </form>
                ) : (
                  /* STEP 2 FORM: ENTER OTP CODE */
                  <form onSubmit={handleOtpVerifySubmit} noValidate>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <p style={{ color: "#cbd5e1", fontSize: "1.1rem" }}>
                        An email containing a 6-digit verification security key was sent to <strong>{user.email}</strong>.
                      </p>
                    </div>

                    <div>
                      <label htmlFor="otp" className="form-label">Enter OTP Code</label>
                      <input
                        type="text"
                        name="otp"
                        id="otp"
                        placeholder="------"
                        maxLength="6"
                        autoComplete="off"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        style={{
                          textAlign: "center",
                          fontSize: "2.2rem",
                          letterSpacing: "12px",
                          backgroundColor: "white",
                          color: "black",
                          border: "1px solid #475569",
                        }}
                      />
                    </div>

                    <button type="submit" className="btn btn-submit">
                      Verify & Register
                    </button>

                    <button
                      type="button"
                      className="btn"
                      onClick={() => setStep(1)}
                      style={{
                        marginTop: "1rem",
                        width: "100%",
                        backgroundColor: "#475569",
                        color: "white",
                      }}
                    >
                      ← Back to Details
                    </button>
                  </form>
                )}
              </div>

              {/* IMAGE SECTION */}
              <div className="registration-image" style={{ order: 2 }}>
                <img
                  src="/images/register.png"
                  alt="A girl is trying to do registration"
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>

            </div>
          </div>
        </main>
      </section>
    </>
  );
};