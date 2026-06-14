import { useState, useEffect } from "react";
import { useAuth } from "../store/auth"; // Ensure this path is correct

const API_URL = import.meta.env.VITE_API_URL;

  export const About = () => {
    const { user, authorizationToken } = useAuth();
    const [content, setContent] = useState({
      title: "WHY CHOOSE US?",
      description: "Expertise: Our team is made up of highly skilled IT professionals...",
      mission: "Our mission is to ensure your systems remain stable and secure.",
      analyticsCompanies: "50+",
      analyticsProjects: "150+",
      analyticsClients: "250+",
      analyticsYoutube: "650k+"
    }); // Add aboutImage to state
    const [aboutImage, setAboutImage] = useState("/images/about.png"); // Default image for about page

    useEffect(() => {
      fetch(`${API_URL}/api/about`) // Public endpoint
        .then(res => res.json())
        .then(data => { if (data && !data.message) setContent(prev => ({ ...prev, ...data })); })
        .catch(err => console.log(err));
    }, []); // Removed authorizationToken from dependency array as it's not used in fetch

    // Update aboutImage state when content changes
    useEffect(() => { if (content.aboutImage) setAboutImage(content.aboutImage); }, [content.aboutImage]);

    const maskEmail = (email) => {
      if (!email || !email.includes("@")) return email;
      const [name, domain] = email.split("@");
      return `${name.substring(0, 2)}***@${domain}`;
    };

  return (
    <>
      <main>
        <section className="section-hero">
          <div className="container grid grid-two-cols">

            <div className="SmartServe">
              <p>Welcome, {user && user.username ? `${maskEmail(user.username)} To Our Website` : 'To Our Website'}</p>
              <h1>{content.title}</h1>

              <p>
                {content.description}
              </p>

              <p>
                {content.mission}
              </p>

              <div className="btn btn-group">
                <a href="/contact">
                  <button className="btn">Connect Now</button>
                </a>

                <a href="/services">
                  <button className="btn secondary-btn">Learn More</button>
                </a>
              </div>
            </div>

            {/* ABOUT image */}
            <div className="SmartServe">
              <img
                src={aboutImage} // Use image from content state
                alt="Team working together"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>

          </div>
        </section>
      </main>

      <section className="section-analytics">
        <div className="container grid grid-four-cols">

          <div className="div1">
            <h2>{content.analyticsCompanies}</h2>
            <p>Companies Registered</p>
          </div>

          <div className="div1">
            <h2>{content.analyticsProjects}</h2>
            <p>Projects Completed</p>
          </div>

          <div className="div1">
            <h2>{content.analyticsClients}</h2>
            <p>Happy Clients</p>
          </div>

          <div className="div1">
            <h2>{content.analyticsYoutube}</h2>
            <p>YouTube Subscribers</p>
          </div>

        </div>
      </section>
    </>
  );
};