import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, MessageSquare, UserCheck, Trophy } from 'lucide-react';
import CarCard from '../components/CarCard';
import SectionTitle from '../components/SectionTitle';
import AnimatedCounter from '../components/AnimatedCounter';
import Spinner from '../components/Spinner';
import {
  fetchAllFeaturedCars,
  fetchBodyStyleCount,
  fetchCarsMeta,
  fetchMakeCount,
  mapApiCarToUiCar,
} from '../api/cars';
import '../styles/Home.css';

const SearchableSelect = ({ value, onChange, options, placeholder, disabled, getOptionValue, getOptionLabel }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef(null);

  const selectedLabel = useMemo(() => {
    if (!value) return '';
    const found = options.find((o) => String(getOptionValue(o)) === String(value));
    return found ? String(getOptionLabel(found)) : '';
  }, [getOptionLabel, getOptionValue, options, value]);

  const filtered = useMemo(() => {
    const q = String(query || '').trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => String(getOptionLabel(o)).toLowerCase().includes(q));
  }, [getOptionLabel, options, query]);

  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [open]);

  useEffect(() => {
    if (disabled && open) {
      setOpen(false);
      setQuery('');
    }
  }, [disabled, open]);

  return (
    <div
      ref={rootRef}
      style={{ position: 'relative', width: '100%' }}
    >
      <button
        type="button"
        onClick={() => {
          if (disabled) return;
          setOpen((v) => !v);
          setQuery('');
        }}
        disabled={disabled}
        className="btn"
        style={{
          width: '100%',
          textAlign: 'left',
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: '12px 14px',
          fontWeight: 500,
        }}
      >
        {selectedLabel || placeholder}
      </button>

      {open ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 'calc(100% + 6px)',
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 10,
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
            zIndex: 50,
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: 10, borderBottom: '1px solid #f1f5f9' }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              placeholder="Search"
              style={{
                width: '100%',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                padding: '10px 12px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ maxHeight: 260, overflowY: 'auto' }}>
            <button
              type="button"
              onClick={() => {
                onChange('');
                setOpen(false);
                setQuery('');
              }}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '10px 12px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              {placeholder}
            </button>
            {filtered.map((o) => {
              const v = String(getOptionValue(o));
              const label = String(getOptionLabel(o));
              const isActive = value && String(value) === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => {
                    onChange(v);
                    setOpen(false);
                    setQuery('');
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 12px',
                    border: 'none',
                    background: isActive ? '#f1f5f9' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();

  const [featuredCars, setFeaturedCars] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState('');

  const [metaLoading, setMetaLoading] = useState(true);
  const [metaError, setMetaError] = useState('');
  const [meta, setMeta] = useState({ makes: [], models: [], years: [], mileage_ranges: [] });

  const [makeId, setMakeId] = useState('');
  const [modelId, setModelId] = useState('');
  const [year, setYear] = useState('');
  const [mileageRange, setMileageRange] = useState('');

  // Load cached counts on mount
  const cachedMakeCounts = (() => {
    try {
      return JSON.parse(localStorage.getItem('makeCounts') || '{}');
    } catch {
      return {};
    }
  })();

  const cachedBodyStyleCounts = (() => {
    try {
      return JSON.parse(localStorage.getItem('bodyStyleCounts') || '{}');
    } catch {
      return {};
    }
  })();

  const hasCache = Object.keys(cachedMakeCounts).length > 0 || Object.keys(cachedBodyStyleCounts).length > 0;

  const [makeCounts, setMakeCounts] = useState(cachedMakeCounts);
  const [bodyStyleCounts, setBodyStyleCounts] = useState(cachedBodyStyleCounts);
  const [countsLoading, setCountsLoading] = useState(!hasCache);

  const goToBodyStyle = (style) => {
    const params = new URLSearchParams();
    params.set('page', '1');
    params.set('per_page', '10');
    navigate(`/inventory/body-style/${encodeURIComponent(style)}?${params.toString()}`);
  };

  const goToMake = (id) => {
    const params = new URLSearchParams();
    params.set('page', '1');
    params.set('per_page', '10');
    navigate(`/inventory/make/${encodeURIComponent(String(id))}?${params.toString()}`);
  };

  const goToMakeByName = (name) => {
    const normalized = String(name || '').trim().toLowerCase();
    if (!normalized) return;

    const found = meta.makes.find((m) => String(m?.name || '').trim().toLowerCase() === normalized);
    if (found?.id != null) {
      goToMake(found.id);
      return;
    }

    const params = new URLSearchParams();
    params.set('make_id', '0');
    params.set('page', '1');
    params.set('per_page', '10');
    navigate(`/inventory?${params.toString()}`);
  };

  const handleBrandGridClick = (e) => {
    const card = e.target.closest('.brand-card');
    if (!card) return;
    const name = card.getAttribute('data-make');
    if (name) goToMakeByName(name);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (makeId) params.set('make_id', makeId);
    if (modelId) params.set('model_id', modelId);
    if (year) params.set('year', year);
    if (mileageRange) params.set('mileage_range', mileageRange);
    params.set('page', '1');
    params.set('per_page', '10');

    const qs = params.toString();
    navigate(qs ? `/inventory?${qs}` : '/inventory');
  };

  useEffect(() => {
    let cancelled = false;

    const loadMeta = async () => {
      try {
        setMetaLoading(true);
        setMetaError('');
        const data = await fetchCarsMeta({ make_id: makeId, model_id: modelId });
        if (!cancelled) setMeta(data);
      } catch (e) {
        if (!cancelled) setMetaError(e?.message || 'Failed to load filters');
      } finally {
        if (!cancelled) setMetaLoading(false);
      }
    };

    loadMeta();
    return () => {
      cancelled = true;
    };
  }, [makeId, modelId]);

  useEffect(() => {
    let cancelled = false;

    const loadCounts = async () => {
      const displayedMakeNames = [
        'Toyota',
        'Honda',
        'Nissan',
        'Mazda',
        'Suzuki',
        'Audi',
        'Daihatsu',
        'Subaru',
        'Hino',
        'Volkswagen',
        'Bmw',
        'Isuzu',
        'Lexus',
        'Mercedes',
        'Mitsubishi',
        'volvo',
        'landrover',
        'Ford',
        'Peugeot',
        'jeep',
        'Citroen',
        'Jaguar',
        'Hyundai',
        'kia',
      ];

      const nextMakeCounts = {};
      const normalizedMakes = Array.isArray(meta?.makes) ? meta.makes : [];

      await Promise.all(
        displayedMakeNames.map(async (name) => {
          const normalizedName = String(name || '').trim().toLowerCase();
          const found = normalizedMakes.find((m) => String(m?.name || '').trim().toLowerCase() === normalizedName);
          if (!found?.id) return;
          try {
            const res = await fetchMakeCount(found.id);
            nextMakeCounts[normalizedName] = Number(res?.count) || 0;
          } catch {
            nextMakeCounts[normalizedName] = nextMakeCounts[normalizedName] ?? 0;
          }
        })
      );

      const displayedBodyStyles = [
        'sedan',
        'coupe',
        'hatchback',
        'suv',
        'pick up',
        'van',
        'mini van',
        'wagon',
        'convertible',
        'bus',
        'truck',
        'heavy equipment',
      ];

      const nextBodyStyleCounts = {};

      await Promise.all(
        displayedBodyStyles.map(async (style) => {
          const normalizedStyle = String(style || '').trim().toLowerCase();
          try {
            const res = await fetchBodyStyleCount(normalizedStyle);
            nextBodyStyleCounts[normalizedStyle] = Number(res?.count) || 0;
          } catch {
            nextBodyStyleCounts[normalizedStyle] = nextBodyStyleCounts[normalizedStyle] ?? 0;
          }
        })
      );

      if (!cancelled) {
        setMakeCounts(nextMakeCounts);
        setBodyStyleCounts(nextBodyStyleCounts);
        setCountsLoading(false);
        // Save to localStorage
        localStorage.setItem('makeCounts', JSON.stringify(nextMakeCounts));
        localStorage.setItem('bodyStyleCounts', JSON.stringify(nextBodyStyleCounts));
      }
    };

    if (!metaLoading && !metaError) {
      loadCounts();
    }

    return () => {
      cancelled = true;
    };
  }, [meta, metaError, metaLoading]);

  useEffect(() => {
    let cancelled = false;

    const loadFeatured = async () => {
      try {
        setFeaturedLoading(true);
        setFeaturedError('');

        const list = await fetchAllFeaturedCars();
        const uiCars = list.map(mapApiCarToUiCar);
        if (!cancelled) setFeaturedCars(uiCars);
      } catch (e) {
        if (!cancelled) setFeaturedError(e?.message || 'Failed to load featured cars');
      } finally {
        if (!cancelled) setFeaturedLoading(false);
      }
    };

    loadFeatured();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">to
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-left">
              <h1>Finding your perfect car <br />
                is easy with us</h1>
              <div className="hero-subtitle">
                <span className="hero-subtitle-bar" aria-hidden="true"></span>
                <span>Over 4000 Latest Cars In Cardealer</span>
              </div>
              <p>CarDealer is a modern and reliable car dealer website showcasing a wide range of quality vehicles. It allows customers to explore detailed car listings, view specifications, and make informed decisions with confidence.</p>
              {/* <div className="hero-cta">
                <span className="hero-cta-text">Want to learn more about us?</span>
                <a className="hero-cta-link" href="/about">
                  Click here
                  <span className="hero-cta-icon" aria-hidden="true"></span>
                </a>
              </div> */}
            </div>

            <form onSubmit={handleSearch}>
              <div className="hero-search-box">
                <h3 className="hero-search-title">Find Your Dream Car</h3>
                <div className="search-grid">
                  <div className="search-field">

                    <SearchableSelect
                      value={makeId}
                      onChange={(v) => {
                        setMakeId(v);
                        setModelId('');
                        setYear('');
                        setMileageRange('');
                      }}
                      options={meta.makes}
                      placeholder="Select Make"
                      disabled={metaLoading}
                      getOptionValue={(m) => m.id}
                      getOptionLabel={(m) => m.name}
                    />
                  </div>
                  <div className="search-field">

                    <SearchableSelect
                      value={modelId}
                      onChange={(v) => {
                        setModelId(v);
                        setYear('');
                        setMileageRange('');
                      }}
                      options={meta.models}
                      placeholder="Select Model"
                      disabled={metaLoading || !makeId}
                      getOptionValue={(m) => m.id}
                      getOptionLabel={(m) => m.name}
                    />
                  </div>
                  <div className="search-field">

                    <SearchableSelect
                      value={year}
                      onChange={(v) => {
                        setYear(v);
                        setMileageRange('');
                      }}
                      options={meta.years.map((y) => ({ value: String(y), label: String(y) }))}
                      placeholder="Select Year"
                      disabled={metaLoading || !modelId}
                      getOptionValue={(o) => o.value}
                      getOptionLabel={(o) => o.label}
                    />
                  </div>
                  <div className="search-field">

                    <SearchableSelect
                      value={mileageRange}
                      onChange={(v) => setMileageRange(v)}
                      options={(meta.mileage_ranges || []).map((r) => ({ value: String(r), label: String(r) }))}
                      placeholder="Select Mileage Range"
                      disabled={metaLoading || !year}
                      getOptionValue={(o) => o.value}
                      getOptionLabel={(o) => o.label}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary search-btn" disabled={metaLoading || !!metaError}>
                    Search Inventory
                  </button>
                </div>
                {metaError ? (
                  <div className="results-count">{metaError}</div>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* For you to choose Section */}
      <section className="section-padding browse-section">
        <div className="container">
          <div className="browse-header-top">
            <h2>For you to choose</h2>
          </div>

          <div className="category-group">
            <h3 className="category-title">Browse by car brand</h3>
            <div className="brand-grid" onClick={handleBrandGridClick}>
              <div className="brand-card" data-make="Toyota" role="button" tabIndex={0}>
                <div className="brand-logo-container">
                  <img src="images/toyota.png" alt="Toyota" />
                </div>
                <div className="brand-info">
                  <span className="brand-name">Toyota</span>
                  <span className="brand-count">{makeCounts.toyota != null ? makeCounts.toyota.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="brand-card" data-make="Honda" role="button" tabIndex={0}>
                <div className="brand-logo-container">
                  <img src="images/honda.png" alt="Honda" />
                </div>
                <div className="brand-info">
                  <span className="brand-name">Honda</span>
                  <span className="brand-count">{makeCounts.honda != null ? makeCounts.honda.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="brand-card" data-make="Nissan" role="button" tabIndex={0}>
                <div className="brand-logo-container">
                  <img src="images/nissani.png" alt="Nissan" />
                </div>
                <div className="brand-info">
                  <span className="brand-name">Nissan</span>
                  <span className="brand-count">{makeCounts.nissan != null ? makeCounts.nissan.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="brand-card" data-make="Mazda" role="button" tabIndex={0}>
                <div className="brand-logo-container">
                  <img src="images/mazda.png" alt="Mazda" />
                </div>
                <div className="brand-info">
                  <span className="brand-name">Mazda</span>
                  <span className="brand-count">{makeCounts.mazda != null ? makeCounts.mazda.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="brand-card" data-make="Suzuki" role="button" tabIndex={0}>
                <div className="brand-logo-container">
                  <img src="images/suzuki.png" alt="Suzuki" />
                </div>
                <div className="brand-info">
                  <span className="brand-name">Suzuki</span>
                  <span className="brand-count">{makeCounts.suzuki != null ? makeCounts.suzuki.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="brand-card" data-make="Audi" role="button" tabIndex={0}>
                <div className="brand-logo-container">
                  <img src="images/audi.png" alt="Audi" />
                </div>
                <div className="brand-info">
                  <span className="brand-name">Audi</span>
                  <span className="brand-count">{makeCounts.audi != null ? makeCounts.audi.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="brand-card" data-make="Daihatsu" role="button" tabIndex={0}>
                <div className="brand-logo-container">
                  <img src="images/daihatsu.png" alt="Daihatsu" />
                </div>
                <div className="brand-info">
                  <span className="brand-name">Daihatsu</span>
                  <span className="brand-count">{makeCounts.daihatsu != null ? makeCounts.daihatsu.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="brand-card" data-make="Subaru" role="button" tabIndex={0}>
                <div className="brand-logo-container">
                  <img src="images/subaru.png" alt="Subaru" />
                </div>
                <div className="brand-info">
                  <span className="brand-name">Subaru</span>
                  <span className="brand-count">{makeCounts.subaru != null ? makeCounts.subaru.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="brand-card" data-make="Hino" role="button" tabIndex={0}>
                <div className="brand-logo-container">
                  <img src="images/hino.png" alt="Hino" />
                </div>
                <div className="brand-info">
                  <span className="brand-name">Hino</span>
                  <span className="brand-count">{makeCounts.hino != null ? makeCounts.hino.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="brand-card" data-make="Volkswagen" role="button" tabIndex={0}>
                <div className="brand-logo-container">
                  <img src="images/volkswagen.png" alt="Volkswagen" />
                </div>
                <div className="brand-info">
                  <span className="brand-name">Volkswagen</span>
                  <span className="brand-count">{makeCounts.volkswagen != null ? makeCounts.volkswagen.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="brand-card" data-make="BMW" role="button" tabIndex={0}>
                <div className="brand-logo-container">
                  <img src="images/bmw.png" alt="Bmw" />
                </div>
                <div className="brand-info">
                  <span className="brand-name">Bmw</span>
                  <span className="brand-count">{makeCounts.bmw != null ? makeCounts.bmw.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="brand-card" data-make="Isuzu" role="button" tabIndex={0}>
                <div className="brand-logo-container">
                  <img src="images/isuzu.png" alt="Isuzu" />
                </div>
                <div className="brand-info">
                  <span className="brand-name">Isuzu</span>
                  <span className="brand-count">{makeCounts.isuzu != null ? makeCounts.isuzu.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="brand-card" data-make="Lexus" role="button" tabIndex={0}>
                <div className="brand-logo-container">
                  <img src="images/lexus.png" alt="Lexus" />
                </div>
                <div className="brand-info">
                  <span className="brand-name">Lexus</span>
                  <span className="brand-count">{makeCounts.lexus != null ? makeCounts.lexus.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="brand-card" data-make="Mercedes-Benz" role="button" tabIndex={0}>
                <div className="brand-logo-container">
                  <img src="images/mercedes.png" alt="Mercedes" />
                </div>
                <div className="brand-info">
                  <span className="brand-name">Mercedes</span>
                  <span className="brand-count">{makeCounts.mercedes != null ? makeCounts.mercedes.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="brand-card" data-make="Mitsubishi" role="button" tabIndex={0}>
                <div className="brand-logo-container">
                  <img src="images/mitsubishi.png" alt="Mitsubishi" />
                </div>
                <div className="brand-info">
                  <span className="brand-name">Mitsubishi</span>
                  <span className="brand-count">{makeCounts.mitsubishi != null ? makeCounts.mitsubishi.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="brand-card" data-make="Volvo" role="button" tabIndex={0}>
                <div className="brand-logo-container">
                  <img src="images/volvo.png" alt="Volvo" />
                </div>
                <div className="brand-info">
                  <span className="brand-name">Volvo</span>
                  <span className="brand-count">{makeCounts.volvo != null ? makeCounts.volvo.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="brand-card" data-make="Land Rover" role="button" tabIndex={0}>
                <div className="brand-logo-container">
                  <img src="images/landrover.png" alt="Land Rover" />
                </div>
                <div className="brand-info">
                  <span className="brand-name">Land Rover</span>
                  <span className="brand-count">{makeCounts.landrover != null ? makeCounts.landrover.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="brand-card" data-make="Ford" role="button" tabIndex={0}>
                <div className="brand-logo-container">
                  <img src="images/ford.png" alt="Ford" />
                </div>
                <div className="brand-info">
                  <span className="brand-name">Ford</span>
                  <span className="brand-count">{makeCounts.ford != null ? makeCounts.ford.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="brand-card" data-make="Peugeot" role="button" tabIndex={0}>
                <div className="brand-logo-container">
                  <img src="images/peugeot.png" alt="Peugeot" />
                </div>
                <div className="brand-info">
                  <span className="brand-name">Peugeot</span>
                  <span className="brand-count">{makeCounts.peugeot != null ? makeCounts.peugeot.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="brand-card" data-make="Jeep" role="button" tabIndex={0}>
                <div className="brand-logo-container">
                  <img src="images/jeep.png" alt="Jeep" />
                </div>
                <div className="brand-info">
                  <span className="brand-name">Jeep</span>
                  <span className="brand-count">{makeCounts.jeep != null ? makeCounts.jeep.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="brand-card" data-make="Citroen" role="button" tabIndex={0}>
                <div className="brand-logo-container">
                  <img src="images/citroen.png" alt="Citroen" />
                </div>
                <div className="brand-info">
                  <span className="brand-name">Citroen</span>
                  <span className="brand-count">{makeCounts.citroen != null ? makeCounts.citroen.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="brand-card" data-make="Jaguar" role="button" tabIndex={0}>
                <div className="brand-logo-container">
                  <img src="images/jaguar.png" alt="Jaguar" />
                </div>
                <div className="brand-info">
                  <span className="brand-name">Jaguar</span>
                  <span className="brand-count">{makeCounts.jaguar != null ? makeCounts.jaguar.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="brand-card" data-make="Hyundai" role="button" tabIndex={0}>
                <div className="brand-logo-container">
                  <img src="images/hyundai.png" alt="Hyundai" />
                </div>
                <div className="brand-info">
                  <span className="brand-name">Hyundai</span>
                  <span className="brand-count">{makeCounts.hyundai != null ? makeCounts.hyundai.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="brand-card" data-make="Kia" role="button" tabIndex={0}>
                <div className="brand-logo-container">
                  <img src="images/kia.png" alt="Kia" />
                </div>
                <div className="brand-info">
                  <span className="brand-name">Kia</span>
                  <span className="brand-count">{makeCounts.kia != null ? makeCounts.kia.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="category-group mt-40">
            <h3 className="category-title">Browse by Body Type</h3>
            <div className="body-type-grid">
              <div className="body-card" onClick={() => goToBodyStyle('sedan')} role="button" tabIndex={0}>
                <div className="body-icon">
                  <img src="images/sedan.png" alt="Sedan" />
                </div>
                <div className="body-info">
                  <span className="body-name">Sedan</span>
                  <span className="body-count">{bodyStyleCounts.sedan != null ? bodyStyleCounts.sedan.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="body-card" onClick={() => goToBodyStyle('coupe')} role="button" tabIndex={0}>
                <div className="body-icon">
                  <img src="images/coupe.png" alt="Coupe" />
                </div>
                <div className="body-info">
                  <span className="body-name">Coupe</span>
                  <span className="body-count">{bodyStyleCounts.coupe != null ? bodyStyleCounts.coupe.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="body-card" onClick={() => goToBodyStyle('hatchback')} role="button" tabIndex={0}>
                <div className="body-icon">
                  <img src="images/hatchback.png" alt="Hatchback" />
                </div>
                <div className="body-info">
                  <span className="body-name">Hatchback</span>
                  <span className="body-count">{bodyStyleCounts.hatchback != null ? bodyStyleCounts.hatchback.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="body-card" onClick={() => goToBodyStyle('suv')} role="button" tabIndex={0}>
                <div className="body-icon">
                  <img src="images/suv.png" alt="SUV" />
                </div>
                <div className="body-info">
                  <span className="body-name">SUV</span>
                  <span className="body-count">{bodyStyleCounts.suv != null ? bodyStyleCounts.suv.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="body-card" onClick={() => goToBodyStyle('pick up')} role="button" tabIndex={0}>
                <div className="body-icon">
                  <img src="images/pickup.png" alt="Pick up" />
                </div>
                <div className="body-info">
                  <span className="body-name">Pick up</span>
                  <span className="body-count">{bodyStyleCounts['pick up'] != null ? bodyStyleCounts['pick up'].toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="body-card" onClick={() => goToBodyStyle('van')} role="button" tabIndex={0}>
                <div className="body-icon">
                  <img src="images/van.png" alt="Van" />
                </div>
                <div className="body-info">
                  <span className="body-name">Van</span>
                  <span className="body-count">{bodyStyleCounts.van != null ? bodyStyleCounts.van.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="body-card" onClick={() => goToBodyStyle('mini van')} role="button" tabIndex={0}>
                <div className="body-icon">
                  <img src="images/minvan.png" alt="Mini Van" />
                </div>
                <div className="body-info">
                  <span className="body-name">Mini Van</span>
                  <span className="body-count">{bodyStyleCounts['mini van'] != null ? bodyStyleCounts['mini van'].toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="body-card" onClick={() => goToBodyStyle('wagon')} role="button" tabIndex={0}>
                <div className="body-icon">
                  <img src="images/wagon.png" alt="Wagon" />
                </div>
                <div className="body-info">
                  <span className="body-name">Wagon</span>
                  <span className="body-count">{bodyStyleCounts.wagon != null ? bodyStyleCounts.wagon.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="body-card" onClick={() => goToBodyStyle('convertible')} role="button" tabIndex={0}>
                <div className="body-icon">
                  <img src="images/convertible.png" alt="Convertible" />
                </div>
                <div className="body-info">
                  <span className="body-name">Convertible</span>
                  <span className="body-count">{bodyStyleCounts.convertible != null ? bodyStyleCounts.convertible.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="body-card" onClick={() => goToBodyStyle('bus')} role="button" tabIndex={0}>
                <div className="body-icon">
                  <img src="images/bus.png" alt="Bus" />
                </div>
                <div className="body-info">
                  <span className="body-name">Bus</span>
                  <span className="body-count">{bodyStyleCounts.bus != null ? bodyStyleCounts.bus.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="body-card" onClick={() => goToBodyStyle('truck')} role="button" tabIndex={0}>
                <div className="body-icon">
                  <img src="images/truck.png" alt="Truck" />
                </div>
                <div className="body-info">
                  <span className="body-name">Truck</span>
                  <span className="body-count">{bodyStyleCounts.truck != null ? bodyStyleCounts.truck.toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
              <div className="body-card" onClick={() => goToBodyStyle('heavy equipment')} role="button" tabIndex={0}>
                <div className="body-icon">
                  <img src="images/heavy.png" alt="Heavy Equipment" />
                </div>
                <div className="body-info">
                  <span className="body-name">Heavy Equipment</span>
                  <span className="body-count">{bodyStyleCounts['heavy equipment'] != null ? bodyStyleCounts['heavy equipment'].toLocaleString() : (countsLoading ? '' : '0')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Inventory */}
      <section className="section-padding-featured">
        <div className="container">
          <SectionTitle
            subtitle="Check out our"
            title="Featured Inventory"
          />
          <div className="car-grid">
            {featuredLoading && (
              <Spinner />
            )}
            {!featuredLoading && featuredError && (
              <div className="results-count">{featuredError}</div>
            )}
            {!featuredLoading && !featuredError && featuredCars.slice(0, 8).map((car) => (
              <CarCard key={car.uuid || car.id} car={car} />
            ))}
          </div>
          {/* <div className="text-center mt-50">
            <button className="btn btn-primary">View All Inventory</button>
          </div> */}
        </div>
      </section>


      {/* Counter Section */}
      <section className="counter-section">
        <div className="container">
          <div className="counter-grid">
            <div className="counter-item">
              <div className="counter-label">Vehicles In Stock</div>
              <div className="counter-flex">
                <div className="counter-icon"><Car size={40} /></div>
                <div className="counter-number">
                  <AnimatedCounter end="561" />
                </div>
              </div>
            </div>
            <div className="counter-item">
              <div className="counter-label">Dealer Reviews</div>
              <div className="counter-flex">
                <div className="counter-icon"><MessageSquare size={40} /></div>
                <div className="counter-number">
                  <AnimatedCounter end="856" />
                </div>
              </div>
            </div>
            <div className="counter-item">
              <div className="counter-label">Happy Customers</div>
              <div className="counter-flex">
                <div className="counter-icon"><UserCheck size={40} /></div>
                <div className="counter-number">
                  <AnimatedCounter end="789" />
                </div>
              </div>
            </div>
            <div className="counter-item">
              <div className="counter-label">Awards</div>
              <div className="counter-flex">
                <div className="counter-icon"><Trophy size={40} /></div>
                <div className="counter-number">
                  <AnimatedCounter end="356" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-light">
        <div className="container">
          <SectionTitle
            subtitle="What we do"
            title="Our Best Services"
          />
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <img src="/images/sales.png" alt="Car Sales" />
              </div>
              <h3>Car Sales</h3>
              <p>We provide various types of cars with high quality and competitive prices.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <img src="/images/mechanic.png" alt="Car Maintenance" />
              </div>
              <h3>Car Maintenance</h3>
              <p>Professional mechanics to keep your car in top condition for your safety.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <img src="/images/money.png" alt="Car Financing" />
              </div>
              <h3>Car Financing</h3>
              <p>Easy and fast financing options with low interest rates for your convenience.</p>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Home;
