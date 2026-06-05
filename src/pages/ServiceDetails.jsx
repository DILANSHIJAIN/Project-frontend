import { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Restoring the professional mock reviews for the presentation
const REVIEW_POOLS = [
    [
        { username: "Hanuman Sharma", comment: "The AI integration for ticket categorization is a game changer.", rating: 5, date: "15/06/2024" },
        { username: "Sara Singh", comment: "Great interface and very intuitive. Exactly what we needed.", rating: 4, date: "18/06/2024" },
        { username: "Minakshi Patel", comment: "Solid support system. The automated SLA tracking helps immensely.", rating: 5, date: "22/06/2024" }
    ],
    [
        { username: "Vikram Malhotra", comment: "Enterprise-grade support. Switching to this was the best decision.", rating: 5, date: "10/05/2024" },
        { username: "Kavita Reddy", comment: "Reliable and fast. 30% increase in resolution speed.", rating: 5, date: "12/05/2024" }
    ],
    [
        { username: "Rahul Verma", comment: "Budget-friendly without compromising on quality. UI is very clean.", rating: 4, date: "01/07/2024" },
        { username: "Pooja Hegde", comment: "The automated ticket routing works like a charm.", rating: 5, date: "03/07/2024" }
    ],
    [
        { username: "Michael Brown", comment: "Integration was straightforward. No downtime during transition.", rating: 5, date: "22/07/2024" },
        { username: "Sarah Chen", comment: "Security features are robust. Feeling much safer with our data.", rating: 5, date: "24/07/2024" }
    ]
];

export const ServiceDetails = () => {
    const { id } = useParams();
    const { services, isLoading, authorizationToken, isLoggedIn, user, getServices } = useAuth();

    // 1. Declare all State at the top exactly once
    const [reviews, setReviews] = useState([]);
    const [reviewInput, setReviewInput] = useState("");
    const [ratingInput, setRatingInput] = useState(5);

    // Derive serviceData directly from the services array
    const serviceData = services?.length > 0 ? services.find((s) => s._id === id) : null;
    
    // 2. Logic to pick unique reviews for different services
    useEffect(() => {
        if (id && serviceData) {
            // Pick a pool based on the service ID so it's consistent
            const charCode = id.charCodeAt(id.length - 1);
            const selectedPool = REVIEW_POOLS[charCode % REVIEW_POOLS.length];
            // Combine real reviews from the database with the placeholder pool
            setReviews([...(serviceData.reviews || []), ...selectedPool]);
        }
    }, [id, serviceData]);

    // 3. Form Submission Handler
    const handleAddReview = async (e) => {
        e.preventDefault();
        if (!reviewInput.trim()) return;
        if (!isLoggedIn) return toast.warn("Please login to post a review");

        const toastId = toast.loading("Posting your review...");
        
        try {
            // API endpoint must match your backend router (standard pattern is /api/data/service/...)
            const response = await fetch(`${API_URL}/api/data/service/${id}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authorizationToken,
                },
                body: JSON.stringify({
                    comment: reviewInput,
                    rating: ratingInput,
                }),
            });

            // Check if the response is actually JSON before parsing
            const contentType = response.headers.get("content-type");
            let data = {};
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                // If not JSON, it's likely an HTML 404 page from Express
                const statusText = response.status === 404 ? "Route not found on backend" : "Server error";
                throw new Error(`Error ${response.status}: ${statusText}`);
            }

            if (response.ok) {
                // Re-fetch from DB so the new review is permanent and visible after refresh
                if (getServices) await getServices();
                setReviewInput("");
                setRatingInput(5);
                toast.update(toastId, { render: "Review posted successfully!", type: "success", isLoading: false, autoClose: 3000 });
            } else {
                const errorMsg = data.message || `Error ${response.status}: Failed to post review.`;
                toast.update(toastId, { render: errorMsg, type: "error", isLoading: false, autoClose: 5000 });
            }
        } catch (error) {
            console.error("Detailed Error:", error);
            const friendlyMessage = error.message.includes("Failed to fetch") 
                ? "Cannot reach server. Is the backend running on port 5000?" 
                : `Error: ${error.message}`;
            toast.update(toastId, { render: friendlyMessage, type: "error", isLoading: false, autoClose: 5000 });
        }
    };

    // 4. Loading & Error States
    if (isLoading) {
        return <h1 className="main-heading" style={{textAlign: 'center', padding: '5rem'}}>Loading Service Details...</h1>;
    }

    if (!serviceData) {
        return (
            <section className="section-services" style={{ background: "#0f172a", minHeight: "100vh", padding: "4rem 0", color: "white", textAlign: "center" }}>
                <h1 className="main-heading">Service Not Found</h1>
                <p style={{ fontSize: "1.8rem", marginTop: "1rem" }}>The service you are looking for does not exist.</p>
                <NavLink to="/services" style={{ color: "var(--btn-color)", fontSize: "1.6rem", marginTop: "2rem", display: "inline-block" }}>← Back to all services</NavLink>
            </section>
        );
    }

    // 5. Render Component
    return (
        <section className="section-services" style={{ background: "#0f172a", minHeight: "100vh", padding: "4rem 0" }}>
            <div className="container" style={{ maxWidth: "1000px" }}>
                <NavLink to="/services" style={{ color: "var(--btn-color)", fontSize: "1.6rem", marginBottom: "2rem", display: "inline-block" }}>
                    ← Back to all services
                </NavLink>
                
                <div className="details-header" style={{ display: "flex", gap: "4rem", background: "#1e293b", padding: "3rem", borderRadius: "1rem", color: "white" }}>
                    <img src="/images/service.png" alt="Service" width="250" style={{ alignSelf: "flex-start" }} />
                    <div>
                        <p style={{ fontSize: "1.4rem", color: "#94a3b8" }}>{serviceData.provider}</p>
                        <h1 className="main-heading" style={{ margin: "1rem 0" }}>{serviceData.service}</h1>
                        <p style={{ fontSize: "2.4rem", fontWeight: "bold", color: "var(--btn-color)" }}>{serviceData.price}</p>
                        <p style={{ fontSize: "1.8rem", lineHeight: "1.6", marginTop: "2rem" }}>{serviceData.description}</p>
                    </div>
                </div>

                <div style={{ marginTop: "3rem", background: "#1e293b", padding: "3rem", borderRadius: "1rem", color: "white" }}>
                    <h2 style={{ fontSize: "2.4rem", color: "#60a5fa", marginBottom: "2rem" }}>📋 About This Service</h2>
                    <p style={{ fontSize: "1.6rem", lineHeight: "1.8", color: "#cbd5e1" }}>
                        {serviceData.detailedDescription || `Our ${serviceData.service} solution provides a comprehensive framework for modern businesses. By leveraging ${serviceData.provider}'s advanced technology, we ensure your support needs are handled with excellence.`}
                    </p>
                </div>

                <div style={{ marginTop: "3rem", color: "white" }}>
                    <h2 style={{ fontSize: "2.4rem", marginBottom: "2rem" }}>Customer Reviews</h2>
                    
                    <div className="grid grid-two-cols" style={{ alignItems: "start", gap: "3rem" }}>
                        {/* Review List */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            {reviews.map((rev, i) => (
                                <div key={i} style={{ padding: "2rem", background: "#334155", borderRadius: "0.5rem" }}>
                                    <p style={{ fontSize: "1.6rem", fontWeight: "bold" }}>{rev.username} <span style={{ fontWeight: "normal", color: "#94a3b8", fontSize: "1.2rem" }}>- {rev.date}</span></p>
                                    <div style={{ color: "#fbbf24", fontSize: "1.8rem", margin: "0.5rem 0" }}>
                                        {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                                    </div>
                                    <p style={{ fontSize: "1.5rem", color: "#e2e8f0" }}>{rev.comment}</p>
                                </div>
                            ))}
                        </div>

                        {/* Add Review Form */}
                        {isLoggedIn ? (
                            <div style={{ background: "#1e293b", padding: "3rem", borderRadius: "1rem" }}>
                                <h3 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Write a Review</h3>
                                <form onSubmit={handleAddReview} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                    <div>
                                        <p style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>Rating:</p>
                                        <div style={{ display: "flex", gap: "0.5rem" }}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span 
                                                    key={star} 
                                                    onClick={() => setRatingInput(star)}
                                                    style={{ cursor: "pointer", fontSize: "2.5rem", color: star <= ratingInput ? "#fbbf24" : "#94a3b8" }}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <textarea 
                                            required
                                            placeholder="Share your experience..."
                                            value={reviewInput}
                                            onChange={(e) => setReviewInput(e.target.value)}
                                            style={{ 
                                                width: "100%", 
                                                padding: "1.5rem", 
                                                borderRadius: "0.5rem", 
                                                border: "none", 
                                                fontSize: "1.6rem", 
                                                minHeight: "120px", 
                                                color: "black" 
                                            }}
                                        />
                                    </div>
                                    <button type="submit" className="btn">Post Review</button>
                                </form>
                            </div>
                        ) : (
                            <div style={{ background: "#1e293b", padding: "3rem", borderRadius: "1rem", textAlign: "center" }}>
                                <h3 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Share your thoughts?</h3>
                                <p style={{ fontSize: "1.6rem", marginBottom: "2rem" }}>Please login to write a review for this service.</p>
                                <NavLink to="/login" className="btn">Login to Review</NavLink>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};