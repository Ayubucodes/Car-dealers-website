import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Gauge, Fuel, Zap, Car } from 'lucide-react';
import '../styles/CarCard.css';

const CarCard = ({ car, viewMode = 'grid' }) => {
  const carIdentifier = car?.uuid || car?.id;
  const [imageError, setImageError] = useState(false);
  if (viewMode === 'list') {
    return (
      <Link to={`/inventory/${carIdentifier}`} className="car-card car-card-list">
        <div className="car-list-content">
          <div className="car-list-image">
            {imageError ? (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
                <Car size={80} style={{ color: '#6c757d' }} />
              </div>
            ) : (
              <img src={car.image} alt={car.name} onError={() => setImageError(true)} />
            )}
            <div className="car-badge">{car.condition}</div>
          </div>
          <div className="car-list-details">
            <p className="car-description">
              Experience luxury and performance with this stunning vehicle. Premium features, excellent condition, and well-maintained.
            </p>
            <div className="car-list-pricing">
              <span className="original-price">Tsh {car.price ? (car.price * 1.1).toLocaleString() : '0'}.00</span>
              <span className="discounted-price">Tsh {car.price ? car.price.toLocaleString() : '0'}.00</span>
            </div>
            <div className="car-list-features">
              <span className="feature-tag">{car.year}</span>
              <span className="feature-tag">{car.transmission}</span>
              <span className="feature-tag">{car.mileage}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/inventory/${carIdentifier}`} className="car-card">
      <div className="car-image">
        {imageError ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
            <Car size={80} style={{ color: '#6c757d' }} />
          </div>
        ) : (
          <img src={car.image} alt={car.name} onError={() => setImageError(true)} />
        )}
        <div className="car-badge">{car.condition}</div>
        <div className="car-price">Tshs {car.price ? car.price.toLocaleString() : '0'}</div>
      </div>
      <div className="car-content">
        <h3 className="car-title">
          {car.name}
        </h3>
        <div className="car-specs">
          <div className="spec-item">
            <Calendar size={16} />
            <span>{car.year}</span>
          </div>
          <div className="spec-item">
            <Gauge size={16} />
            <span>{car.mileage}</span>
          </div>
          <div className="spec-item">
            <Fuel size={16} />
            <span>{car.fuelType}</span>
          </div>
          <div className="spec-item">
            <Zap size={16} />
            <span>{car.transmission}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;
