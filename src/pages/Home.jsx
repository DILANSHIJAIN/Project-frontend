import { useState, useEffect } from "react";
import { useAuth } from "../store/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const Home = () => {
  const { authorizationToken } = useAuth();
  const [content, setContent] = useState({
    heroSubtitle: "Welcome to Ticketing System",
    heroTitle: "WELCOME TO AI-POWERED HELPDESK AND TICKETING SYSTEM",
    heroText: "Welcome to SmartDesk AI — the ultimate AI-powered helpdesk and ticketing platform.",
    heroCtaText: "Connect Now",
    analyticsCompanies: "50+",
    analyticsClients: "100,000+",
    analyticsDevelopers: "500+",
    analyticsAvailability: "24/7",
    ctaSubtitle: "We Are Here To Help You",
    ctaTitle: "GET STARTED TODAY",
    ctaBody: "Are you ready to transform the way customer support works? Experience intelligent ticket management and seamless communication.",
    homeImage: "/images/home.png", // Default image for home page
    ctaImage: "/images/design.png" // Default image for CTA section
  });

  useEffect(() => { // Public endpoint, no auth header needed for viewing
    fetch(`${API_URL}/api/home`) // Public endpoint, no auth header needed for viewing
      .then(res => res.json())
      .then(data => {
        // If data is returned correctly and is not an error message
        if (data && !data.message) {
          setContent(prev => ({ ...prev, ...data }));
        }
      })
      .catch(err => console.log("Fetch error:", err));
  }, []); // Removed authorizationToken from dependency array as it's not needed for public fetch

  return (
    <>
      <main>

        {/* HERO SECTION */}
        <section className="section-hero">
          <div className="container grid grid-two-cols">

            <div className="SmartServe">
              <p>{content.heroSubtitle}</p>

              <h1 style={{ whiteSpace: "pre-wrap" }}>
                {content.heroTitle}
              </h1>

              <p style={{ whiteSpace: "pre-wrap" }}>
                {content.heroText}
              </p>

              <div className="btn btn-group">
                <a href="/contact">
                  <button className="btn">{content.heroCtaText}</button>
                </a>

                <a href="/services">
                  <button className="btn secondary-btn">Learn More</button>
                </a>
              </div>
            </div>

            {/* HOME IMAGE */}
            <div className="SmartServe">
              <img
                src={content.homeImage} // Use image from content state
                alt="Working Together"
                width="800"
                height="600"
              />
            </div>

          </div>
        </section>

        {/* ANALYTICS SECTION */}
        <section className="section-analytics">
          <div className="container grid grid-four-cols">

            <div className="div1">
              <h2>{content.analyticsCompanies}</h2>
              <p>Registered Companies</p>
            </div>

            <div className="div1">
              <h2>{content.analyticsClients}</h2>
              <p>Happy Clients</p>
            </div>

            <div className="div1">
              <h2>{content.analyticsDevelopers}</h2>
              <p>Well-known Developers</p>
            </div>

            <div className="div1">
              <h2>{content.analyticsAvailability}</h2>
              <p>Service Availability</p>
            </div>

          </div>
        </section>

        {/* CTA SECTION */}
        <section className="section-hero">
          <div className="container grid grid-two-cols" style={{ textAlign: "left", alignItems: "flex-start" }}>

            <div className="SmartServe">
              <img
                src={content.ctaImage}
                alt="Working Together"
                width="400"
                height="500"
              />
            </div>

            <div className="SmartServe">
              <p>{content.ctaSubtitle}</p>

              <h1>{content.ctaTitle}</h1>

              <p style={{ whiteSpace: "pre-wrap" }}>{content.ctaBody}</p>

              <div className="btn btn-group">
                <a href="/contact">
                  <button className="btn">Connect Now</button>
                </a>

                <a href="/services">
                  <button className="btn secondary-btn">Learn More</button>
                </a>
              </div>
            </div>

          </div>
        </section>

      </main>
    </>
  );
};