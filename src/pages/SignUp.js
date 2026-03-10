import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../api/cars';
import '../styles/Auth.css';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    const n = String(name || '').trim();
    const e = String(email || '').trim();
    const p = String(password || '');
    return n.length > 0 && e.length > 0 && p.length > 0;
  }, [name, email, password]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedName = String(name || '').trim();
    const trimmedEmail = String(email || '').trim();
    const trimmedPassword = String(password || '');

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      setError('Please fill in your name, email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await register({ name: trimmedName, email: trimmedEmail, password: trimmedPassword });
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      window.location.href = '/';
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'Please check your connection and try again.' : (err.message || 'Registration failed. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-visual" aria-hidden="true">
        <div className="auth-visual-overlay" />
        <div className="auth-visual-content">
          <div className="auth-visual-title">Journey Beyond</div>
          <div className="auth-visual-subtitle">Explore the new Cars.</div>
          <div className="auth-visual-cta">
            <Link to="/inventory" className="auth-visual-btn">
              Explore
            </Link>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-panel-inner">
          <h1 className="auth-heading">PLEASE SIGN UP</h1>

          {error ? <div className="auth-alert">{error}</div> : null}

          <form className="auth-form" onSubmit={onSubmit}>
            <label className="auth-field">
              <span className="auth-label">Name</span>
              <input
                className="auth-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                autoComplete="name"
              />
            </label>

            <label className="auth-field">
              <span className="auth-label">Email</span>
              <input
                className="auth-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                autoComplete="email"
              />
            </label>

            <label className="auth-field">
              <span className="auth-label">Password</span>
              <input
                className="auth-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="new-password"
              />
            </label>

            <button className="auth-submit" type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? 'CREATING ACCOUNT…' : 'SIGN UP'}
            </button>

            {/* <button className="auth-google" type="button">
              <span className="auth-google-icon" aria-hidden="true">G</span>
              <span>CONTINUE WITH GOOGLE</span>
            </button> */}

            <div className="auth-footer">
              <Link className="auth-footer-link" to="/signin">
                Log in
              </Link>
              <span className="auth-footer-divider" aria-hidden="true" />
              <span className="auth-footer-right">Cardealer</span>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default SignUp;
