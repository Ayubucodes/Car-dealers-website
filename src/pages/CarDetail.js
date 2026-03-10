import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Heart,
  Share2,
  LayoutGrid,
  List,
  Settings,
  Info,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Link as LinkIcon,
  Car,
} from 'lucide-react';
import CarCard from '../components/CarCard';
import Spinner from '../components/Spinner';
import { createOrder, fetchCarByUuid, fetchLikeStatus, fetchRelatedCars, likeCar, mapApiCarImages, mapApiCarToUiCar, unlikeCar } from '../api/cars';
import '../styles/CarDetail.css';

const CarDetail = () => {
  const { uuid } = useParams();
  const [car, setCar] = useState(null);
  const [relatedCars, setRelatedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState('');
  const [isOrderSubmitting, setIsOrderSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikeSubmitting, setIsLikeSubmitting] = useState(false);
  const [likeError, setLikeError] = useState('');
  const [mainImageError, setMainImageError] = useState(false);
  const [thumbnailErrors, setThumbnailErrors] = useState({});
  const [orderForm, setOrderForm] = useState({
    user_phone: '',
    address: '',
    state: '',
    zip: '',
    agree: false,
    captcha: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [uuid]);

  useEffect(() => {
    setIsLiked(false);
    setLikeError('');
  }, [uuid]);

  useEffect(() => {
    if (!isShareModalOpen) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsShareModalOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isShareModalOpen]);

  useEffect(() => {
    if (!isOrderModalOpen) return;

    setOrderError('');
    setOrderSuccess('');

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsOrderModalOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOrderModalOpen]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        setCurrentImageIndex(0);
        setMainImageError(false);
        setThumbnailErrors({});

        const apiCar = await fetchCarByUuid(uuid);
        if (!apiCar) {
          throw new Error('Car not found');
        }

        const uiCar = mapApiCarToUiCar(apiCar);
        const images = mapApiCarImages(apiCar);

        const detailCar = {
          ...uiCar,
          images: images.length ? images : uiCar.image ? [uiCar.image] : [],
          overview: apiCar.overview || apiCar.short_description || '',
          featureOption: apiCar.feature_option || '',
          generalOption: apiCar.general_option || '',
          make: apiCar.make?.name,
          model: apiCar.model?.name,
          drivetrain: apiCar.drivetrain,
          engine: apiCar.engine,
          fuelEconomy: apiCar.fuel_economy,
          trim: apiCar.trim,
          exteriorColor: apiCar.exterior_color,
          interiorColor: apiCar.interior_color,
          vin: apiCar.vin,
          oldPrice: apiCar.old_price,
          rpm: apiCar.rpm,
          displacement: apiCar.displacement,
          engineLayout: apiCar.engine_layout,
          torque: apiCar.torque,
          compressionRatio: apiCar.compression_ratio,
          cylindersLayout: apiCar.cylinders_layout,
        };

        if (!cancelled) setCar(detailCar);

        try {
          const likeRes = await fetchLikeStatus(apiCar.id);
          if (!cancelled) setIsLiked(Boolean(likeRes?.liked));
        } catch {
          if (!cancelled) setIsLiked(false);
        }

        const related = await fetchRelatedCars(apiCar.make_id, apiCar.id);
        if (!cancelled) setRelatedCars(related);
      } catch (e) {
        if (!cancelled) setError('Please check your connection and try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (uuid) {
      load();
    }

    return () => {
      cancelled = true;
    };
  }, [uuid]);

  const getFeatureItems = () => {
    const text = car?.featureOption || '';
    if (!text) return [];

    return text
      .split(/\r?\n|,|\u2022|-/g)
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const renderSpecItem = (label, value) => {
    if (value == null) return null;
    const text = String(value).trim();
    if (!text) return null;

    return (
      <div className="spec-item_details">
        <span className="spec-label">{label}</span>
        <span className="spec-value">{text}</span>
      </div>
    );
  };

  const getTechnicalSpecs = () => {
    const specs = [
      { label: 'Layout / number of cylinders', value: car?.cylindersLayout },
      { label: 'Displacement', value: car?.displacement },
      { label: 'Engine Layout', value: car?.engineLayout },
      { label: '@ rpm', value: car?.rpm != null ? String(car.rpm) : '' },
      { label: 'Torque', value: car?.torque },
      { label: 'Compression ratio', value: car?.compressionRatio },
    ];

    return specs.filter((s) => s.value != null && String(s.value).trim() !== '');
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${car?.year || ''} ${car?.name || ''}`.trim();
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText || shareUrl);

  return (
    <div className="car-detail-page">
      <div className="detail-header-bg">
      </div>
      <div className="container">
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Spinner />
          </div>
        )}
        {!loading && error && (
          <div
            className="results-count"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 16,
              padding: '140px 0',
            }}
          >
            <img src="/images/empty.png" alt="No data available" style={{ maxWidth: '200px', opacity: 0.7 }} />
            <span>{error}</span>
          </div>
        )}
        {!loading && !error && car && (
          <>
            <div className="detail-grid">
              <main className="detail-main">
                {/* Image Gallery */}
                <div className="image-gallery">
                  <div className="main-image-container">
                    {mainImageError ? (
                      <div className="main-image" style={{ width: '100%', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
                        <Car size={80} style={{ color: '#6c757d' }} />
                      </div>
                    ) : (
                      <img src={car.images[currentImageIndex]} alt={car.name} className="main-image" onError={() => setMainImageError(true)} />
                    )}
                    <button className="arrow-btn arrow-left" onClick={() => { setCurrentImageIndex((prev) => (prev === 0 ? car.images.length - 1 : prev - 1)); setMainImageError(false); }}>
                      <ChevronLeft size={24} />
                    </button>
                    <button className="arrow-btn arrow-right" onClick={() => { setCurrentImageIndex((prev) => (prev === car.images.length - 1 ? 0 : prev + 1)); setMainImageError(false); }}>
                      <ChevronRight size={24} />
                    </button>
                  </div>
                  <div className="thumbnail-grid">
                    {car.images.map((img, index) => (
                      <div key={index} className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`} onClick={() => { setCurrentImageIndex(index); setMainImageError(false); }}>
                        {thumbnailErrors[index] ? (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
                            <Car size={40} style={{ color: '#6c757d' }} />
                          </div>
                        ) : (
                          <img src={img} alt={`${car.name} view ${index + 1}`} onError={() => setThumbnailErrors((prev) => ({ ...prev, [index]: true }))} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Bar */}
                <div className="detail-action-bar">
                  <div className="action-left">
                    <button
                      className="action-link"
                      disabled={isLikeSubmitting}
                      onClick={async () => {
                        if (!car?.id) return;
                        setLikeError('');
                        setIsLikeSubmitting(true);
                        try {
                          if (isLiked) {
                            await unlikeCar(car.id);
                            setIsLiked(false);
                          } else {
                            await likeCar(car.id);
                            setIsLiked(true);
                          }
                        } catch (e) {
                          setLikeError(e?.message || 'Failed to update favorite');
                        } finally {
                          setIsLikeSubmitting(false);
                        }
                      }}
                    >
                      <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />{isLiked ? 'Unlike' : 'Like'}
                    </button>
                  </div>
                  <div className="action-right">
                    <button className="action-link" onClick={() => setIsShareModalOpen(true)}>Share This <Share2 size={16} /></button>
                  </div>
                </div>

                {likeError ? <div className="results-count">{likeError}</div> : null}

                {/* Tabs Section */}
                <div className="detail-tabs-section">
                  <div className="tabs-accordion">
                    <button
                      type="button"
                      className={`accordion-tab ${activeTab === 'overview' ? 'active' : ''}`}
                      onClick={() => setActiveTab('overview')}
                    >
                      <span className="accordion-tab-left">
                        <LayoutGrid size={18} /> OVERVIEW
                      </span>
                      <ChevronDown size={18} className="accordion-chevron" />
                    </button>
                    {activeTab === 'overview' && (
                      <div className="accordion-panel">
                        <p className="tab-description">
                          {car.overview}
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      className={`accordion-tab ${activeTab === 'features' ? 'active' : ''}`}
                      onClick={() => setActiveTab('features')}
                    >
                      <span className="accordion-tab-left">
                        <List size={18} /> FEATURES & OPTIONS
                      </span>
                      <ChevronDown size={18} className="accordion-chevron" />
                    </button>
                    {activeTab === 'features' && (
                      <div className="accordion-panel">
                        <div className="features-checklist">
                          {getFeatureItems().map((feature, index) => (
                            <div key={index} className="checklist-item">
                              <Check size={18} className="check-icon" />
                              <span>{feature}</span>
                            </div>
                          ))}
                          {!getFeatureItems().length && (
                            <div className="checklist-item">
                              <span>{car.featureOption}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      className={`accordion-tab ${activeTab === 'tech' ? 'active' : ''}`}
                      onClick={() => setActiveTab('tech')}
                    >
                      <span className="accordion-tab-left">
                        <Settings size={18} /> TECHNICAL SPECIFICATIONS
                      </span>
                      <ChevronDown size={18} className="accordion-chevron" />
                    </button>
                    {activeTab === 'tech' && (
                      <div className="accordion-panel">
                        <div className="tech-table">
                          <div className="table-row table-header">
                            <div className="table-cell">Engine</div>
                            <div className="table-cell"></div>
                          </div>
                          {getTechnicalSpecs().map((spec, index) => (
                            <div key={index} className="table-row">
                              <div className="table-cell label">{spec.label}</div>
                              <div className="table-cell value">{spec.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      className={`accordion-tab ${activeTab === 'general' ? 'active' : ''}`}
                      onClick={() => setActiveTab('general')}
                    >
                      <span className="accordion-tab-left">
                        <Info size={18} /> GENERAL INFORMATION
                      </span>
                      <ChevronDown size={18} className="accordion-chevron" />
                    </button>
                    {activeTab === 'general' && (
                      <div className="accordion-panel">
                        <p className="tab-description">
                          {car.generalOption}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="tabs-header">
                    <button
                      className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                      onClick={() => setActiveTab('overview')}
                    >
                      <LayoutGrid size={18} /> OVERVIEW
                    </button>
                    <button
                      className={`tab-btn ${activeTab === 'features' ? 'active' : ''}`}
                      onClick={() => setActiveTab('features')}
                    >
                      <List size={18} /> FEATURES & OPTIONS
                    </button>
                    <button
                      className={`tab-btn ${activeTab === 'tech' ? 'active' : ''}`}
                      onClick={() => setActiveTab('tech')}
                    >
                      <Settings size={18} /> TECHNICAL SPECIFICATIONS
                    </button>
                    <button
                      className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
                      onClick={() => setActiveTab('general')}
                    >
                      <Info size={18} /> GENERAL INFORMATION
                    </button>
                  </div>

                  <div className="tabs-content">
                    {activeTab === 'overview' && (
                      <div className="tab-pane overview-pane">
                        <p className="tab-description">
                          {car.overview}
                        </p>
                      </div>
                    )}

                    {activeTab === 'features' && (
                      <div className="tab-pane features-pane">
                        <div className="features-checklist">
                          {getFeatureItems().map((feature, index) => (
                            <div key={index} className="checklist-item">
                              <Check size={18} className="check-icon" />
                              <span>{feature}</span>
                            </div>
                          ))}
                          {!getFeatureItems().length && (
                            <div className="checklist-item">
                              <span>{car.featureOption}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === 'tech' && (
                      <div className="tab-pane tech-pane">
                        <div className="tech-table">
                          <div className="table-row table-header">
                            <div className="table-cell">Engine</div>
                            <div className="table-cell"></div>
                          </div>
                          {getTechnicalSpecs().map((spec, index) => (
                            <div key={index} className="table-row">
                              <div className="table-cell label">{spec.label}</div>
                              <div className="table-cell value">{spec.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'general' && (
                      <div className="tab-pane general-pane">
                        <p className="tab-description">
                          {car.generalOption}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </main>

              <aside className="detail-sidebar">
                <nav className="breadcrumb">
                  Home / Inventory / {car.year} / <span>{car.year} {car.name}</span>
                </nav>

                <h1 className="vehicle-title">{car.year} {car.name}</h1>

                <div className="vehicle-subtitle">
                  {car.year}{car.make ? ` • ${car.make}` : ''}{car.model ? ` • ${car.model}` : ''}
                </div>

                <p className="vehicle-description">
                  {car.overview}
                </p>

                <div className="price-section">
                  <span className="current-price">Tshs {car.price?.toLocaleString()}</span>
                  {car.oldPrice ? (
                    <span className="old-price">Tshs {Number(car.oldPrice).toLocaleString()}</span>
                  ) : null}
                </div>

                <button className="request-info-btn" onClick={() => setIsOrderModalOpen(true)}>
                  <span className="icon">?</span> Press Order
                </button>

                <div className="specs-section">
                  <h3 className="section-title">Description</h3>
                  <div className="title-underline"></div>

                  <div className="specs-list">
                    {renderSpecItem('Year', car.year)}
                    {renderSpecItem('Make', car.make)}
                    {renderSpecItem('Model', car.model)}
                    {renderSpecItem('Body Style', car.bodyType)}
                    {renderSpecItem('Condition', car.condition)}
                    {renderSpecItem('Mileage', car.mileage)}
                    {renderSpecItem('Transmission', car.transmission)}
                    {renderSpecItem('Drivetrain', car.drivetrain)}
                    {renderSpecItem('Engine', car.engine)}
                    {renderSpecItem('Fuel Type', car.fuelType)}
                    {renderSpecItem('Fuel Economy', car.fuelEconomy)}
                    {renderSpecItem('Trim', car.trim)}
                    {renderSpecItem('Exterior Color', car.exteriorColor)}
                    {renderSpecItem('Interior Color', car.interiorColor)}
                    {renderSpecItem('VIN Number', car.vin)}
                  </div>
                </div>
              </aside>
            </div>

            {/* Related Vehicles Section */}
            <div className="related-vehicles-section">
              <h2 className="related-title">Related Vehicle</h2>
              <div className="related-grid">
                {relatedCars.map((vehicle) => (
                  <CarCard key={vehicle.uuid || vehicle.id} car={vehicle} />
                ))}
              </div>
            </div>

            {isShareModalOpen ? (
              <div
                className="share-modal-overlay"
                role="dialog"
                aria-modal="true"
                aria-label="Share This"
                onMouseDown={(e) => {
                  if (e.target === e.currentTarget) setIsShareModalOpen(false);
                }}
              >
                <div className="share-modal" onMouseDown={(e) => e.stopPropagation()}>
                  <div className="share-modal-header">
                    <div className="share-modal-title">Share This</div>
                    <button
                      type="button"
                      className="share-modal-close"
                      onClick={() => setIsShareModalOpen(false)}
                      aria-label="Close"
                    >
                      ×
                    </button>
                  </div>
                  <div className="share-modal-body">
                    <div className="share-icons">
                      <a
                        className="share-icon-btn"
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Share on Facebook"
                      >
                        <Facebook size={16} />
                      </a>
                      <a
                        className="share-icon-btn"
                        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Share on Twitter"
                      >
                        <Twitter size={16} />
                      </a>
                      <a
                        className="share-icon-btn"
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Share on LinkedIn"
                      >
                        <Linkedin size={16} />
                      </a>
                      <a
                        className="share-icon-btn"
                        href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Share on WhatsApp"
                      >
                        <MessageCircle size={16} />
                      </a>
                      <button
                        type="button"
                        className="share-icon-btn"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(shareUrl);
                          } catch {
                            // ignore
                          }
                        }}
                        aria-label="Copy link"
                      >
                        <LinkIcon size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {isOrderModalOpen ? (
              <div
                className="order-modal-overlay"
                role="dialog"
                aria-modal="true"
                aria-label="Request More Info"
                onMouseDown={(e) => {
                  if (e.target === e.currentTarget) setIsOrderModalOpen(false);
                }}
              >
                <div className="order-modal" onMouseDown={(e) => e.stopPropagation()}>
                  <div className="order-modal-header">
                    <div className="order-modal-title">Make Order</div>
                    <button
                      type="button"
                      className="order-modal-close"
                      onClick={() => setIsOrderModalOpen(false)}
                      aria-label="Close"
                    >
                      ×
                    </button>
                  </div>

                  <form
                    className="order-modal-body"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setOrderError('');
                      setOrderSuccess('');

                      const phone = String(orderForm.user_phone || '').trim();
                      const address = String(orderForm.address || '').trim();
                      const state = String(orderForm.state || '').trim();
                      const zip = String(orderForm.zip || '').trim();

                      if (!car?.id) {
                        setOrderError('Car not found. Please refresh and try again.');
                        return;
                      }

                      if (!phone || !address || !state || !zip) {
                        setOrderError('Please fill in phone number, address, state and zip.');
                        return;
                      }

                      setIsOrderSubmitting(true);
                      try {
                        const res = await createOrder({
                          car_id: car.id,
                          user_phone: phone,
                          user_address: address,
                          state,
                          zip,
                        });
                        setOrderSuccess(res?.message || 'Order created successfully.');
                        setOrderForm((s) => ({
                          ...s,
                          user_phone: '',
                          address: '',
                          state: '',
                          zip: '',
                          agree: false,
                          captcha: false,
                        }));
                      } catch (err) {
                        setOrderError(err?.message || 'Failed to send order.');
                      } finally {
                        setIsOrderSubmitting(false);
                      }
                    }}
                  >
                    {orderError ? <div className="order-alert order-alert-error">{orderError}</div> : null}
                    {orderSuccess ? <div className="order-alert order-alert-success">{orderSuccess}</div> : null}
                    <div className="order-form-grid">
                      <label className="order-field">
                        <span className="order-label">PHONE NUMBER*</span>
                        <input
                          className="order-input"
                          value={orderForm.user_phone}
                          onChange={(e) => setOrderForm((s) => ({ ...s, user_phone: e.target.value }))}
                        />
                      </label>

                      <label className="order-field order-field-full">
                        <span className="order-label">ADDRESS*</span>
                        <textarea
                          className="order-textarea"
                          value={orderForm.address}
                          onChange={(e) => setOrderForm((s) => ({ ...s, address: e.target.value }))}
                        />
                      </label>

                      <label className="order-field">
                        <span className="order-label">STATE*</span>
                        <input
                          className="order-input"
                          value={orderForm.state}
                          onChange={(e) => setOrderForm((s) => ({ ...s, state: e.target.value }))}
                        />
                      </label>

                      <label className="order-field">
                        <span className="order-label">ZIP*</span>
                        <input
                          className="order-input"
                          value={orderForm.zip}
                          onChange={(e) => setOrderForm((s) => ({ ...s, zip: e.target.value }))}
                        />
                      </label>

                      {/* <div className="order-field order-field-full">
                        <div className="order-label">PREFERRED CONTACT</div>
                        <div className="order-radio-row">
                          <label className="order-radio">
                            <input
                              type="radio"
                              name="preferredContact"
                              checked={orderForm.preferredContact === 'email'}
                              onChange={() => setOrderForm((s) => ({ ...s, preferredContact: 'email' }))}
                            />
                            <span>EMAIL</span>
                          </label>
                          <label className="order-radio">
                            <input
                              type="radio"
                              name="preferredContact"
                              checked={orderForm.preferredContact === 'phone'}
                              onChange={() => setOrderForm((s) => ({ ...s, preferredContact: 'phone' }))}
                            />
                            <span>PHONE</span>
                          </label>
                        </div>
                      </div> */}
                      {/* 
                      <label className="order-consent order-field-full">
                        <input
                          type="checkbox"
                          checked={orderForm.agree}
                          onChange={(e) => setOrderForm((s) => ({ ...s, agree: e.target.checked }))}
                        />
                        <span>
                          You agree with the storage and handling of your personal and contact data by this website.
                        </span>
                      </label> */}

                      {/* <div className="order-captcha order-field-full">
                        <label className="order-captcha-left">
                          <input
                            type="checkbox"
                            checked={orderForm.captcha}
                            onChange={(e) => setOrderForm((s) => ({ ...s, captcha: e.target.checked }))}
                          />
                          <span>I'm not a robot</span>
                        </label>
                        <div className="order-captcha-right">
                          <div className="order-captcha-title">reCAPTCHA</div>
                          <div className="order-captcha-sub">Privacy - Terms</div>
                        </div>
                      </div> */}

                      <div className="order-actions order-field-full">
                        <button type="submit" className="order-submit-btn" disabled={isOrderSubmitting}>
                          Send Order
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default CarDetail;
