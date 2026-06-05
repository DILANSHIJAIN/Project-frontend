import React from 'react';
import ServiceCard from './ServiceCard';
import { useAuth } from "../store/auth";

// 1. Define an interface for the service data structure
interface ServiceItem {
  _id: string;
  service: string;
  description: string;
  provider: string;
  price: string;
  image?: string;
}

const ServicesSection: React.FC = () => {
  const { services } = useAuth();
  
  // Debugging: This will show in your browser console (F12) 
  // to confirm if data is arriving from Atlas.
  console.log("Services from Atlas:", services);

  return (
    <section className="section-services">
      <div className="container">
        <h1 className="main-heading">Services</h1>
        
        <div className="grid grid-three-cols">
          {services && services.length > 0 ? (
            services.map((curElem: ServiceItem) => {
              const { _id, service, description, provider, price, image } = curElem;
            
              return (
                <ServiceCard 
                  key={_id}
                  title={service}
                  description={description}
                  provider={provider}
                  price={price}
                  image={image}
                />
              );
            })
          ) : (
            <p>No services found. Check your database connection.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;