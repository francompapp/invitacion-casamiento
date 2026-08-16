import { useState } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './SongRequest.css';

const SongRequest = ({ guestGroup }) => {
  const [song, setSong] = useState('');
  const [artist, setArtist] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!song.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'songRequests'), {
        token: guestGroup?.token || '',
        guestName: guestGroup?.principalName || '',
        song: song.trim(),
        artist: artist.trim(),
        createdAt: new Date(),
      });
      setSubmitted(true);
      setMessage(`¡Genial! "${song}" estará en nuestra playlist 🎶`);
    } catch (error) {
      setMessage('Hubo un error. Por favor, intentá nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="song" className="song-request">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Tu Canción</h2>
          <p className="section-subtitle">¿Qué canción no puede faltar ese día?</p>
        </motion.div>

        <motion.div
          className="song-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="song-visual">
            <div className="music-note">🎵</div>
            <div className="music-note delay-1">🎶</div>
            <div className="music-note delay-2">🎵</div>
          </div>

          <p className="song-description">
            Ayudanos a armar la playlist perfecta para nuestra boda.
            <br />
            <strong>¡Elegí una canción que quieras escuchar ese día!</strong>
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="song-form">
              <div className="song-inputs">
                <div className="form-group">
                  <label>🎤 Nombre de la canción *</label>
                  <input
                    type="text"
                    value={song}
                    onChange={(e) => setSong(e.target.value)}
                    placeholder="Ej: Bohemian Rhapsody"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>🎸 Artista / Banda</label>
                  <input
                    type="text"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    placeholder="Ej: Queen"
                  />
                </div>
              </div>

              {message && (
                <div className="form-message error">{message}</div>
              )}

              <button type="submit" className="submit-btn" disabled={isSubmitting || !song.trim()}>
                {isSubmitting ? 'Enviando...' : '🎶 Agregar a la playlist'}
              </button>
            </form>
          ) : (
            <motion.div
              className="song-success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="success-emoji">🎉</div>
              <p className="success-text">{message}</p>
              <p className="success-sub">¡Nos vemos en la pista de baile!</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default SongRequest;
