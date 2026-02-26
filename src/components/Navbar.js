import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, PhoneCall, Mail, User, LogOut, Heart } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const location = useLocation();
  const isDetailRoute = /^\/inventory\/[^/]+$/.test(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('auth_user');
    if (token && user) {
      try {
        setAuthUser(JSON.parse(user));
      } catch {
        setAuthUser(null);
      }
    } else {
      setAuthUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setAuthUser(null);
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Inventory', path: '/inventory' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Team', path: '/team' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''} ${isMobileMenuOpen ? 'menu-open' : ''}`}>
      {!isDetailRoute ? (
        <div className="topbar">
          <div className="container">
            <div className="topbar-inner">
              <a className="topbar-item" href="mailto:info@cardealer.com">
                <span className="topbar-icon" aria-hidden="true">
                  <Mail size={16} />
                </span>
                <span className="topbar-text">info@cardealer.com</span>
              </a>
              <a className="topbar-item" href="tel:+1255765635635">
                <span className="topbar-icon" aria-hidden="true">
                  <PhoneCall size={16} />
                </span>
                <span className="topbar-text">(255) 765 635 635</span>
              </a>
            </div>
          </div>
        </div>
      ) : null}
      <nav className="navbar">
        <div className="container">
          <div className="navbar-wrapper">
            <Link to="/" className="logo">
              CAR<span>DEALER</span>
            </Link>

            <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={location.pathname === link.path ? 'active' : ''}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="navbar-right">
              <Link to="/favorites" className="navbar-fav-btn" title="Favorites" aria-label="Favorites">
                <span className="navbar-user-icon-wrap" aria-hidden="true">
                  <Heart size={16} className="navbar-user-icon" />
                </span>
                <span className="navbar-user-name">Favorites</span>
              </Link>
              {authUser ? (
                <div className="navbar-user">
                  <span className="navbar-user-icon-wrap" aria-hidden="true">
                    <User size={16} className="navbar-user-icon" />
                  </span>
                  <span className="navbar-user-name">{authUser.name.split(' ')[0]}</span>
                  <button onClick={handleLogout} className="navbar-logout-btn" title="Logout" aria-label="Logout">
                    <LogOut size={16} />
                  </button>
                  <button type="button" onClick={handleLogout} className="navbar-logout-text" aria-label="Logout">
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/signin" className="navbar-user">
                  <span className="navbar-user-icon-wrap" aria-hidden="true">
                    <User size={16} className="navbar-user-icon" />
                  </span>
                  <span className="navbar-user-name">Login / Sign Up</span>
                </Link>
              )}
              {/* <div className="navbar-contact">
                <span className="navbar-contact-icon" aria-hidden="true">
                  <PhoneCall size={22} />
                </span>
                <div className="navbar-contact-text">
                  <div className="navbar-contact-label">Have any Questions?</div>
                  <div className="navbar-contact-phone">(255) 765 635 635</div>
                </div>
              </div> */}

              {/* <button className="search-toggle"><Search size={20} /></button> */}
              <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
