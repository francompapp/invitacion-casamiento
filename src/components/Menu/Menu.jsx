import { useState } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import './Menu.css';

const DIETARY_OPTIONS = [
  { id: 'ninguna',      label: 'Ninguna' },
  { id: 'alergia',      label: 'Alergia' },
  { id: 'intolerancia', label: 'Intolerancia' },
  { id: 'vegetariano',  label: 'Vegetariano/a' },
  { id: 'vegano',       label: 'Vegano/a' },
  { id: 'otra',         label: 'Otra restricción' },
];

const initGuest = () => ({ options: ['ninguna'], otras: '' });

const Menu = ({ guestGroup }) => {
  const guestNames = guestGroup?.guests?.map((g) => g.name) || [];

  const buildInitial = (names) =>
    names.reduce((acc, n) => ({ ...acc, [n]: initGuest() }), {});

  const [selections, setSelections]   = useState(buildInitial(guestNames));
  const [guestName, setGuestName]     = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage]         = useState('');
  const [submitted, setSubmitted]     = useState(false);

  const toggleOption = (name, optId) => {
    setSelections((prev) => {
      const current = prev[name] || initGuest();
      let opts = current.options;

      if (optId === 'ninguna') {
        opts = ['ninguna'];
      } else {
        opts = opts.filter((o) => o !== 'ninguna');
        opts = opts.includes(optId) ? opts.filter((o) => o !== optId) : [...opts, optId];
        if (opts.length === 0) opts = ['ninguna'];
      }

      return { ...prev, [name]: { ...current, options: opts } };
    });
  };

  const setOtras = (name, value) => {
    setSelections((prev) => ({
      ...prev,
      [name]: { ...(prev[name] || initGuest()), otras: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const token = guestGroup?.token || '';
      const names = guestNames.length > 0 ? guestNames : guestName ? [guestName] : [];

      if (names.length === 0) {
        setMessage('Por favor, ingresa tu nombre.');
        setIsSubmitting(false);
        return;
      }

      if (token) {
        const q = query(collection(db, 'menuSelections'), where('token', '==', token));
        const snap = await getDocs(q);
        await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, 'menuSelections', d.id))));
      }

      for (const name of names) {
        const sel = selections[name] || initGuest();
        await addDoc(collection(db, 'menuSelections'), {
          token,
          name,
          options: sel.options,
          otras: sel.otras.trim(),
          createdAt: new Date(),
        });
      }

      setSubmitted(true);
      setMessage('¡Gracias! Hemos guardado tus necesidades. 🙌');
    } catch {
      setMessage('Algo falló al guardar. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const namesToShow = guestNames.length > 0 ? guestNames : [guestName || ''];

  return (
    <section id="menu" className="menu">
      <div className="container">
        <motion.div
          className="menu-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="section-label">NECESIDADES ALIMENTARIAS</p>
          <h2 className="menu-title">¿Algo que debamos saber?</h2>
          <p className="menu-subtitle">
            Para que podamos cuidar todos los detalles, cuéntanos si tienes
            alguna necesidad alimentaria.
          </p>
        </motion.div>

        <motion.form
          className="menu-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {!guestGroup && (
            <div className="form-group">
              <label>Tu nombre completo</label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Nombre y apellido"
                required
              />
            </div>
          )}

          {namesToShow.map((name, i) => {
            const sel = selections[name] || initGuest();
            return (
              <div key={name || i} className="guest-dietary-block">
                {guestNames.length > 0 && (
                  <h3 className="guest-name-label">
                    <span className="guest-avatar">{name.charAt(0)}</span>
                    {name}
                  </h3>
                )}

                <div className="dietary-options">
                  {DIETARY_OPTIONS.map((opt) => {
                    const checked = sel.options.includes(opt.id);
                    return (
                      <label
                        key={opt.id}
                        className={`dietary-option${checked ? ' checked' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleOption(name, opt.id)}
                        />
                        <span>{opt.label}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="form-group">
                  <label>Comentarios o aclaraciones</label>
                  <textarea
                    value={sel.otras}
                    onChange={(e) => setOtras(name, e.target.value)}
                    placeholder="Cuéntanos lo que necesitemos saber (ingredientes a evitar, gravedad, etc.)..."
                    rows={3}
                  />
                </div>
              </div>
            );
          })}

          {message && (
            <div className={`form-message ${submitted ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          {!submitted && (
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          )}
        </motion.form>
      </div>
    </section>
  );
};

export default Menu;

