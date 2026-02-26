import React, { useEffect, useState } from 'react';
import { Grid, List as ListIcon, Inbox } from 'lucide-react';
import CarCard from '../components/CarCard';
import Spinner from '../components/Spinner';
import { fetchFavorites, mapApiCarToUiCar } from '../api/cars';
import '../styles/Inventory.css';

const Favorites = () => {
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [viewMode, setViewMode] = useState(localStorage.getItem('favorites_view_mode') || 'list');
  const [cars, setCars] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('favorites_view_mode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetchFavorites({ page, per_page: perPage });
        const favorites = Array.isArray(res?.data) ? res.data : [];
        const favoriteCars = favorites.map((f) => (f?.car ? mapApiCarToUiCar(f.car) : null)).filter(Boolean);

        if (!cancelled) {
          setCars(favoriteCars);
          setMeta(res?.meta || null);
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load favorites');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [page, perPage]);

  const totalPages = meta?.last_page || 1;
  const totalProducts = meta?.total != null ? Number(meta.total) : cars.length;
  const shouldShowPagination = totalProducts >= 20 && totalPages > 1;

  return (
    <div className="inventory-page">
   <div className="detail-header-bg">
      </div>

      <div className="section-padding">
        <div className="container">
          <div className="inventory-wrapper" style={{ gridTemplateColumns: '1fr' }}>
            <main className="inventory-main">
              <div className="inventory-controls">
                <div className="results-count">Home / Favorites</div>
                <div className="view-options">
                  <div className="view-toggles">
                    <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>
                      <Grid size={20} />
                    </button>
                    <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>
                      <ListIcon size={20} />
                    </button>
                  </div>
                </div>
              </div>

              <div className={`car-grid favorites-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                {loading && (
                  <div style={{ gridColumn: '5 / -5' }}>
                    <Spinner />
                  </div>
                )}
                {!loading && error && <div className="results-count">{error}</div>}
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
                    <span>No favorites yet</span>
                  </div>
                )}
                {!loading && !error && cars.map((car) => <CarCard key={car.uuid || car.id} car={car} viewMode={viewMode} />)}
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

export default Favorites;
