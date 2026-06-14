import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export const AdminAbout = () => {
    const [content, setContent] = useState({
        title: "",
        description: "",
        mission: "",
        analyticsCompanies: "",
        analyticsProjects: "",
        analyticsClients: "",
        analyticsYoutube: "",
        team: [],
        aboutImage: "" // Add aboutImage to state
    });
    const { authorizationToken } = useAuth();

    const getAboutContent = async () => {
        try {
            const response = await fetch(`${API_URL}/api/admin/about-content`, {
                method: "GET",
                headers: { Authorization: authorizationToken },
            });
            const data = await response.json();
            if (response.ok) {
                setContent(prev => ({ ...prev, ...data }));
            } else {
                console.error("Failed to fetch about content:", data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        setContent({ ...content, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/admin/about-content`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authorizationToken,
                },
                body: JSON.stringify(content),
            });
            if (response.ok) {
                toast.success("About content updated successfully");
            } else {
                toast.error("Update failed");
            }
        } catch (error) {
            toast.error("Update failed");
        }
    };

    useEffect(() => {
        getAboutContent();
    }, []);

    return (
        <section className="section-admin-about" style={{ padding: "4rem 0", background: "#0f172a", minHeight: "100vh", color: "white" }}>
            <div className="container">
                <NavLink to="/admin-dashboard" style={{ color: "var(--btn-color)", fontSize: "1.6rem", marginBottom: "2rem", display: "inline-block" }}>
                    ← Back to Dashboard
                </NavLink>
                <h1 className="main-heading">Edit About Page Content</h1>
                <form onSubmit={handleSubmit} style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "1.6rem", marginBottom: "1rem" }}>Title</label>
                        <input type="text" name="title" value={content.title} onChange={handleInput} style={{ width: "100%", padding: "1.2rem", borderRadius: "0.5rem", border: "1px solid #334155", background: "#1e293b", color: "white" }} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "1.6rem", marginBottom: "1rem" }}>Description</label>
                        <textarea name="description" value={content.description} onChange={handleInput} style={{ width: "100%", padding: "1.2rem", borderRadius: "0.5rem", minHeight: "100px", border: "1px solid #334155", background: "#1e293b", color: "white" }} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "1.6rem", marginBottom: "1rem" }}>Mission Statement</label>
                        <textarea name="mission" value={content.mission} onChange={handleInput} style={{ width: "100%", padding: "1.2rem", borderRadius: "0.5rem", minHeight: "100px", border: "1px solid #334155", background: "#1e293b", color: "white" }} />
                    </div>

                    <h2 style={{ fontSize: "2rem", marginBottom: "1rem", borderBottom: "1px solid #334155", paddingBottom: "1rem", marginTop: "3rem" }}>Analytics Section</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.4rem" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "1.4rem", marginBottom: "1rem" }}>Companies Registered</label>
                            <input 
                                type="text" 
                                name="analyticsCompanies" 
                                value={content.analyticsCompanies} 
                                onChange={handleInput} 
                                autoComplete="off"
                                style={{ width: "100%", padding: "1.2rem", borderRadius: "0.5rem", border: "1px solid #334155", background: "#1e293b", color: "white" }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "1.4rem", marginBottom: "1rem" }}>Projects Completed</label>
                            <input 
                                type="text" 
                                name="analyticsProjects" 
                                value={content.analyticsProjects} 
                                onChange={handleInput} 
                                autoComplete="off"
                                style={{ width: "100%", padding: "1.2rem", borderRadius: "0.5rem", border: "1px solid #334155", background: "#1e293b", color: "white" }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "1.4rem", marginBottom: "1rem" }}>Happy Clients</label>
                            <input 
                                type="text" 
                                name="analyticsClients" 
                                value={content.analyticsClients} 
                                onChange={handleInput} 
                                autoComplete="off"
                                style={{ width: "100%", padding: "1.2rem", borderRadius: "0.5rem", border: "1px solid #334155", background: "#1e293b", color: "white" }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "1.4rem", marginBottom: "1rem" }}>YouTube Subscribers</label>
                            <input 
                                type="text" 
                                name="analyticsYoutube" 
                                value={content.analyticsYoutube} 
                                onChange={handleInput} 
                                autoComplete="off"
                                style={{ width: "100%", padding: "1.2rem", borderRadius: "0.5rem", border: "1px solid #334155", background: "#1e293b", color: "white" }}
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "1.6rem", marginBottom: "1rem" }}>About Page Image URL</label>
                        <input 
                            type="text" 
                            name="aboutImage" 
                            value={content.aboutImage} 
                            onChange={handleInput}
                            placeholder="e.g., /images/about.png or a full URL"
                            style={{ width: "100%", padding: "1.2rem", borderRadius: "0.5rem", border: "1px solid #334155", background: "#1e293b", color: "white" }}
                        />
                    </div>
                    <button type="submit" className="btn" style={{ marginTop: "2rem", alignSelf: "flex-start" }}>Update Content</button>
                </form>
            </div>
        </section>
    );
};