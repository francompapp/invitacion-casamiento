import { motion } from 'framer-motion';
import './AfterParty.css';

const AfterParty = () => {
  return (
    <section id="afterparty" className="afterparty">
      <div className="container">
        <motion.div
          className="afterparty-inner"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="afterparty-time">19:00</p>
          <h2 className="afterparty-title">After Party</h2>
          <p className="afterparty-venue">Mint Bar</p>
          <p className="afterparty-address">Passeig d'Isabel II, 4 · Barcelona</p>

          <p className="afterparty-desc">
            Para quienes todavía tengan ganas de fiesta…<br />
            Cuando termine la boda, seguimos la celebración en el Mint Bar.
          </p>

          <p className="afterparty-highlight">
            La primera copa la invitamos nosotros. 🥂
          </p>

          <div className="afterparty-travel">
            <div className="travel-item">
              <span className="travel-icon">🚌</span>
              <span>~30 min en transporte público desde el Xalet</span>
            </div>
            <div className="travel-item">
              <span className="travel-icon">🚶</span>
              <span>~35 min caminando</span>
            </div>
          </div>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Passeig+d%27Isabel+II+4+Barcelona"
            target="_blank"
            rel="noopener noreferrer"
            className="afterparty-btn"
          >
            Cómo llegar
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default AfterParty;
