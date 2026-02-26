import React from 'react';
import '../styles/SectionTitle.css';

const SectionTitle = ({ title, subtitle, centered = true }) => {
  return (
    <div className={`section-title ${centered ? 'text-center' : ''}`}>
      {subtitle && <span className="subtitle">{subtitle}</span>}
      <h2>{title}</h2>
      <div className="title-divider"></div>
    </div>
  );
};

export default SectionTitle;
