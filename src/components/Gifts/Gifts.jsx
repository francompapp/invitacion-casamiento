import { useState } from 'react';
import { motion } from 'framer-motion';
import './Gifts.css';

const IBAN = 'ES98 1583 0001 1091 5143 5575';
const BENEFICIARIO = 'F Papp & L De la Rosa Saiz';

const Gifts = () => {
  const [copiedIBAN, setCopiedIBAN] = useState(false);

  const copyIBAN = () => {
    navigator.clipboard.writeText(IBAN.replace(/\s/g, '')).then(() => {
      setCopiedIBAN(true);
      setTimeout(() => setCopiedIBAN(false), 2500);
    });
  };

  return (
    <section id="gifts" className="gifts">
      <div className="container">
        <motion.div
          className="gifts-inner"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="section-label">UN PEQUEÑO DETALLE</p>
          <h2 className="gifts-title">El regalo</h2>

          <p className="gifts-intro">
            Si queréis acompañarnos también en este nuevo capítulo, tendremos
            una hucha en el restaurante para quienes quieran hacernos un regalo
            en efectivo el día de la boda.
          </p>

          <div className="gifts-divider" />

          <p className="gifts-transfer-title">Si preferís hacerlo por transferencia o Bizum:</p>

          <div className="iban-card">
            <div className="iban-row">
              <p className="iban-label">IBAN</p>
              <p className="iban-number">{IBAN}</p>
              <p className="iban-beneficiary">{BENEFICIARIO}</p>
              <button
                className={`iban-copy-btn${copiedIBAN ? ' copied' : ''}`}
                onClick={copyIBAN}
              >
                {copiedIBAN ? '✓ Copiado' : 'Copiar IBAN'}
              </button>
            </div>

            <div className="gifts-sep" />

            <div className="bizum-row">
              <p className="iban-label">Bizum</p>
              <div className="bizum-numbers">
                <span>Lau: 626 805 322</span>
                <span>Franco: 650 899 414</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Gifts;


