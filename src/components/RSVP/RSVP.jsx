import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitRSVP, formatMenuDetail, parseMenuDetail } from '../../utils/guestSheet';
import './RSVP.css';

const DIETARY_OPTIONS = [
  { id: 'ninguna',      label: 'Sin restricciones' },
  { id: 'alergia',      label: 'Alergia' },
  { id: 'intolerancia', label: 'Intolerancia' },
  { id: 'vegetariano',  label: 'Vegetariano/a' },
  { id: 'vegano',       label: 'Vegano/a' },
  { id: 'otra',         label: 'Otra' },
];

const initDiet = () => ({ options: ['ninguna'], otras: '' });

// Map guest id → slot number (0 = principal)
const slotOf = (id) => {
  if (id === 'principal') return 0;
  if (id === 'plus1') return 1;
  return parseInt(id.replace('guest-', ''), 10);
};

const withTimeout = (promise, ms = 12000) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);

const RSVP = ({ guestGroup }) => {
  const guests = guestGroup?.guests || [];

  // { [guestName]: true | false | null }
  const [confirmations, setConfirmations] = useState(() =>
    guests.reduce((acc, g) => ({ ...acc, [g.name]: null }), {})
  );
  // { [guestName]: { options, otras } }
  const [dietary, setDietary] = useState(() =>
    guests.reduce((acc, g) => ({ ...acc, [g.name]: initDiet() }), {})
  );

  // anonymous fallback (no token)
  const [anonName, setAnonName]     = useState('');
  const [anonAttend, setAnonAttend] = useState(null);
  const [anonDiet, setAnonDiet]     = useState(initDiet());

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage]           = useState('');
  const [messageType, setMessageType]   = useState('');
  const [submitted, setSubmitted]       = useState(false);

  // Pre-fill form from existing "Menu Detalle" columns returned by the sheet
  useEffect(() => {
    if (!guests.length) return;
    const confInit = {};
    const dietInit = {};
    let hasAny = false;

    guests.forEach((g) => {
      const parsed = g.menuDetail ? parseMenuDetail(g.menuDetail) : null;
      if (parsed) {
        hasAny = true;
        confInit[g.name] = parsed.attending;
        dietInit[g.name] = { options: parsed.options, otras: parsed.otras };
      } else {
        confInit[g.name] = null;
        dietInit[g.name] = initDiet();
      }
    });

    setConfirmations(confInit);
    setDietary(dietInit);
    if (hasAny) {
      setSubmitted(true);
      setMessage('Tu confirmación ya está guardada. Puedes actualizarla si lo necesitas.');
      setMessageType('success');
    }
  }, [guestGroup?.token]); // eslint-disable-line

  // ── Helpers ────────────────────────────────────────────────
  const setGuestAttending = (guestName, value) => {
    setConfirmations((prev) => ({ ...prev, [guestName]: value }));
    setSubmitted(false);
    setMessage('');
  };

  const toggleDietOption = (guestName, optId, isAnon = false) => {
    const updater = (current) => {
      let opts = current.options;
      if (optId === 'ninguna') {
        opts = ['ninguna'];
      } else {
        opts = opts.filter((o) => o !== 'ninguna');
        opts = opts.includes(optId) ? opts.filter((o) => o !== optId) : [...opts, optId];
        if (opts.length === 0) opts = ['ninguna'];
      }
      return { ...current, options: opts };
    };
    if (isAnon) setAnonDiet((prev) => updater(prev));
    else setDietary((prev) => ({ ...prev, [guestName]: updater(prev[guestName] || initDiet()) }));
  };

  const setDietOtras = (guestName, value, isAnon = false) => {
    if (isAnon) setAnonDiet((prev) => ({ ...prev, otras: value }));
    else setDietary((prev) => ({ ...prev, [guestName]: { ...(prev[guestName] || initDiet()), otras: value } }));
  };

  // ── Submit ──────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setMessageType('');

    try {
      const token = guestGroup?.token || '';

      if (guests.length > 0) {
        const unset = guests.filter((g) => confirmations[g.name] === null);
        if (unset.length > 0) {
          setMessage(`Falta confirmar la asistencia de: ${unset.map((g) => g.name).join(', ')}`);
          setMessageType('error');
          setIsSubmitting(false);
          return;
        }

        const responses = guests.map((g) => {
          const attending = confirmations[g.name];
          const diet = dietary[g.name] || initDiet();
          return {
            slot: slotOf(g.id),
            menuDetail: formatMenuDetail(attending, diet.options, diet.otras),
          };
        });

        await withTimeout(submitRSVP(token, responses));
      } else {
        // anonymous
        if (!anonName.trim()) {
          setMessage('Por favor, ingresa tu nombre.');
          setMessageType('error');
          setIsSubmitting(false);
          return;
        }
        if (anonAttend === null) {
          setMessage('Por favor, confirma si asistirás.');
          setMessageType('error');
          setIsSubmitting(false);
          return;
        }
        await withTimeout(submitRSVP('', [{
          slot: 0,
          name: anonName.trim(),
          menuDetail: formatMenuDetail(anonAttend, anonDiet.options, anonDiet.otras),
        }]));
      }

      setSubmitted(true);
      const anyYes = guests.length > 0
        ? Object.values(confirmations).some(Boolean)
        : anonAttend;
      setMessage(anyYes
        ? '¡Perfecto! Todo guardado. ¡Qué ganas de veros! 🎉'
        : 'Gracias por avisarnos. ¡Te echaremos de menos!');
      setMessageType('success');
    } catch (err) {
      if (err?.message === 'timeout') {
        setMessage('La conexión tardó demasiado. Revisa tu internet e inténtalo de nuevo.');
      } else {
        setMessage('Algo falló al enviar. Por favor, inténtalo de nuevo.');
      }
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Dietary block renderer ──────────────────────────────────
  const renderDietBlock = (guestName, dietState, isAnon = false) => (
    <div className="dietary-block">
      <p className="dietary-label">Necesidades alimentarias</p>
      <div className="dietary-options">
        {DIETARY_OPTIONS.map((opt) => {
          const checked = dietState.options.includes(opt.id);
          return (
            <label key={opt.id} className={`dietary-chip${checked ? ' selected' : ''}`}>
              <input type="checkbox" checked={checked} onChange={() => toggleDietOption(guestName, opt.id, isAnon)} />
              {opt.label}
            </label>
          );
        })}
      </div>
      <textarea
        className="dietary-textarea"
        value={dietState.otras}
        onChange={(e) => setDietOtras(guestName, e.target.value, isAnon)}
        placeholder="Detalles, marcas a evitar, alergias cruzadas… cuéntanos lo que necesites."
        rows={3}
      />
    </div>
  );

  return (
    <section id="rsvp" className="rsvp">
      <div className="container">
        <motion.div
          className="rsvp-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="section-label">CONFIRMA TU ASISTENCIA</p>
          <h2 className="rsvp-title">¿Venís a celebrar con nosotros?</h2>
          <p className="rsvp-deadline">Confirma antes del <strong>10 de septiembre de 2026</strong></p>
        </motion.div>

        <motion.form
          className="rsvp-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {guests.length > 0 ? (
            <div className="rsvp-guests">
              {guests.map((guest) => {
                const status = confirmations[guest.name];
                const statusClass = status === true ? ' confirmed' : status === false ? ' declined' : '';
                const diet = dietary[guest.name] || initDiet();
                return (
                  <div key={guest.name} className={`rsvp-guest-row${statusClass}`}>
                    <div className="rsvp-guest-top">
                      <div className="rsvp-guest-info">
                        <span className="rsvp-guest-avatar">{guest.name.charAt(0)}</span>
                        <div>
                          <p className="rsvp-guest-name">{guest.name}</p>
                          {guest.id !== 'principal' && (
                            <p className="rsvp-guest-badge">{guest.label}</p>
                          )}
                        </div>
                      </div>
                      <div className="rsvp-attendance-btns">
                        <button type="button" className={`attend-btn yes${status === true ? ' active' : ''}`} onClick={() => setGuestAttending(guest.name, true)}>Asistiré</button>
                        <button type="button" className={`attend-btn no${status === false ? ' active' : ''}`} onClick={() => setGuestAttending(guest.name, false)}>No podré</button>
                      </div>
                    </div>
                    <AnimatePresence>
                      {status === true && (
                        <motion.div key="diet" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden', width: '100%' }}>
                          {renderDietBlock(guest.name, diet)}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rsvp-anon">
              <div className="form-group-rsvp">
                <label>Nombre completo</label>
                <input type="text" value={anonName} onChange={(e) => setAnonName(e.target.value)} placeholder="Nombre y apellido" />
              </div>
              <div className="rsvp-attendance-btns standalone">
                <button type="button" className={`attend-btn yes${anonAttend === true ? ' active' : ''}`} onClick={() => setAnonAttend(true)}>Asistiré 🎉</button>
                <button type="button" className={`attend-btn no${anonAttend === false ? ' active' : ''}`} onClick={() => setAnonAttend(false)}>No podré</button>
              </div>
              <AnimatePresence>
                {anonAttend === true && (
                  <motion.div key="anon-diet" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
                    {renderDietBlock(anonName, anonDiet, true)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {message && (
            <div className={`rsvp-message ${messageType}`}>{message}</div>
          )}

          <button type="submit" className="rsvp-submit-btn" disabled={isSubmitting}>
            {isSubmitting
              ? <span className="btn-spinner-wrap"><span className="btn-spinner" /> Enviando…</span>
              : submitted ? 'Actualizar confirmación' : 'Confirmar asistencia'}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default RSVP;
