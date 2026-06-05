import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const Register = () => {

  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

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
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();
    try {
      // Clean the data before sending
      const registerUser = {
        username: user.username.trim(),
        email: user.email.trim().toLowerCase(),
        phone: user.phone.toString().trim(),
        password: user.password.trim(),
      };

      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registerUser),
        }
      );

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        storeTokenInLS(data.token);
        toast.success("Registration Successful");

        setUser({
          username: "",
          email: "",
          phone: "",
          password: "",
        });
        // Navigate to AI Chat after successful registration
        navigate("/chat");

      } else {
        toast.error(data.extraDetails ? data.extraDetails : data.message);
      }

    } catch (error) {
      console.error("register", error);
      toast.error("An error occurred during registration");
    }
  };

  return (
    <>
      <section>

        <main>

          <div className="section-registration">

            <div className="container grid grid-two-cols">

              {/* IMAGE SECTION */}
              <div className="registration-image">

                <img
                  src="/images/register.png"
                  alt="A girl is trying to do registration"
                  width="500"
                  height="500"
                />

              </div>

              {/* FORM SECTION */}
              <div className="registration-form">

                <h1 className="main-heading mb-3">
                  Registration Form
                </h1>

                <form onSubmit={handleSubmit}>

                  {/* USERNAME */}
                  <div>

                    <label htmlFor="username">
                      Username
                    </label>

                    <input
                      type="text"
                      name="username"
                      placeholder="Enter Your Username"
                      id="username"
                      required
                      minLength="3"
                      autoComplete="off"
                      value={user.username}
                      onChange={handleInput}
                    />

                  </div>

                  {/* EMAIL */}
                  <div>

                    <label htmlFor="email">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      placeholder="Enter Your Email"
                      id="email"
                      required
                      autoComplete="off"
                      value={user.email}
                      onChange={handleInput}
                    />

                  </div>

                  {/* PHONE */}
                  <div>

                    <label htmlFor="phone">
                      Phone
                    </label>

                    <input
                      type="number"
                      name="phone"
                      placeholder="Enter Your Phone"
                      id="phone"
                      required
                      autoComplete="off"
                      value={user.phone}
                      onChange={handleInput}
                    />

                  </div>

                  {/* PASSWORD */}
                  <div>

                    <label htmlFor="password">
                      Password
                    </label>

                    <input
                      type="password"
                      name="password"
                      placeholder="Enter Your Password"
                      id="password"
                      required
                      autoComplete="off"
                      value={user.password}
                      onChange={handleInput}
                    />

                  </div>

                  {/* BUTTON */}
                  <button
                    type="submit"
                    className="btn btn-submit"
                  >
                    Register Now
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

              </div>

            </div>

          </div>

        </main>

      </section>
    </>
  );
};