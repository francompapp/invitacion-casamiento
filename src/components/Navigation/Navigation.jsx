import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Navigation.css';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <motion.nav
      className={`navigation ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container nav-container">
        <div className="nav-logo">
          <h2>Laura & Franco</h2>
        </div>

        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li><a onClick={() => scrollToSection('hero')}>Inicio</a></li>
          <li><a onClick={() => scrollToSection('schedule')}>El día</a></li>
          <li><a onClick={() => scrollToSection('location')}>Ubicación</a></li>
          <li><a onClick={() => scrollToSection('dresscode')}>Dress Code</a></li>
          <li><a onClick={() => scrollToSection('gifts')}>Regalos</a></li>
          <li><a onClick={() => scrollToSection('afterparty')}>After Party</a></li>
          <li>
            <a
              onClick={() => scrollToSection('rsvp')}
              className="nav-cta"
            >
              Confirmar asistencia
            </a>
          </li>
        </ul>
      </div>
    </motion.nav>
  );
};

export default Navigation;
