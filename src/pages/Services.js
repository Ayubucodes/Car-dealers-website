import React from 'react';
import SectionTitle from '../components/SectionTitle';
import '../styles/SecondaryPages.css';

const Services = () => {
  const serviceItems = [
    {
      title: "Car Sales",
      description: "We offer a wide range of new and certified pre-owned luxury vehicles with transparent pricing and full history reports.",
      image: "images/sales.png"
    },
    {
      title: "Financing & Insurance",
      description: "Our finance experts work with multiple lenders to provide you with the best rates and flexible payment plans tailored to your budget.",
      image: "images/money.png"
    },
    {
      title: "Maintenance & Repair",
      description: "Our state-of-the-art service center is staffed by factory-trained technicians using only genuine OEM parts for your vehicle.",
      image: "images/mechanic.png"
    },
    {
      title: "Trade-In Service",
      description: "Get a fair and competitive market value for your current vehicle. We make the trade-in process quick, easy, and hassle-free.",
      image: "images/suv.png"
    },
    {
      title: "Custom Orders",
      description: "Can't find exactly what you're looking for? We can help you custom order your dream car directly from the manufacturer.",
      image: "images/mercedes.png"
    },
    {
      title: "Roadside Assistance",
      description: "Enjoy peace of mind with our 24/7 roadside assistance programs available for all our certified pre-owned vehicles.",
      image: "images/truck.png"
    }
  ];

  return (
    <div className="secondary-page services-page">
      <div className="detail-header-bg">
      </div>

      <section className="section-padding">
        <div className="container">
          <SectionTitle
            subtitle="What We Offer"
            title="Premium Services for Premium Cars"
          />
          <div className="services-detailed-grid">
            {serviceItems.map((service, index) => (
              <div key={index} className="service-detail-card">
                <div className="service-icon-large">
                  <img src={service.image} alt={service.title} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                {/* <button className="btn-link">Read More →</button> */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      {/* <section className="section-padding bg-light">
        <div className="container">
          <div className="why-choose-us-flex">
            <div className="why-choose-text">
              <SectionTitle
                subtitle="Why Choose Us"
                title="The Most Trusted Name in the Business"
                centered={false}
              />
              <div className="reason-item">
                <h4>Wide Selection</h4>
                <p>Over 1000+ premium cars in stock across multiple locations.</p>
              </div>
              <div className="reason-item">
                <h4>Expert Support</h4>
                <p>Dedicated sales and technical team with decades of experience.</p>
              </div>
              <div className="reason-item">
                <h4>Customer First</h4>
                <p>98% customer satisfaction rating based on verified reviews.</p>
              </div>
            </div>
            <div className="why-choose-image">
              <img src="images/about.jpg" alt="Customer Service" />
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Services;
