import React from 'react';
import SectionTitle from '../components/SectionTitle';
import '../styles/SecondaryPages.css';

const About = () => {
  return (
    <div className="secondary-page about-page">
      <div className="detail-header-bg">

      </div>

      <section className="section-padding">
        <div className="container">
          <div className="about-content-grid">
            <div className="about-image">
              <img src="images/about.jpg" alt="Our Dealership" />
            </div>
            <div className="about-text">
              <SectionTitle 
                subtitle="Who We Are" 
                title="25 Years of Excellence in Auto Sales" 
                centered={false}
              />
              <p>
                Founded in 2001, Car Dealer has grown from a small family-owned lot to one of the most trusted 
                luxury automotive dealerships in the region. We pride ourselves on our transparent process 
                and exceptional customer service.
              </p>
              <p>
                Our mission is to provide an unparalleled car-buying experience, offering only the finest 
                vehicles that have passed our rigorous 150-point inspection. Whether you're looking for 
                a high-performance sports car or a luxury sedan, we have the expertise to help you find 
                the perfect match.
              </p>
              <div className="about-features">
                <div className="about-feature">
                  <div className="feature-icon">✓</div>
                  <div>
                    <h4>Certified Vehicles</h4>
                    <p>Every car in our inventory undergoes a thorough quality check.</p>
                  </div>
                </div>
                <div className="about-feature">
                  <div className="feature-icon">✓</div>
                  <div>
                    <h4>Best Price Guarantee</h4>
                    <p>We offer competitive pricing and transparent financing options.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
