const fallbackQuotes = [
  { text: '千里之行，始于足下。', source: '《道德经》' },
  { text: '知之为知之，不知为不知，是知也。', source: '《论语》' },
  { text: '不积跬步，无以至千里。', source: '《荀子》' },
  { text: '博观而约取，厚积而薄发。', source: '苏轼' },
];

export async function showDailyQuote() {
  const text = document.querySelector('[data-daily-quote]');
  const source = document.querySelector('[data-quote-source]');
  const link = document.querySelector<HTMLAnchorElement>('[data-quote-link]');
  if (!text || !source || !link) return;

  const now = new Date();
  const day = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000;
  const key = 'kdl-daily-quote';
  type Quote = { text: string; source: string; uuid?: string };

  function render(quote: Quote) {
    text!.textContent = quote.text;
    source!.textContent = quote.source;
    link!.hidden = !quote.uuid;
    if (quote.uuid) link!.href = `https://hitokoto.cn/?uuid=${encodeURIComponent(quote.uuid)}`;
  }

  try {
    const cached = JSON.parse(localStorage.getItem(key) ?? 'null');
    if (cached?.day === day && typeof cached.quote?.text === 'string' &&
        typeof cached.quote.source === 'string' && typeof cached.quote.uuid === 'string') {
      render(cached.quote);
      return;
    }
  } catch {
    // The browser may block storage.
  }

  render(fallbackQuotes[day % fallbackQuotes.length]);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch('https://v1.hitokoto.cn/?c=k&max_length=34', {
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      signal: controller.signal,
    });
    if (!response.ok) return;
    const data = await response.json();
    if (typeof data.hitokoto !== 'string' || !data.hitokoto.trim() || typeof data.uuid !== 'string' || !data.uuid) return;
    const attribution = [...new Set([data.from_who, data.from].filter(value => typeof value === 'string' && value.trim()))];
    const quote = { text: data.hitokoto, source: attribution.join(' · '), uuid: data.uuid };
    render(quote);
    localStorage.setItem(key, JSON.stringify({ day, quote }));
  } catch {
    // Keep the displayed quote when the API, network, or storage is unavailable.
  } finally {
    clearTimeout(timeout);
  }
}
