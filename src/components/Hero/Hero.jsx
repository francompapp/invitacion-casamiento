import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero = ({ guestGroup }) => {
  const weddingDate = new Date('2026-10-10T12:00:00');

  const guestNames = guestGroup?.guests?.map((g) => g.name).join(' y ') || '';

  return (
    <section id="hero" className="hero">
      <div className="hero-bg-overlay"></div>
      <div className="container hero-content">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {guestNames && (
            <motion.div
              className="guest-greeting"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              ¡Hola, {guestNames}!
            </motion.div>
          )}

          <div className="hero-countdown">
            <CountdownTimer targetDate={weddingDate} />
          </div>

          <div className="hero-names">
            <span className="name">Laura</span>
            <span className="ampersand">&</span>
            <span className="name">Franco</span>
          </div>

          <p className="hero-date">10.10.2026</p>

          <p className="hero-welcome">
            Queda muy poco para darnos el «sí, quiero».
          </p>
          <p className="hero-welcome-sub">
            Para que podáis disfrutar del día al máximo, os dejamos toda la
            información que queremos que tengáis en cuenta.
          </p>

          <a
            className="hero-location hero-location-link"
            href="https://maps.app.goo.gl/HSy3NDDTRtBeFLoL6"
            target="_blank"
            rel="noopener noreferrer"
          >
            📍 Xalet de Montjuïc · Barcelona
          </a>

          <div className="hero-actions">
            <button
              className="hero-btn primary"
              onClick={() => document.getElementById('rsvp').scrollIntoView({ behavior: 'smooth' })}
            >
              Confirmar asistencia
            </button>
          </div>
        </motion.div>
      </div>

      <div className="hero-scroll-indicator">
        <div className="scroll-arrow"></div>
      </div>
    </section>
  );
};

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +targetDate - +new Date();
    if (difference > 0) {
      return {
        dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((difference / 1000 / 60) % 60),
        segundos: Math.floor((difference / 1000) % 60),
      };
    }
    return { dias: 0, horas: 0, minutos: 0, segundos: 0 };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown">
      {Object.entries(timeLeft).map(([key, val]) => (
        <div className="countdown-item" key={key}>
          <span className="countdown-value">{String(val).padStart(2, '0')}</span>
          <span className="countdown-label">{key}</span>
        </div>
      ))}
    </div>
  );
};

export default Hero;
