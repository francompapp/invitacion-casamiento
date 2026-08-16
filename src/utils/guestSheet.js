const cache = new Map();

const fetchWithTimeout = async (url, options = {}, timeoutMs = 8000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
};

const getSourceUrls = () => {
  const proxyUrl = (import.meta.env.VITE_GUESTS_PROXY_URL || '').trim();
  const sheetUrl = (import.meta.env.VITE_GUESTS_SHEET_CSV_URL || '').trim();
  return [proxyUrl, sheetUrl].filter(Boolean);
};

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
  const sourceUrls = getSourceUrls();
  if (sourceUrls.length === 0) {
    throw new Error('Falta VITE_GUESTS_PROXY_URL o VITE_GUESTS_SHEET_CSV_URL en .env');
  }

  const normalizedToken = token.trim().toLowerCase();
  if (cache.has(normalizedToken)) return cache.get(normalizedToken);

  for (const baseUrl of sourceUrls) {
    try {
      const url = baseUrl + '?token=' + encodeURIComponent(normalizedToken);
      const response = await fetchWithTimeout(url, {}, 8000);
      if (!response.ok) continue;

      const raw = await response.text();
      if (!raw?.trim()) continue;

      const data = JSON.parse(raw);
      if (data.error) {
        cache.set(normalizedToken, null);
        return null;
      }

      const guestGroup = normalizeGuestRow(data);
      cache.set(normalizedToken, guestGroup);
      return guestGroup;
    } catch {
      // Try next source (proxy -> direct script)
    }
  }

  throw new Error('Error al contactar el sheet');
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
  const proxyUrl = (import.meta.env.VITE_GUESTS_PROXY_URL || '').trim();
  const scriptUrl = (import.meta.env.VITE_GUESTS_SHEET_CSV_URL || '').trim();
  if (!proxyUrl && !scriptUrl) {
    throw new Error('Falta VITE_GUESTS_PROXY_URL o VITE_GUESTS_SHEET_CSV_URL en .env');
  }

  const body = JSON.stringify({ action: 'submitRSVP', token, responses });

  // Prefer proxy first (better compatibility with Safari privacy protections)
  if (proxyUrl) {
    try {
      const res = await fetch(proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body,
      }, 7000);
      if (!res.ok) throw new Error('Proxy error');

      const raw = await res.text();
      if (raw?.trim()) {
        const data = JSON.parse(raw);
        if (data?.error) throw new Error(data.error);
      }

      cache.delete(token.trim().toLowerCase());
      return;
    } catch {
      // Fallback to direct Apps Script below
    }
  }

  if (scriptUrl) {
    // Direct Apps Script POST may require no-cors in browsers.
    await fetchWithTimeout(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body,
    }, 10000);
    cache.delete(token.trim().toLowerCase());
    return;
  }

  throw new Error('No se pudo guardar la confirmación');
};

