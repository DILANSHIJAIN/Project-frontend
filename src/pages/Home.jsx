import { useState, useEffect } from "react";
import { useAuth } from "../store/auth"; // Ensure this path is correct

// 🚀 Pull raw environment variable safely
const RAW_API_URL = import.meta.env.VITE_API_URL || "https://ai-powered-helpdesk.onrender.com";

// 🧹 AUTO-CLEAN: Removes any accidental trailing slashes to prevent the double slash (//api) bug
const API_URL = RAW_API_URL.endsWith('/') ? RAW_API_URL.slice(0, -1) : RAW_API_URL;

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

  useEffect(() => { 
    // ✅ Uses the auto-cleaned single-slash API_URL route target cleanly
    fetch(`${API_URL}/api/home`) 
      .then(res => res.json())
      .then(data => {
        // If data is returned correctly and is not an error message
        if (data && !data.message) {
          setContent(prev => ({ ...prev, ...data }));
        }
      })
      .catch(err => console.log("Fetch error:", err));
  }, []); 

  return (
    <>
      <main>

        {/* HERO SECTION */}
        <section className="section-hero">
          <div className="container grid grid-two-cols">

            <div className="SmartServe">
              <p>{content.heroSubtitle}</p>

              <h1>
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
                src={content.homeImage} 
                alt="Working Together" 
                style={{ width: "100%", height: "auto", display: "block" }}
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
            <div className="SmartServe" style={{ order: 1 }}>
              <p>{content.ctaSubtitle}</p>
              <h1>{content.ctaTitle}</h1>
              <p>{content.ctaBody}</p>
              <div className="btn btn-group">
                <a href="/contact">
                  <button className="btn">Connect Now</button>
                </a>
                <a href="/services">
                  <button className="btn secondary-btn">Learn More</button>
                </a>
              </div>
            </div>

            <div className="SmartServe" style={{ order: 2 }}>
              <img
                src={content.ctaImage}
                alt="Working Together" 
                style={{ maxWidth: "100%", height: "auto", display: "block" }}
              />
            </div>

          </div>
        </section>

      </main>
    </>
  );
};