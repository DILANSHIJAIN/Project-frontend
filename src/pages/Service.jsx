import { useState, useEffect } from "react";
import { useAuth } from "../store/auth";
import { NavLink } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL; // Ensure this is set to IP in .env

export const Service = () => {
    const { services, isLoading } = useAuth();
    const [publicReviews, setPublicReviews] = useState([]); // ADDED: State container for chatbot reviews

    // ADDED: Simple effect hook to fetch user review scores from the ticketing system database
    useEffect(() => {
        fetch(`${API_URL}/api/tickets/reviews`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    // Filter out empty items to make sure only real ratings display
                    setPublicReviews(data.filter(rev => rev.rating > 0));
                }
            })
            .catch((err) => console.error("Error fetching public feedback metrics:", err));
    }, []);

    if (isLoading) { // Check loading state first
        return (
            <section className="section-services">
                <div className="container">
                    <h1 className="main-heading">Services</h1>
                    <p>Loading services...</p> {/* Show loading message */}
                </div>
            </section>
        );
    }

    // Now, if not loading, check if services are actually empty
    if (!services || services.length === 0) {
        return (
            <section className="section-services">
                <div className="container">
                    <h1 className="main-heading">Services</h1>
                    <p>No services found.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="section-services">
            <div className="container">
                <h1 className="main-heading">Services</h1>

                <div className="grid grid-three-cols" style={{ gap: "3.2rem", marginTop: "3rem" }}>
                    {services.map((curElem, index) => {
                        const { price, description, provider, service, _id } = curElem;

                        return (
                            <div className="card" key={_id || index} style={{
                                border: "0.2rem solid #334155",
                                borderRadius: "1rem",
                                padding: "2rem",
                                background: "#1e293b",
                                color: "white"
                            }}>
                                <div className="card-img" style={{ textAlign: "center", marginBottom: "2rem" }}>
                                    <img src="/images/service.png" alt="Our Services Info" style={{ maxWidth: "100%", height: "auto", display: "block", margin: "0 auto" }} />
                                </div>

                                <div className="card-details">
                                    <div className="grid grid-two-cols" style={{ marginBottom: "1rem", alignItems: "center" }}>
                                        <p style={{ fontSize: "1.4rem", color: "#94a3b8" }}>{provider}</p>
                                        <p style={{ fontSize: "1.6rem", fontWeight: "bold", textAlign: "right", color: "var(--btn-color)" }}>₹ {price}</p>
                                    </div>
                                    <h2 style={{ fontSize: "2.4rem", margin: "1.2rem 0" }}>{service}</h2>
                                    <p style={{ fontSize: "1.6rem", lineHeight: "1.6", color: "#e2e8f0" }}>{description}</p>

                                    <NavLink to={`/services/${_id}`} className="btn" style={{ marginTop: "2rem", width: "100%", textAlign: "center", display: "inline-block" }}>
                                        View Details & Reviews
                                    </NavLink>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- ADDED: Unified User Testimonials Review Layout Component Block --- */}
            <div className="container" style={{ marginTop: "8rem", borderTop: "2px dashed #334155", paddingTop: "6rem" }}>
                <h1 className="main-heading" style={{ marginBottom: "1rem" }}>User Reviews</h1>
                <p style={{ color: "#94a3b8", fontSize: "1.6rem", marginBottom: "4rem" }}>See feedback submitted by our community members at chat cycle resolution steps.</p>

                {publicReviews.length === 0 ? (
                    <div style={{ background: "#1e293b", padding: "3rem", borderRadius: "1rem", textAlign: "center", border: "2px dashed #475569" }}>
                        <p style={{ color: "#94a3b8", fontSize: "1.6rem", margin: 0, fontStyle: "italic" }}>No active customer reviews found in database tracking registries yet.</p>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2.5rem" }}>
                        {publicReviews.map((rev, idx) => (
                            <div key={idx} style={{ background: "#1e293b", padding: "2.5rem", borderRadius: "1rem", border: "0.2rem solid #334155", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <div>
                                    <div style={{ color: "#fbbf24", fontSize: "2rem", marginBottom: "1rem" }}>
                                        {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                                    </div>
                                    <p style={{ fontSize: "1.5rem", color: "#e2e8f0", lineHeight: "1.5", fontStyle: "italic", margin: 0 }}>
                                        "{rev.comment || "Resolution pipeline executed cleanly with maximum accuracy targets."}"
                                    </p>
                                </div>
                                <div style={{ marginTop: "2rem", borderTop: "1px solid #334155", paddingTop: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                                    <div style={{ width: "3rem", height: "3rem", borderRadius: "50%", background: "var(--btn-color)", color: "black", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.2rem" }}>
                                        {rev.name ? rev.name.charAt(0).toUpperCase() : "U"}
                                    </div>
                                    <div>
                                        <h4 style={{ color: "white", fontSize: "1.4rem", margin: 0 }}>{rev.name || "Anonymous User"}</h4>
                                        <p style={{ color: "#94a3b8", fontSize: "1.1rem", margin: 0 }}>Category Tracking: {rev.category || "General Desk"}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};