import React from 'react';

interface ServiceProps {
  title: string;
  description: string;
  provider: string;
  price: string;
  image?: string;
}

const ServiceCard: React.FC<ServiceProps> = ({ title, description, provider, price, image }) => {
  return (
    <div className="card">
      <div className="card-img">
        {/* If using icons, you can replace this with your icon logic */}
        <img src={image || "/images/design.png"} alt={title} />
      </div>

      <div className="card-details">
        <div className="card-meta">
          <p className="provider-tag">{provider}</p>
          <p className="price-tag">{price}</p>
        </div>

        <h2 className="service-title">{title}</h2>
        <p className="service-desc">{description}</p>
        <button className="mt-4 self-start">Learn More</button>
      </div>
    </div>
  );
};

export default ServiceCard;