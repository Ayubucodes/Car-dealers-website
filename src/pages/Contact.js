import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, Clock, Headphones, Facebook, Twitter, Instagram, Youtube, Globe } from 'lucide-react';
import { sendMessage } from '../api/cars';
import '../styles/SecondaryPages.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const sanitizeText = (value, maxLen) => {
    const text = String(value ?? '')
      .replace(/<[^>]*>/g, '')
      .replace(/[\u0000-\u001F\u007F]/g, '')
      .trim();
    return maxLen ? text.slice(0, maxLen) : text;
  };

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? '').trim());

  const normalizePhone = (value) => String(value ?? '').replace(/[^0-9+]/g, '').trim();

  const isValidPhone = (value) => {
    const phone = normalizePhone(value);
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 9 && digits.length <= 15;
  };

  const onChangeField = (key) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const payload = {
        name: sanitizeText(formData.name, 80),
        email: sanitizeText(formData.email, 120),
        phone: normalizePhone(formData.phone),
        subject: sanitizeText(formData.subject, 120),
        message: sanitizeText(formData.message, 2000),
      };

      if (!payload.name || !payload.email || !payload.phone || !payload.subject || !payload.message) {
        throw new Error('Please fill in all required fields.');
      }

      if (!isValidEmail(payload.email)) {
        throw new Error('Please enter a valid email address.');
      }

      if (!isValidPhone(payload.phone)) {
        throw new Error('Please enter a valid phone number.');
      }

      const res = await sendMessage({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        subject: payload.subject,
        message: payload.message,
      });

      setSubmitSuccess(res?.message || 'Thanks! Your message has been sent.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setSubmitError(err?.message || 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="secondary-page contact-page">
      <div className="detail-header-bg">
      </div>

      {/* Top Heading Section */}
      <section className="contact-header-section section-padding">
        <div className="container">
          <div className="contact-header-flex">
            <div className="contact-header-left">
              <h1>Have Questions?</h1>
              <h1>Get In Touch!</h1>
            </div>
            <div className="contact-header-right">
              <p>Great! We're excited to hear from you and let's start something special together. call us for any inquery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form and Sidebar Section */}
      <section className="section-padding pt-0">
        <div className="container">
          <div className="contact-main-grid">
            <div className="contact-form-side">
              <div className="section-subtitle">Get in touch</div>
              <h2>Send A Message</h2>
              <p className="form-desc">Our experts and developers would love to contribute their expertise and insights to your potencial projects</p>

              <form className="modern-contact-form" onSubmit={onSubmit}>
                <div className="form-row">
                  <input type="text" placeholder="Your Name*" required value={formData.name} onChange={onChangeField('name')} />
                  <input type="email" placeholder="Email Address*" required value={formData.email} onChange={onChangeField('email')} />
                </div>
                <div className="form-row">
                  <input type="text" placeholder="Phone Number*" required value={formData.phone} onChange={onChangeField('phone')} />
                  <input type="text" placeholder="Subject*" required value={formData.subject} onChange={onChangeField('subject')} />
                </div>
                <textarea placeholder="Write a Message" rows="6" required value={formData.message} onChange={onChangeField('message')}></textarea>
                {submitError ? (
                  <div className="form-alert form-alert-error" role="alert">{submitError}</div>
                ) : null}
                {submitSuccess ? (
                  <div className="form-alert form-alert-success" role="status">{submitSuccess}</div>
                ) : null}
                <button type="submit" className="send-msg-btn" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            <div className="contact-sidebar">
              <div className="sidebar-content">
                <h3>Contact Details</h3>
                <div className="sidebar-info-item">
                  <p>16114 Msigani Street, Dar es Salaam</p>
                </div>
                <div className="sidebar-info-item">
                  <span className="info-label">Send email</span>
                  <p className="info-value">primepicks@gmail.com</p>
                </div>
                <div className="sidebar-info-item">
                  <span className="info-label">Call anytime</span>
                  <p className="info-value">+255 765 630 401</p>
                </div>

                <div className="sidebar-social">
                  <button className="social-icon facebook" aria-label="Facebook"><Facebook size={16} /></button>
                  <button className="social-icon twitter" aria-label="Twitter"><Twitter size={16} /></button>
                  <button className="social-icon instagram" aria-label="Instagram"><Instagram size={16} /></button>
                  <button className="social-icon dribbble" aria-label="Website"><Globe size={16} /></button>
                  <button className="social-icon youtube" aria-label="YouTube"><Youtube size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Map Section */}
      <section className="section-padding">
        <div className="container">
          <div className="map-container">
            <div className="map-wrapper">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d31690.808265287167!2d39.35744527692873!3d-6.848456058428846!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x185c45b043447ef3%3A0x904c7ddd93321e22!2sPrimepicks%2C%20MSIGANI%2016114!3m2!1d-6.791925699999999!2d39.125263499999996!5e0!3m2!1sen!2stz!4v1771501780095!5m2!1sen!2stz"
                width="100%"
                height="450"
                style={{ border: 0 }}
                title="Google Maps - Primepicks Location"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
