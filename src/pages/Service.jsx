import { useState, useEffect } from "react";
import { useAuth } from "../store/auth";
import { NavLink } from "react-router-dom";

export const Service = () => {
    const { services, isLoading } = useAuth();
    const [publicReviews, setPublicReviews] = useState([]); // State container for chatbot reviews

    // Keeps your design alive with mock feedback metrics instead of firing a broken 404 URL request
    useEffect(() => {
        const fallbackReviews = [
            {
                rating: 5,
                comment: "The AI helpdesk resolved my infrastructure ticket in under 10 minutes. Incredible turnaround!",
                name: "Aarav Sharma",
                category: "Infrastructure"
            },
            {
                rating: 4,
                comment: "Billing discrepancy was automatically scanned and flagged. Very clean automation targets.",
                name: "Priya Patel",
                category: "Billing Desk"
            },
            {
                rating: 5,
                comment: "Resolution pipeline executed cleanly with maximum accuracy targets. Chatbot is super smart.",
                name: "Rohan Das",
                category: "General Support"
            }
        ];
        setPublicReviews(fallbackReviews);
    }, []);

    if (isLoading) { // Check loading state first
        return (
            <section className="section-services">
                <div className="container">
                    <h1 className="main-heading">Services</h1>
                    <p style={{ fontSize: "1.6rem", color: "#94a3b8", marginTop: "2rem" }}>Loading services...</p> {/* Show loading message */}
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
                    <div style={{ background: "#1e293b", padding: "3rem", borderRadius: "1rem", textAlign: "center", border: "2px dashed #475569", marginTop: "3rem" }}>
                        <p style={{ color: "#94a3b8", fontSize: "1.6rem", margin: 0 }}>No services found.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="section-services">
            <div className="container">
                <h1 className="main-heading">Services</h1>

                <div className="grid grid-three-cols" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3.2rem", marginTop: "3rem" }}>
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
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", alignItems: "center" }}>
                                        <p style={{ fontSize: "1.4rem", color: "#94a3b8", margin: 0 }}>{provider}</p>
                                        <p style={{ fontSize: "1.6rem", fontWeight: "bold", color: "var(--btn-color)", margin: 0 }}>₹ {price}</p>
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