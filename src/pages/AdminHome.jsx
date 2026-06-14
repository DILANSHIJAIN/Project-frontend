import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export const AdminHome = () => {
    const [content, setContent] = useState({
        heroSubtitle: "",
        heroTitle: "",
        heroText: "",
        heroCtaText: "",
        analyticsCompanies: "",
        analyticsClients: "",
        analyticsDevelopers: "",
        analyticsAvailability: "",
        ctaSubtitle: "",
        ctaTitle: "",
        ctaBody: "",
        homeImage: "",
        ctaImage: "" }); // Add ctaImage to state
    const { authorizationToken, isLoading } = useAuth();

    const getHomeContent = async () => {
        if (!authorizationToken) return;
        try {
            const response = await fetch(`${API_URL}/api/admin/home-content`, {
                method: "GET",
                headers: { Authorization: authorizationToken },
            });
            if (response.ok) {
                const data = await response.json();
                setContent(data);
            } else {
                toast.error("Failed to fetch home page content for editing.");
            }
        } catch (error) {
            console.error("Error fetching home content:", error.message);
            toast.error("Error fetching home page content.");
        }
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        setContent({ ...content, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/admin/home-content`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authorizationToken,
                },
                body: JSON.stringify(content),
            });
            if (response.ok) {
                toast.success("Home page content updated successfully");
            } else {
                toast.error("Failed to update home content");
            }
        } catch (error) {
            toast.error("Update failed");
        }
    };

    useEffect(() => {
        if (!isLoading) {
            getHomeContent();
        }
    }, [isLoading, authorizationToken]);

    return (
        <section className="section-admin-home" style={{ padding: "4rem 0", background: "#0f172a", minHeight: "100vh", color: "white" }}>
            <div className="container">
                <NavLink to="/admin-dashboard" style={{ color: "var(--btn-color)", fontSize: "1.6rem", marginBottom: "2rem", display: "inline-block" }}>
                    ← Back to Dashboard
                </NavLink>
                <h1 className="main-heading">Edit Home Page Content</h1>
                <form onSubmit={handleSubmit} style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
                    <h2 style={{ fontSize: "2rem", marginBottom: "1rem", borderBottom: "1px solid #334155", paddingBottom: "1rem" }}>Hero Section</h2>
                    <div>
                        <label style={{ display: "block", fontSize: "1.6rem", marginBottom: "1rem" }}>Hero Subtitle (Top Line)</label>
                        <input 
                            type="text" 
                            name="heroSubtitle" 
                            value={content.heroSubtitle} 
                            onChange={handleInput} 
                            style={{ width: "100%", padding: "1rem", borderRadius: "0.5rem", border: "1px solid #334155", background: "#1e293b", color: "white" }}
                        />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "1.6rem", marginBottom: "1rem" }}>Hero Main Title</label>
                        <textarea 
                            name="heroTitle" 
                            value={content.heroTitle} 
                            onChange={handleInput} 
                            placeholder="Enter the main heading here..."
                            style={{ width: "100%", padding: "1rem", borderRadius: "0.5rem", minHeight: "80px", border: "1px solid #334155", background: "#1e293b", color: "white" }}
                        />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "1.6rem", marginBottom: "1rem" }}>Hero Body Text</label>
                        <textarea 
                            name="heroText" 
                            value={content.heroText} 
                            onChange={handleInput} 
                            style={{ width: "100%", padding: "1rem", borderRadius: "0.5rem", minHeight: "150px", border: "1px solid #334155", background: "#1e293b", color: "white" }}
                        />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "1.6rem", marginBottom: "1rem" }}>Hero Call to Action Button Text</label>
                        <input 
                        type="text" 
                        name="heroCtaText" 
                        value={content.heroCtaText} 
                        onChange={handleInput} 
                        style={{ width: "100%", padding: "1rem", borderRadius: "0.5rem", border: "1px solid #334155", background: "#1e293b", color: "white" }}
                        />
                    </div>

                    <h2 style={{ fontSize: "2rem", marginBottom: "1rem", borderBottom: "1px solid #334155", paddingBottom: "1rem", marginTop: "3rem" }}>Analytics Section</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.4rem" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "1.6rem", marginBottom: "1rem" }}>Companies Registered</label>
                            <input 
                            type="text" 
                            name="analyticsCompanies" 
                            value={content.analyticsCompanies} 
                            onChange={handleInput} 
                            autoComplete="off"
                            style={{ width: "100%", padding: "1rem", borderRadius: "0.5rem", border: "1px solid #334155", background: "#1e293b", color: "white" }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "1.6rem", marginBottom: "1rem" }}>Happy Clients</label>
                            <input 
                            type="text" 
                            name="analyticsClients" 
                            value={content.analyticsClients} 
                            onChange={handleInput} 
                            autoComplete="off"
                            style={{ width: "100%", padding: "1rem", borderRadius: "0.5rem", border: "1px solid #334155", background: "#1e293b", color: "white" }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "1.6rem", marginBottom: "1rem" }}>Well-known Developers</label>
                            <input 
                            type="text" 
                            name="analyticsDevelopers" 
                            value={content.analyticsDevelopers} 
                            onChange={handleInput} 
                            autoComplete="off"
                            style={{ width: "100%", padding: "1rem", borderRadius: "0.5rem", border: "1px solid #334155", background: "#1e293b", color: "white" }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "1.6rem", marginBottom: "1rem" }}>Service Availability</label>
                            <input 
                            type="text" 
                            name="analyticsAvailability" 
                            value={content.analyticsAvailability} 
                            onChange={handleInput} 
                            autoComplete="off"
                            style={{ width: "100%", padding: "1rem", borderRadius: "0.5rem", border: "1px solid #334155", background: "#1e293b", color: "white" }}
                            />
                        </div>
                    </div>

                    <h2 style={{ fontSize: "2rem", marginBottom: "1rem", borderBottom: "1px solid #334155", paddingBottom: "1rem", marginTop: "3rem" }}>Call to Action Section</h2>
                    <div>
                        <label style={{ display: "block", fontSize: "1.6rem", marginBottom: "1rem" }}>CTA Subtitle</label>
                        <input 
                        type="text" 
                        name="ctaSubtitle" 
                        value={content.ctaSubtitle} 
                        onChange={handleInput} 
                        style={{ width: "100%", padding: "1rem", borderRadius: "0.5rem", border: "1px solid #334155", background: "#1e293b", color: "white" }}
                        />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "1.6rem", marginBottom: "1rem" }}>CTA Main Title</label>
                        <input 
                        type="text" 
                        name="ctaTitle" 
                        value={content.ctaTitle} 
                        onChange={handleInput} 
                        style={{ width: "100%", padding: "1rem", borderRadius: "0.5rem", border: "1px solid #334155", background: "#1e293b", color: "white" }}
                        />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "1.6rem", marginBottom: "1rem" }}>CTA Body Text</label>
                        <textarea 
                        name="ctaBody" 
                        value={content.ctaBody} 
                        onChange={handleInput} 
                        style={{ width: "100%", padding: "1rem", borderRadius: "0.5rem", minHeight: "150px", border: "1px solid #334155", background: "#1e293b", color: "white" }}
                        />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "1.6rem", marginBottom: "1rem" }}>Home Page Image URL</label>
                        <input 
                            type="text" 
                            name="homeImage" 
                            value={content.homeImage} 
                            onChange={handleInput}
                            placeholder="e.g., /images/home.png or a full URL"
                            style={{ width: "100%", padding: "1rem", borderRadius: "0.5rem", border: "1px solid #334155", background: "#1e293b", color: "white" }}
                        />
                        {content.homeImage && (
                            <div style={{ marginTop: "1rem", textAlign: "center" }}>
                                <p style={{ fontSize: "1.4rem", marginBottom: "0.5rem", color: "#94a3b8" }}>Image Preview:</p>
                                <img src={content.homeImage} alt="Home Page Preview" style={{ maxWidth: "200px", maxHeight: "150px", objectFit: "cover", borderRadius: "0.5rem", border: "1px solid #334155" }} />
                            </div>
                        )}
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "1.6rem", marginBottom: "1rem" }}>CTA Section Image URL</label>
                        <input 
                            type="text" 
                            name="ctaImage" 
                            value={content.ctaImage} 
                            onChange={handleInput} /* Inline style for error border */
                            placeholder="e.g., /images/design.png or a full URL"
                            style={{ width: "100%", padding: "1rem", borderRadius: "0.5rem", border: "1px solid #334155", background: "#1e293b", color: "white" }}
                        />
                        {content.ctaImage && (
                            <div style={{ marginTop: "1rem", textAlign: "center" }}>
                                <p style={{ fontSize: "1.4rem", marginBottom: "0.5rem", color: "#94a3b8" }}>Image Preview:</p>
                                <img src={content.ctaImage} alt="CTA Section Preview" style={{ maxWidth: "200px", maxHeight: "150px", objectFit: "cover", borderRadius: "0.5rem", border: "1px solid #334155" }} />
                            </div>
                        )}
                    </div>
                    <button type="submit" className="btn">Update Home Content</button>
                </form>
            </div>
        </section>
    );
};