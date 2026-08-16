const cache = new Map();

const normalizeHeader = (value = '') =>
  value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\+/g, '')
    .replace(/[^a-z0-9]/g, '');

const getValueByAliases = (row, aliases) => {
  for (const alias of aliases) {
    const normalizedAlias = normalizeHeader(alias);
    const entry = Object.entries(row).find(
      ([key]) => normalizeHeader(key) === normalizedAlias
    );
    if (entry && entry[1]) return entry[1].toString().trim();
  }
  return "";
};

const getCompanionName = (row, slotNumber) => {
  const pattern = new RegExp(`^nombre${slotNumber}(hijo)?$`);
  const entry = Object.entries(row).find(
    ([key, value]) => pattern.test(normalizeHeader(key)) && value
  );
  return entry ? entry[1].toString().trim() : "";
};

const dedupeGuests = (guests) => {
  const seen = new Set();
  return guests.filter(({ name }) => {
    const key = normalizeHeader(name);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

// Returns existing menu detail for a slot (e.g. "Asiste - Vegetariano/a", "No asiste", "")
const getMenuDetail = (row, slot) => {
  const aliases = slot === 0
    ? ['Menu Detalle', 'Menu Detalle Principal']
    : [`Menu Detalle +${slot}`, `Menu Detalle${slot}`];
  return getValueByAliases(row, aliases);
};

// Parse a "Menu Detalle" string back into { attending, options, otras }
export const parseMenuDetail = (detail = '') => {
  if (!detail) return null;
  const lower = detail.toLowerCase();
  if (lower.startsWith('no asiste')) return { attending: false, options: ['ninguna'], otras: '' };
  if (lower.startsWith('asiste')) {
    const rest = detail.replace(/^asiste\s*[-–]?\s*/i, '');
    const parts = rest.split('|').map((s) => s.trim()).filter(Boolean);
    const knownIds = ['ninguna', 'alergia', 'intolerancia', 'vegetariano', 'vegano', 'otra'];
    const knownLabels = ['Sin restricciones', 'Alergia', 'Intolerancia', 'Vegetariano/a', 'Vegano/a', 'Otra'];
    const options = [];
    const notesArr = [];
    for (const p of parts) {
      const idx = knownLabels.findIndex((l) => l.toLowerCase() === p.toLowerCase());
      if (idx >= 0) options.push(knownIds[idx]);
      else notesArr.push(p);
    }
    return { attending: true, options: options.length ? options : ['ninguna'], otras: notesArr.join(' ') };
  }
  return null;
};

const normalizeGuestRow = (row) => {
  const token = getValueByAliases(row, ['Token']);
  const principalName = getValueByAliases(row, ['Invitado', 'Nombre']);
  const guests = [];

  const principalDetail = getMenuDetail(row, 0);
  if (principalName) {
    guests.push({ id: 'principal', label: 'Invitado principal', name: principalName, menuDetail: principalDetail });
  }

  for (let slot = 1; slot <= 4; slot++) {
    const pattern = new RegExp('^nombre' + slot + '(hijo)?$');
    const entry = Object.entries(row).find(([k, v]) => pattern.test(normalizeHeader(k)) && v);
    const name = entry ? entry[1].toString().trim() : '';
    if (name) {
      guests.push({
        id: slot === 1 ? 'plus1' : 'guest-' + slot,
        label: slot === 1 ? 'Acompañante' : 'Acompañante ' + slot,
        name,
        menuDetail: getMenuDetail(row, slot),
      });
    }
  }

  return { token, principalName, guests: dedupeGuests(guests) };
};

export const fetchGuestGroupByToken = async (token) => {
  const scriptUrl = import.meta.env.VITE_GUESTS_SHEET_CSV_URL;
  if (!scriptUrl) throw new Error('Falta VITE_GUESTS_SHEET_CSV_URL en .env');

  const normalizedToken = token.trim().toLowerCase();
  if (cache.has(normalizedToken)) return cache.get(normalizedToken);

  const url = scriptUrl + '?token=' + encodeURIComponent(normalizedToken);
  const response = await fetch(url);
  if (!response.ok) throw new Error('Error al contactar el sheet');

  const data = await response.json();
  if (data.error) {
    cache.set(normalizedToken, null);
    return null;
  }

  const guestGroup = normalizeGuestRow(data);
  cache.set(normalizedToken, guestGroup);
  return guestGroup;
};

// Format dietary selection as a string to store in "Menu Detalle" column
export const formatMenuDetail = (attending, options = ['ninguna'], otras = '') => {
  if (!attending) return 'No asiste';
  const knownIds = ['ninguna', 'alergia', 'intolerancia', 'vegetariano', 'vegano', 'otra'];
  const knownLabels = ['Sin restricciones', 'Alergia', 'Intolerancia', 'Vegetariano/a', 'Vegano/a', 'Otra'];
  const labels = options.map((id) => {
    const idx = knownIds.indexOf(id);
    return idx >= 0 ? knownLabels[idx] : id;
  });
  const parts = labels.filter(Boolean);
  if (otras.trim()) parts.push(otras.trim());
  return 'Asiste' + (parts.length ? ' - ' + parts.join(' | ') : '');
};

// Submit RSVP responses to the Google Sheet via Apps Script POST
export const submitRSVP = async (token, responses) => {
  // responses: [{ slot: 0|1|2|3|4, menuDetail: string }]
  const scriptUrl = import.meta.env.VITE_GUESTS_SHEET_CSV_URL;
  if (!scriptUrl) throw new Error('Falta VITE_GUESTS_SHEET_CSV_URL en .env');

  // Apps Script POST requires no-cors (CORS headers not returned on POST).
  // We can't read the response, so we optimistically assume success.
  await fetch(scriptUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action: 'submitRSVP', token, responses }),
  });

  // Invalidate cache so next load gets fresh data
  cache.delete(token.trim().toLowerCase());
};

