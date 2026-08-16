import { useState } from 'react';
import { motion } from 'framer-motion';
import './OurStory.css';

const OurStory = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Placeholder images - replace with actual story photos
  const storySlides = [
    {
      image: 'https://via.placeholder.com/800x600/d4af37/ffffff?text=Primer+Encuentro',
      title: 'Nuestro Primer Encuentro',
      description: 'Todo comenzó en... [Agrega tu historia aquí]',
      date: 'Enero 2020'
    },
    {
      image: 'https://via.placeholder.com/800x600/8b7355/ffffff?text=Primera+Cita',
      title: 'La Primera Cita',
      description: 'Fue en... [Agrega tu historia aquí]',
      date: 'Marzo 2020'
    },
    {
      image: 'https://via.placeholder.com/800x600/d4af37/ffffff?text=Viaje+Especial',
      title: 'Nuestro Primer Viaje',
      description: 'Viajamos a... [Agrega tu historia aquí]',
      date: 'Julio 2021'
    },
    {
      image: 'https://via.placeholder.com/800x600/8b7355/ffffff?text=La+Propuesta',
      title: 'La Propuesta',
      description: 'El momento mágico cuando... [Agrega tu historia aquí]',
      date: 'Diciembre 2024'
    },
    {
      image: 'https://via.placeholder.com/800x600/d4af37/ffffff?text=La+Boda',
      title: '¡Nos Casamos!',
      description: 'Y ahora queremos compartir este día especial con ustedes',
      date: 'Diciembre 2026'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % storySlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + storySlides.length) % storySlides.length);
  };

  return (
    <section id="story" className="our-story">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Nuestra Historia</h2>
          <p className="section-subtitle">El camino que nos trajo hasta aquí</p>
        </motion.div>

        <div className="story-gallery">
          <button className="gallery-btn prev" onClick={prevSlide} aria-label="Anterior">
            ‹
          </button>

          <motion.div
            key={currentSlide}
            className="story-slide"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <div className="slide-image">
              <img src={storySlides[currentSlide].image} alt={storySlides[currentSlide].title} />
              <div className="slide-overlay"></div>
            </div>
            <div className="slide-content">
              <span className="slide-date">{storySlides[currentSlide].date}</span>
              <h3 className="slide-title">{storySlides[currentSlide].title}</h3>
              <p className="slide-description">{storySlides[currentSlide].description}</p>
            </div>
          </motion.div>

          <button className="gallery-btn next" onClick={nextSlide} aria-label="Siguiente">
            ›
          </button>
        </div>

        <div className="gallery-dots">
          {storySlides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Ir a la diapositiva ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurStory;
