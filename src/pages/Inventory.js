import React, { useEffect, useState } from 'react';
import { Search, Grid, List as ListIcon, Inbox } from 'lucide-react';
import { useParams, useSearchParams } from 'react-router-dom';
import CarCard from '../components/CarCard';
import { fetchCarsUiPage } from '../api/cars';
import Spinner from '../components/Spinner';
import '../styles/Inventory.css';

const Inventory = () => {
  const { bodyStyle: routeBodyStyle, makeId: routeMakeId } = useParams();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(50000000);
  const [condition, setCondition] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [makeId, setMakeId] = useState('');
  const [modelId, setModelId] = useState('');
  const [year, setYear] = useState('');
  const [bodyStyle, setBodyStyle] = useState('');
  const [viewMode, setViewMode] = useState(localStorage.getItem('inventory_view_mode') || 'grid');
  const [cars, setCars] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('inventory_view_mode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    const nextMakeId = searchParams.get('make_id') || '';
    const nextModelId = searchParams.get('model_id') || '';
    const nextYear = searchParams.get('year') || '';
    const nextBodyStyle = searchParams.get('body_style') || '';
    const nextPerPageRaw = searchParams.get('per_page');
    const nextPageRaw = searchParams.get('page');

    setMakeId(nextMakeId);
    setModelId(nextModelId);
    setYear(nextYear);
    setBodyStyle(nextBodyStyle);
    if (nextPerPageRaw) setPerPage(Number(nextPerPageRaw) || 10);
    if (nextPageRaw) setPage(Number(nextPageRaw) || 1);
  }, [searchParams]);

  useEffect(() => {
    if (routeMakeId) setMakeId(String(routeMakeId));
    if (routeBodyStyle) setBodyStyle(String(routeBodyStyle));
    setPage(1);
  }, [routeMakeId, routeBodyStyle]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const effectiveMakeId = routeMakeId ? String(routeMakeId) : makeId;
        const effectiveBodyStyle = routeBodyStyle ? String(routeBodyStyle) : bodyStyle;

        const res = await fetchCarsUiPage({
          q: query,
          min_price: 0,
          max_price: maxPrice,
          condition: condition || undefined,
          sort,
          page,
          per_page: perPage,
          make_id: effectiveMakeId || undefined,
          model_id: modelId || undefined,
          year: year || undefined,
          body_style: effectiveBodyStyle || undefined,
        });

        let sortedCars = [...res.data];
        if (sort === 'price_asc') {
          sortedCars.sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (sort === 'price_desc') {
          sortedCars.sort((a, b) => (b.price || 0) - (a.price || 0));
        } else if (sort === 'mileage_asc') {
          sortedCars.sort((a, b) => {
            const aMileage = parseInt((a.mileage || '').replace(/[^\d]/g, '')) || 0;
            const bMileage = parseInt((b.mileage || '').replace(/[^\d]/g, '')) || 0;
            return aMileage - bMileage;
          });
        } else if (sort === 'newest') {
          sortedCars.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        }

        if (!cancelled) {
          setCars(sortedCars);
          setMeta(res.meta);
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load cars');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [
    query,
    maxPrice,
    condition,
    sort,
    page,
    perPage,
    makeId,
    modelId,
    year,
    bodyStyle,
    routeBodyStyle,
    routeMakeId,
  ]);

  const totalPages = meta?.last_page || 1;
  const totalProducts = meta?.total != null ? Number(meta.total) : cars.length;
  const shouldShowPagination = totalProducts >= 20 && totalPages > 1;

  return (
    <div className="inventory-page">
      <div className="detail-header-bg">
      </div>

      <div className="section-padding">
        <div className="container">
          <div className="inventory-wrapper">
            {/* Sidebar Filters */}
            <aside className="inventory-sidebar">
              <div className="sidebar-item search-box">
                <h3 className="sidebar-title">Cars Search</h3>
                <div className="search-input-wrapper">
                  <input
                    type="text"
                    placeholder="Search vehicles..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setPage(1);
                    }}
                  />
                  <Search size={20} className="search-icon" />
                </div>
              </div>

              <div className="sidebar-item">
                <h3 className="sidebar-title">Filter By Price</h3>
                <div className="price-range-slider">
                  <input
                    type="range"
                    min="0"
                    max="500000000"
                    step="500000"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(Number(e.target.value));
                      setPage(1);
                    }}
                    className="price-slider"
                  />
                  <div className="price-labels">
                    <span>Tsh 0</span>
                    <span>Tsh {Number(maxPrice).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="sidebar-item">
                <h3 className="sidebar-title">Condition</h3>
                <div className="checkbox-list">
                  <label>
                    <input
                      type="checkbox"
                      checked={condition === 'new'}
                      onChange={() => {
                        setCondition((prev) => (prev === 'new' ? '' : 'new'));
                        setPage(1);
                      }}
                    />
                    New
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={condition === 'used'}
                      onChange={() => {
                        setCondition((prev) => (prev === 'used' ? '' : 'used'));
                        setPage(1);
                      }}
                    />
                    Used
                  </label>
                </div>
              </div>


            </aside>

            {/* Main Content */}
            <main className="inventory-main">
              <div className="inventory-controls">
                <div className="results-count">
                  Home / Inventory
                </div>
                <div className="view-options">
                  <div className="sort-by">
                    <select
                      value={sort}
                      onChange={(e) => {
                        setSort(e.target.value);
                        setPage(1);
                      }}
                    >
                      <option value="newest">Sort by: Newest</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="mileage_asc">Mileage: Low to High</option>
                    </select>
                  </div>
                  <div className="view-toggles">
                    <button
                      className={viewMode === 'grid' ? 'active' : ''}
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid size={20} />
                    </button>
                    <button
                      className={viewMode === 'list' ? 'active' : ''}
                      onClick={() => setViewMode('list')}
                    >
                      <ListIcon size={20} />
                    </button>
                  </div>
                </div>
              </div>

              <div className={`car-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                {loading && (
                  <div style={{ gridColumn: '5 / -5' }}>
                    <Spinner />
                  </div>
                )}
                {!loading && error && (
                  <div className="results-count">{error}</div>
                )}
                {!loading && !error && cars.length === 0 && (
                  <div
                    className="results-count"
                    style={{
                      gridColumn: '1 / -1',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 8,
                      padding: '140px 0',
                    }}
                  >
                    <Inbox size={18} />
                    <span>No data available</span>
                  </div>
                )}
                {!loading && !error && cars.map((car) => (
                  <CarCard key={car.uuid || car.id} car={car} viewMode={viewMode} />
                ))}
              </div>

              {shouldShowPagination ? (
                <div className="pagination">
                  <button
                    className="page-btn"
                    disabled={page <= 1 || loading}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      className={`page-btn ${p === page ? 'active' : ''}`}
                      disabled={loading}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    className="page-btn"
                    disabled={page >= totalPages || loading}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </button>
                </div>
              ) : null}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
