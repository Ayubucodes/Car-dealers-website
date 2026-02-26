import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { subscribeNewsletter } from '../api/cars';
import '../styles/Footer.css';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState('');

  const onNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterError('');
    setNewsletterSuccess('');

    const email = String(newsletterEmail || '').trim();
    if (!email) {
      setNewsletterError('Please enter your email.');
      return;
    }

    setIsNewsletterSubmitting(true);
    try {
      const res = await subscribeNewsletter({ email });
      setNewsletterSuccess(res?.message || 'Subscribed successfully.');
      setNewsletterEmail('');
    } catch (err) {
      setNewsletterError(err?.message || 'Failed to subscribe.');
    } finally {
      setIsNewsletterSubmitting(false);
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-column about">
            <Link to="/" className="logo">
              CAR<span>DEALER</span>
            </Link>
            <p>
              We provide everything you need to build an amazing dealership website.
              Our service is built with the customer in mind.
            </p>
            <div className="social-links">
              <Link to="/"><Facebook size={18} /></Link>
              <Link to="/"><Twitter size={18} /></Link>
              <Link to="/"><Instagram size={18} /></Link>
              <Link to="/"><Linkedin size={18} /></Link>
            </div>
          </div>

          <div className="footer-column links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Our Services</Link></li>
              <li><Link to="/inventory">Inventory</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-column contact">
            <h3>Contact Info</h3>
            <ul className="contact-list">
              <li>
                <MapPin size={18} className="icon" />
                <span>16114 Mbezi Street, Dar es Salaam, Tanzania</span>
              </li>
              <li>
                <Phone size={18} className="icon" />
                <span>+255 765 635 635</span>
              </li>
              <li>
                <Mail size={18} className="icon" />
                <span>cardealer@gmail.com</span>
              </li>
            </ul>
          </div>

          <div className="footer-column newsletter">
            <h3>Newsletter</h3>
            <p>Subscribe to our newsletter for the latest updates and offers.</p>
            <form className="newsletter-form" onSubmit={onNewsletterSubmit}>
              <input
                type="email"
                placeholder="Your Email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
              />
              {newsletterError ? (
                <div className="newsletter-alert newsletter-alert-error" role="alert">{newsletterError}</div>
              ) : null}
              {newsletterSuccess ? (
                <div className="newsletter-alert newsletter-alert-success" role="status">{newsletterSuccess}</div>
              ) : null}
              <button type="submit" className="btn btn-primary" disabled={isNewsletterSubmitting}>
                {isNewsletterSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2026 Car Dealer. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
