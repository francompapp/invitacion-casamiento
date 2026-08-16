import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PracticalInfo.css';

const INFO_ITEMS = [
  { label: 'Fecha',              value: '10 de octubre de 2026' },
  { label: 'Convocatoria',       value: '11:30' },
  { label: 'Inicio ceremonia',   value: '12:00 puntual' },
  { label: 'Lugar',              value: 'Xalet de Montjuïc\nAvinguda Miramar, 31\nBarcelona' },
  { label: 'After party',        value: 'Mint Bar\nPasseig d\'Isabel II, 4\nBarcelona' },
  { label: 'RSVP antes del',     value: '10 de septiembre de 2026' },
];

const PracticalInfo = () => {
  const [open, setOpen] = useState(false);

  return (
    <section id="practical" className="practical">
      <div className="container">
        <motion.div
          className="practical-inner"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <button
            className={`practical-toggle ${open ? 'open' : ''}`}
            onClick={() => setOpen(!open)}
            aria-expanded={open}
          >
            <span>Información práctica</span>
            <span className="practical-icon">{open ? '−' : '+'}</span>
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                className="practical-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35 }}
              >
                {INFO_ITEMS.map((item) => {
                  const lines = item.value.split('\n');
                  return (
                    <div key={item.label} className="practical-row">
                      <span className="practical-label">{item.label}</span>
                      <span className="practical-value">
                        {lines.map((line, i) => (
                          <span key={i}>
                            {line}
                            {i < lines.length - 1 && <br />}
                          </span>
                        ))}
                      </span>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default PracticalInfo;
