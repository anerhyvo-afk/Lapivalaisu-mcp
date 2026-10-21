// Läpivalaisun laskentamoottori. Puhdas funktio: ei verkkoliikennettä, ei tallennusta.
import { CATALOG, DIVIDENDS, ALIASES } from './data.js';
const SUF = /\b(OYJ|ABP|OY|PLC|INC|CORP(ORATION)?|CO|LTD|AG|SA|SE|NV|AB|ASA|A\/S|KK|HOLDINGS?|GROUP|CLASS [A-Z]|SHS|REG|[ABRC]|EUR|FI|HEL)\b\.?/g;
export const norm = s => String(s).toUpperCase().replace(/[ÄÅ]/g, 'A').replace(/Ö/g, 'O').replace(/&/g, ' ').replace(/[.,'()\/-]/g, ' ').replace(SUF, ' ').replace(/\s+/g, ' ').trim();
export function issuer(name, aliases = ALIASES) { const k = norm(name); if (aliases[k]) return aliases[k]; const w = k.split(' ');
  for (const n of [3, 2, 1]) if (w.length >= n && aliases[w.slice(0, n).join(' ')]) return aliases[w.slice(0, n).join(' ')]; return k; }
const CFI = {"United States":"Yhdysvallat","Japan":"Japani","United Kingdom":"Iso-Britannia","Canada":"Kanada","France":"Ranska","Germany":"Saksa","Switzerland":"Sveitsi","Netherlands":"Alankomaat","Australia":"Australia","Taiwan":"Taiwan","China":"Kiina","India":"Intia","Korea (South)":"Etelä-Korea","Sweden":"Ruotsi","Denmark":"Tanska","Finland":"Suomi","Norway":"Norja","Spain":"Espanja","Italy":"Italia","Ireland":"Irlanti","Brazil":"Brasilia","Saudi Arabia":"Saudi-Arabia","South Africa":"Etelä-Afrikka","Hong Kong":"Hongkong","Belgium":"Belgia"};
const CUR = {"Suomi":"EUR","Ruotsi":"SEK","Norja":"NOK","Tanska":"DKK","Sveitsi":"CHF","Iso-Britannia":"GBP","Yhdysvallat":"USD","Ranska":"EUR","Saksa":"EUR","Alankomaat":"EUR","Espanja":"EUR","Italia":"EUR","Irlanti":"EUR","Belgia":"EUR","Itävalta":"EUR","Portugali":"EUR","Luxemburg":"EUR"};
const CASH = 'Käteinen/johdannaiset', r2 = x => Math.round(x * 100) / 100;
export const DISCLAIMER = 'ARVIO, ei sijoitusneuvontaa. / Estimate only, not investment advice.';
export const TAX = {
  aot: 'Arvo-osuustili: suomalaisten pörssiyhtiöiden osingoista 85 % on veronalaista pääomatuloa (30 %, yli 30 000 €:n osalta 34 %), tehollinen vero n. 25,5 % / 28,9 %. Ulkomaisista osingoista lähdevero, hyvitetään pääsääntöisesti verosopimuksen rajaan asti.',
  ost: 'Osakesäästötili: osingoista ei makseta veroa vuosittain; vero (30 % / 34 %) peritään vasta nostettavasta tuotto-osuudesta.' };
export function findFund(funds, q) { const k = String(q).trim().toUpperCase().split(' – ')[0];
  return funds.find(f => { const m = CATALOG.funds.find(c => c.id === f.id) || {}; return [f.id, f.isin, m.isin, ...(f.tickers || []), ...(m.tickers || [])].filter(Boolean).some(t => String(t).toUpperCase() === k); }); }
/** funds: [{id, name?, isin?, asOf, source?, holdings:[{n,w,s,c,cur,px}]}], positions: [{id|name, eur}], account: 'aot'|'ost' */
export function analyze({ funds = [], positions = [], account = 'aot', dividends, aliases = ALIASES, top = 25 }) {
  if (!Array.isArray(positions) || !positions.length) throw new Error('positions puuttuu / positions required');
  const F = funds.map(f => ({ ...f, holdings: (f.holdings || []).map(h => ({ ...h, w: +h.w || 0, k: h.s === CASH ? '__CASH' : issuer(h.n, aliases) })) }));
  const rows = positions.map(p => ({ q: String(p.id ?? p.name ?? p.q ?? '').trim(), a: +(p.eur ?? p.amount ?? 0) })).filter(r => r.q && r.a > 0);
  const total = rows.reduce((s, r) => s + r.a, 0); if (!total) throw new Error('Summa 0 / total is zero');
  const ex = {}, used = [], direct = [], missing = [];
  const add = (key, name, eur, s, c, cur, via) => { const e = ex[key] ??= { key, name, eur: 0, sector: s, country: CFI[c] || c, currency: cur, via: {} };
    if (e.name !== name && key !== '__CASH') e.multipleNames = true; e.eur += eur; e.via[via] = (e.via[via] || 0) + eur; };
  const meta = k => { for (const f of F) for (const h of f.holdings) if (h.k === k) return h; return null; };
  for (const r of rows) { const f = findFund(F, r.q);
    if (f) { used.push({ f, a: r.a }); for (const h of f.holdings) add(h.k, h.k === '__CASH' ? 'Käteinen / johdannaiset' : h.n, r.a * h.w / 100, h.s, h.c, h.cur, f.id); continue; }
    if (CATALOG.funds.some(c => [c.id, c.isin, ...c.tickers].some(t => t.toUpperCase() === r.q.toUpperCase()))) { missing.push(r.q); continue; }
    const k = issuer(r.q, aliases), m = meta(k); direct.push(r.q); add(k, m ? m.n : r.q, r.a, m ? m.s : 'Muu', m ? m.c : '–', m ? m.cur : '?', 'suora'); }
  const list = Object.values(ex).sort((a, b) => b.eur - a.eur); for (const e of list) if (!e.currency || e.currency === '?' || e.currency === '–') e.currency = CUR[e.country] || '?';
  const agg = k => { const o = {}; for (const e of list) o[e[k]] = (o[e[k]] || 0) + e.eur; return Object.entries(o).sort((a, b) => b[1] - a[1]).map(([name, eur]) => ({ name, eur: r2(eur), pct: r2(eur / total * 100) })); };
  const wmap = f => { const m = {}; f.holdings.forEach(h => { if (h.k !== '__CASH') m[h.k] = (m[h.k] || 0) + h.w; }); return m; };
  const overlap = []; for (let i = 0; i < used.length; i++) for (let j = i + 1; j < used.length; j++) { const A = wmap(used[i].f), B = wmap(used[j].f); let s = 0; for (const k in A) if (B[k]) s += Math.min(A[k], B[k]); overlap.push({ a: used[i].f.id, b: used[j].f.id, weightedOverlapPct: r2(s) }); }
  const price = {}; for (const f of F) for (const h of f.holdings) if (h.px && h.cur === 'EUR' && (h.c === 'Finland' || h.c === 'Suomi')) price[h.k] ??= { px: h.px, asOf: f.asOf, fund: f.id };
  const dps = dividends || Object.fromEntries(Object.entries(DIVIDENDS.companies).map(([k, v]) => [k, v.dps]));
  let est = 0, base = 0; const noPrice = [], detail = [];
  for (const e of list) { const d = dps[e.key]; if (d == null) continue; const p = price[e.key]; if (!p) { noPrice.push(e.key); continue; }
    const v = e.eur * d / p.px; est += v; base += e.eur; detail.push({ key: e.key, eur: r2(e.eur), dps: d, price: p.px, priceAsOf: p.asOf, priceFrom: p.fund, estDividendEur: r2(v), source: DIVIDENDS.companies[e.key]?.src }); }
  return {
    summary: { totalEur: total, funds: used.length, directStocks: direct.length, distinctHoldings: list.length, top10Pct: r2(list.slice(0, 10).reduce((s, e) => s + e.eur, 0) / total * 100) },
    topHoldings: list.slice(0, top).map(e => ({ key: e.key, name: e.multipleNames ? e.key : e.name, eur: r2(e.eur), pct: r2(e.eur / total * 100), sector: e.sector, country: e.country, currency: e.currency, via: Object.fromEntries(Object.entries(e.via).map(([k, v]) => [k, r2(v)])) })),
    sectors: agg('sector'), countries: agg('country'), currencies: agg('currency'), overlap,
    dividends: { estimatedAnnualEur: r2(est), coveredEur: r2(base), yieldPctOnCovered: base ? r2(est / base * 100) : 0, detail, missingPrice: noPrice,
      note: 'Helsingin pörssiyhtiöt: oma €/osake-taulukko yhtiökokoustiedotteista (tilikausi 2025); hinta käyttäjän omista tiedostoista. Rahaston kautta saatua osinkoa ei makseta sijoittajalle.', taxNote: TAX[account] || TAX.aot },
    unknownDirect: direct.filter(d => !meta(issuer(d, aliases))), missingFunds: missing,
    dataDates: used.map(u => ({ fund: u.f.id, name: u.f.name || (CATALOG.funds.find(c => c.id === u.f.id) || {}).name, asOf: u.f.asOf || null, source: u.f.source || null })),
    account, disclaimer: DISCLAIMER };
}
