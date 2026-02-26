import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import CarDetail from './pages/CarDetail';
import Favorites from './pages/Favorites';
import About from './pages/About';
import Services from './pages/Services';
import Team from './pages/Team';
import Contact from './pages/Contact';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import './styles/global.css';

function AppLayout() {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/signin' || location.pathname === '/signup';

  return (
    <div className="app">
      <ScrollToTop />
      {!isAuthRoute ? <Navbar /> : null}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventory/body-style/:bodyStyle" element={<Inventory />} />
          <Route path="/inventory/make/:makeId" element={<Inventory />} />
          <Route path="/inventory/:uuid" element={<CarDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          {/* Fallback for other pages for now */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      {!isAuthRoute ? <Footer /> : null}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
