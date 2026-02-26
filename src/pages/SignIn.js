import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/cars';
import '../styles/Auth.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    const e = String(email || '').trim();
    const p = String(password || '');
    return e.length > 0 && p.length > 0;
  }, [email, password]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = String(email || '').trim();
    const trimmedPassword = String(password || '');

    if (!trimmedEmail || !trimmedPassword) {
      setError('Please fill in your email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await login({ email: trimmedEmail, password: trimmedPassword });
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      window.location.href = '/';
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
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
          <div className="auth-visual-subtitle">Explore the new Cars</div>
          <div className="auth-visual-cta">
            <Link to="/inventory" className="auth-visual-btn">
              Explore
            </Link>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-panel-inner">
          <h1 className="auth-heading">PLEASE LOG IN</h1>

          {error ? <div className="auth-alert">{error}</div> : null}

          <form className="auth-form" onSubmit={onSubmit}>
            <label className="auth-field">
              <span className="auth-label">Email</span>
              <input
                className="auth-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="John Doe"
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
                autoComplete="current-password"
              />
            </label>

            <button className="auth-submit" type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? 'LOGGING IN…' : 'LOG IN'}
            </button>

            {/* <button className="auth-google" type="button">
              <span className="auth-google-icon" aria-hidden="true">G</span>
              <span>CONTINUE WITH GOOGLE</span>
            </button> */}

            <div className="auth-footer">
              <Link className="auth-footer-link" to="/signup">
                Sign up
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

export default SignIn;
