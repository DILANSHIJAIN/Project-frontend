import { useState, useEffect } from "react";
import { useAuth } from "../store/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const Contact = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    category: "", // Set to empty string so the placeholder "Select a Category" is visible by default
    query: "",
  });

  // Get user data from AuthContext
  const { user: authUser, isLoggedIn } = useAuth();

  // State to track if form fields have been pre-filled
  const [isUserDataPrefilled, setIsUserDataPrefilled] = useState(false);

  useEffect(() => {
    if (isLoggedIn && authUser && !isUserDataPrefilled) {
      setUser((prevUser) => ({
        ...prevUser,
        name: authUser.username || "",
        email: authUser.email || "",
        phone: authUser.phone || "",
      }));
      setIsUserDataPrefilled(true); // Mark as pre-filled
    } else if (!isLoggedIn && isUserDataPrefilled) {
      // Clear form if user logs out
      setUser({ name: "", email: "", phone: "", category: "", query: "" });
      setIsUserDataPrefilled(false);
    }
  }, [isLoggedIn, authUser, isUserDataPrefilled]);

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/admin/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Your query has been submitted! Ticket ID: ${data.ticketId}`);
        setUser({
          name: "",
          email: "",
          phone: "",
          category: "",
          query: "",
        });
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Message not delivered");
      }
    } catch (error) {
      console.log("Contact error:", error);
      alert("Something went wrong while sending the message.");
    }
  };

  return (
    <>
      <section>
        <main>
          <div className="section-contact">
            <div className="container grid grid-two-cols">

              {/* CONTACT IMAGE */}
              <div className="contact-image">
                <img
                  src="/images/contact.png"
                  alt="A girl is trying to connect"
                  width="500"
                  height="500"
                />
              </div>

              {/* CONTACT FORM */}
              <div className="contact-form">
                <h1 className="main-heading mb-3">
                  Contact Form
                </h1>

                <form onSubmit={handleSubmit}>

                  <div>
                    <label htmlFor="name">Name</label>

                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      value={user.name}
                      onChange={handleInput}
                      required
                    />
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label htmlFor="email">Email</label>

                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      value={user.email}
                      onChange={handleInput}
                      required
                    />
                  </div>

                  {/* PHONE */}
                  <div>
                    <label htmlFor="phone">Phone Number</label>

                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={user.phone}
                      onChange={handleInput}
                      required
                    />
                  </div>

                  {/* CATEGORY */}
                  <div>
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={user.category}
                      onChange={handleInput}
                      required
                      className="contact-select"
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "1.5rem",
                        marginTop: "1rem",
                        marginBottom: "2rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #475569",
                        backgroundColor: "white",
                        color: "black",
                        fontSize: "1.6rem",
                        cursor: "pointer",
                      }}
                    >
                      <option value="" disabled>Select a Category</option> {/* Placeholder */}
                      <option value="General">General Inquiry</option> {/* Now a selectable option */}
                      <option value="Technical">Technical Support</option>
                      <option value="Billing">Billing & Payments</option>
                      <option value="Login & Authentication">Login & Authentication</option>
                      <option value="Account Management">Account Management</option>
                      <option value="Infrastructure">Infrastructure Support (Water/Drainage)</option>
                      <option value="Security">Security Incident</option>
                      <option value="Data & Database">Data & Database</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Service Request">Service Request</option>
                      <option value="Performance Issues">Performance Issues</option>
                      <option value="Complaint">Complaint</option>
                      <option value="Integration & API">Integration & API</option>
                      <option value="Printing">Printing & Peripherals</option>
                      <option value="Email & Collaboration">Email & Collaboration</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Vehicle Maintenance">Vehicle Maintenance</option>
                      <option value="Traffic & Logistics">Traffic & Logistics</option>
                    </select>
                  </div>

                  {/* QUERY */}
                  <div>
                    <label htmlFor="query">Query</label>

                    <textarea
                      id="query"
                      name="query"
                      placeholder="Enter your query"
                      value={user.query}
                      onChange={handleInput}
                      required
                      cols="30"
                      rows="6"
                    ></textarea>
                  </div>

                  {/* BUTTON */}
                  <button type="submit" className="btn btn-submit">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>

        {/* GOOGLE MAP */}
        <section className="section-map">
          <div className="container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224346.48167620343!2d77.06889926628777!3d28.52755440978482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3c6c1f8b7df%3A0x7c5f5d7b5d8c5f6d!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map"
            ></iframe>
          </div>
        </section>
      </section>
    </>
  );
};