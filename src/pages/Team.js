import React, { useEffect, useState } from 'react';
import SectionTitle from '../components/SectionTitle';
import Spinner from '../components/Spinner';
import { API_BASE_URL } from '../constants';
import { fetchTeamMembers } from '../api/cars';
import '../styles/SecondaryPages.css';

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetchTeamMembers({ per_page: 50 });
        const data = Array.isArray(res?.data) ? res.data : [];
        if (!cancelled) {
          setMembers(data);
        }
      } catch (e) {
        if (!cancelled) {
          setError('Please check your connection and try again.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const resolveTeamImageUrl = (member) => {
    if (member?.image_url) return member.image_url;
    if (member?.image) return `${API_BASE_URL}/storage/${member.image}`;
    return '';
  };

  return (
    <div className="secondary-page team-page">
      <div className="detail-header-bg">
      </div>

      <section className="section-padding">
        <div className="container">
          <SectionTitle
            subtitle="The Professionals"
            title="Meet Our Dedicated Team"
          />
          {loading ? (
            <Spinner />
          ) : null}
          {!loading && error ? (
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
          ) : null}
          <div className="team-grid">
            {!loading && !error && members.map((member) => (
              <div key={member.id} className="team-card">
                <div className="team-image">
                  <img src={resolveTeamImageUrl(member)} alt={member.name} />
                </div>
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;
