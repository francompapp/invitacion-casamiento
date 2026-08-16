import { motion } from 'framer-motion';
import './DressCode.css';

const DressCode = () => {
  return (
    <section id="dresscode" className="dresscode">
      <div className="container">
        <motion.div
          className="dresscode-inner"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="dresscode-label">DRESS CODE</p>
          <h2 className="dresscode-title">Elegante</h2>
          <p className="dresscode-main">Elegante, pero disfrutando.</p>
          <p className="dresscode-note">
            La celebración tendrá una parte al aire libre y otra en interior.
            Estaremos en Barcelona en octubre, así que os recomendamos traer algo
            para abrigarse si refresca durante la tarde o la noche.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default DressCode;
