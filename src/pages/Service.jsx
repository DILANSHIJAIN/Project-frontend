import { useAuth } from "../store/auth";
import { NavLink } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL; // Ensure this is set to IP in .env

export const Service = () => {
    const { services, isLoading } = useAuth();

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
        </section>
    );
};