import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Location.css';

const Location = () => {
  const [transportOpen, setTransportOpen] = useState(false);

  return (
    <section id="location" className="location">
      <div className="container">
        <motion.div
          className="location-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="section-label">UBICACIÓN</p>
          <h2 className="location-title">El gran día</h2>
        </motion.div>

        <motion.div
          className="location-main"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="location-venue">
            <h3 className="venue-name">Xalet de Montjuïc</h3>
            <p className="venue-address">
              Avinguda Miramar, 31<br />
              Barcelona
            </p>
            <a
              href="https://maps.app.goo.gl/HSy3NDDTRtBeFLoL6"
              target="_blank"
              rel="noopener noreferrer"
              className="location-directions-btn"
            >
              Cómo llegar
            </a>
          </div>

          <button
            className={`transport-toggle ${transportOpen ? 'open' : ''}`}
            onClick={() => setTransportOpen(!transportOpen)}
            aria-expanded={transportOpen}
          >
            <span>Transporte</span>
            <span className="toggle-chevron">{transportOpen ? '−' : '+'}</span>
          </button>

          <AnimatePresence>
            {transportOpen && (
              <motion.div
                className="transport-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35 }}
              >
                <div className="transport-options">
                  <div className="transport-option">
                    <span className="transport-icon">🚇</span>
                    <div>
                      <strong>Funicular de Montjuïc</strong>
                      <p>
                        Metro L2 o L3 hasta <strong>Paral·lel</strong> → Funicular
                        hasta <strong>Parc de Montjuïc</strong> → ~10 min caminando
                      </p>
                    </div>
                  </div>
                  <div className="transport-option">
                    <span className="transport-icon">🚌</span>
                    <div>
                      <strong>Bus 55</strong>
                      <p>
                        Sale desde Passeig de Gràcia y tiene parada en
                        Avinguda Miramar, muy cerca del Xalet.
                      </p>
                    </div>
                  </div>
                  <div className="transport-option highlight">
                    <span className="transport-icon">🚕</span>
                    <div>
                      <strong>Taxi · Cabify · Uber</strong>
                      <p>
                        La opción más cómoda desde el centro de Barcelona.
                        Aproximadamente 15 minutos.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Location;
