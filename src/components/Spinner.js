import React from 'react';
import '../styles/Spinner.css';

const Spinner = ({ size = 40 }) => {
  return (
    <div className="spinner-container" aria-label="Loading">
      <div className="spinner" style={{ width: size, height: size }} />
    </div>
  );
};

export default Spinner;
