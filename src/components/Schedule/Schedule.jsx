import { motion } from 'framer-motion';
import './Schedule.css';

const SCHEDULE = [
  {
    time: '11:30',
    title: 'Convocatoria',
    description: 'Llegada de los invitados.',
    note: 'La ceremonia comenzará puntualmente a las 12:00.',
    featured: false,
  },
  {
    time: '12:00',
    title: 'Ceremonia',
    description: 'Nuestro «sí, quiero».',
    featured: true,
  },
  {
    time: '13:00',
    title: 'Aperitivo',
    description: 'Un rato para brindar, comer algo y celebrar juntos.',
    featured: false,
  },
  {
    time: '14:30',
    title: 'Banquete & Pastel',
    description: 'Comida, brindis y, por supuesto, tarta.',
    featured: false,
  },
  {
    time: '17:00',
    title: 'Baile & Barra libre',
    description: 'Empieza la fiesta.',
    featured: false,
  },
  {
    time: '19:00',
    title: 'After Party',
    description: 'Para quienes todavía tengan ganas… nos vemos en el Mint Bar.',
    featured: true,
  },
];

const Schedule = () => {
  return (
    <section id="schedule" className="schedule">
      <div className="container">
        <motion.div
          className="schedule-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="schedule-label">EL GRAN DÍA</p>
          <h2 className="schedule-title">10.10.2026</h2>
        </motion.div>

        <div className="timeline-wrapper">
          <div className="timeline-track">
            {SCHEDULE.map((item, index) => (
              <motion.div
                key={item.time}
                className={`timeline-item${item.featured ? ' featured' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <div className="timeline-dot" />
                <div className="timeline-card">
                  <p className="timeline-time">{item.time}</p>
                  <h3 className="timeline-event-title">{item.title}</h3>
                  <p className="timeline-desc">{item.description}</p>
                  {item.note && <p className="timeline-note">{item.note}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Schedule;

