// Asiakaspuolen jäsentimet. Ei verkkoliikennettä: kaikki tiedot tulevat käyttäjän omasta tiedostosta.
export const num = s => { s = String(s ?? '').replace(/[\u00a0\u202f ']/g, '').trim(); if (!s || s === '-') return 0;
  if (s.includes(',') && s.includes('.')) s = s.lastIndexOf(',') > s.lastIndexOf('.') ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
  else s = s.replace(',', '.'); const v = parseFloat(s); return isNaN(v) ? 0 : v; };
const SECT = {"Information Technology":"Teknologia","Informationstechnologie":"Teknologia","Financials":"Rahoitus","Financials ":"Rahoitus","Finanzwesen":"Rahoitus","Health Care":"Terveydenhuolto","Gesundheitsversorgung":"Terveydenhuolto","Industrials":"Teollisuus","Industrie":"Teollisuus","Consumer Discretionary":"Kulutustavarat (syklinen)","Zyklische Konsumgüter":"Kulutustavarat (syklinen)","Consumer Staples":"Päivittäistavarat","Basiskonsumgüter":"Päivittäistavarat","Communication":"Viestintä","Kommunikation":"Viestintä","Energy":"Energia","Energie":"Energia","Materials":"Materiaalit","Materialien":"Materiaalit","Utilities":"Yhteiskunnan palvelut","Versorger":"Yhteiskunnan palvelut","Real Estate":"Kiinteistöt","Immobilien":"Kiinteistöt"};
const CASH = 'Käteinen/johdannaiset';
function csvRows(text, sep = ',') { const out = []; let row = [], f = '', q = false;
  for (let i = 0; i < text.length; i++) { const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"' && f === '') q = true; else if (c === sep) { row.push(f); f = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(f); out.push(row); row = []; f = ''; }
    else f += c; }
  if (f || row.length) { row.push(f); out.push(row); } return out; }
const ent = s => s.replace(/<[^>]+>/g, '').replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).trim();
// Taulukkorivit mistä tahansa tekstimuodosta: CSV (, ; sarkain), SpreadsheetML-XML (*.xls) tai HTML-taulukko (*.xls/*.html)
export function tableRows(text) {
  text = text.replace(/^\uFEFF/, '');
  if (/<(ss:)?Workbook|<(ss:)?Row[\s>]/i.test(text)) { // SpreadsheetML 2003
    return (text.match(/<(?:ss:)?Row\b[\s\S]*?<\/(?:ss:)?Row>/gi) || []).map(r => { const cells = [];
      for (const m of r.matchAll(/<(?:ss:)?Cell\b([^>]*?)(?:\/>|>([\s\S]*?)<\/(?:ss:)?Cell>)/gi)) {
        const ix = (m[1].match(/(?:ss:)?Index="(\d+)"/i) || [])[1]; if (ix) while (cells.length < +ix - 1) cells.push('');
        const d = (m[2] || '').match(/<(?:ss:)?Data\b[^>]*>([\s\S]*?)<\/(?:ss:)?Data>/i); cells.push(d ? ent(d[1]) : ''); }
      return cells; }); }
  if (/<t[dh][\s>]/i.test(text)) return (text.match(/<tr\b[\s\S]*?<\/tr>/gi) || []).map(r => (r.match(/<t[dh]\b[\s\S]*?<\/t[dh]>/gi) || []).map(ent));
  const head = text.split(/\r?\n/).slice(0, 30).join('\n'), cnt = c => head.split(c).length;
  const sep = cnt('\t') > cnt(',') && cnt('\t') > cnt(';') ? '\t' : cnt(';') > cnt(',') ? ';' : ',';
  return csvRows(text, sep);
}
export const isIsharesRows = rows => rows.some(r => r.map(c => c.trim()).includes('Name') && r.some(c => /^(Weight|Gewichtung) \(%\)$/.test(c.trim())));
const MON = {jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12,mai:5,okt:10,dez:12,mrz:3,'mär':3};
function isoDate(s) { s = (s || '').trim(); let m = s.match(/^(\d{1,2})[\/. ]([A-Za-zä]{3})[a-zä]*[\/. ]+(\d{4})$/);
  if (m) return `${m[3]}-${String(MON[m[2].toLowerCase()] || 0).padStart(2,'0')}-${m[1].padStart(2,'0')}`;
  m = s.match(/^([A-Za-z]{3})[a-z]* (\d{1,2}), (\d{4})$/); if (m) return `${m[3]}-${String(MON[m[1].toLowerCase()]).padStart(2,'0')}-${m[2].padStart(2,'0')}`;
  m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/); if (m) return `${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`; return s || null; }
// iShares "holdings" CSV (UK/EN ja DE -muodot)
export function parseIshares(text) {
  const rows = (Array.isArray(text) ? text : tableRows(text)).map(r => r.map(c => String(c ?? '')));
  const hi = rows.findIndex(r => { const t = r.map(c => c.trim()); return t.includes('Name') && (t.includes('Weight (%)') || t.includes('Gewichtung (%)')); });
  if (hi < 0) throw new Error('Tiedosto ei näytä iSharesin omistustiedostolta (sarakkeita Name / Weight (%) ei löytynyt).');
  const H = rows[hi], ix = n => H.findIndex(h => n.includes(h.trim()));
  const iN = ix(['Name']), iW = ix(['Weight (%)','Gewichtung (%)']), iS = ix(['Sector','Sektor']), iA = ix(['Asset Class','Anlageklasse']),
        iL = ix(['Location','Standort']), iC = ix(['Market Currency','Marktwährung']), iP = ix(['Price','Kurs']);
  const dl = rows.slice(0, hi).find(r => /Holdings as of|Fondsposition per/i.test(r[0] || '')); const dv = dl ? (dl[1] || dl[0].replace(/^.*?(as of|per)[:\s]*/i, '')).trim() : null;
  const holdings = [];
  for (const r of rows.slice(hi + 1)) { if (r.length < H.length - 2 || !r[iN]) continue; const w = num(r[iW]); if (!w) continue;
    const eq = /^(Equity|Aktien)$/i.test((r[iA] || '').trim());
    holdings.push({ n: r[iN].trim(), w, s: eq ? (SECT[(r[iS]||'').trim()] || (r[iS]||'Muu').trim()) : CASH, c: (r[iL]||'–').trim(), cur: (r[iC]||'–').trim(), px: iP >= 0 ? num(r[iP]) : 0 }); }
  if (!holdings.length) throw new Error('Omistuksia ei löytynyt tiedostosta.');
  return { asOf: dv ? isoDate(dv.replace(/^"|"$/g, '')) : null, holdings };
}
const SEL_C = {"Suomi":"Finland","Ruotsi":"Sweden","Norja":"Norway","Tanska":"Denmark"};
// Seligsonin "Arvopaperien listaus": tallennettu HTML-sivu tai kopioitu taulukko (sarkain-/välilyöntierotus)
export function parseSeligson(text) {
  const holdings = []; let asOf = null;
  const dm = text.match(/päivitetty\s+(\d{2})\.(\d{2})\.(\d{4})/i); if (dm) asOf = `${dm[3]}-${dm[2]}-${dm[1]}`;
  const push = (name, maa, ala, pct) => { const cash = /^KÄTEINEN/i.test(name);
    holdings.push({ n: name.trim(), w: num(pct), s: cash ? CASH : ala.trim(), c: cash ? '–' : (SEL_C[maa.trim()] || maa.trim()), cur: maa.trim() === 'Suomi' ? 'EUR' : '?', px: 0 }); };
  if (/<td/i.test(text)) {
    const dec = s => s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&ndash;|&#8211;/g, '–').trim();
    for (const tr of text.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || []) { const td = (tr.match(/<td[^>]*>[\s\S]*?<\/td>/gi) || []).map(dec);
      if (td.length === 5 && /^[\d,]+$/.test(td[4])) push(td[0], td[1], td[2], td[4]); }
  } else {
    for (const line of text.split(/\r?\n/)) { const p = line.split('\t').map(s => s.trim()).filter(Boolean);
      if (p.length >= 5 && /^[\d,]+$/.test(p[p.length - 1])) push(p[0], p[1], p[2], p[p.length - 1]); }
  }
  if (!holdings.length) throw new Error('Seligsonin arvopaperilistausta ei tunnistettu. Tallenna sivu (Ctrl+S) tai kopioi koko taulukko.');
  return { asOf, holdings };
}
// Nordnetin puolivuosi-/vuosikatsaus (PDF), "Not 1 Finansiella instrument". lines = PDF:n tekstirivit soluina.
const SV = {"Material":"Materiaalit","Industri":"Teollisuus","Sällanköpsvaror":"Kulutustavarat (syklinen)","Dagligvaror":"Päivittäistavarat","Hälsovård":"Terveydenhuolto","Finans":"Rahoitus","Informationsteknik":"Teknologia","Kommunikationstjänst":"Viestintä","Fastighet":"Kiinteistöt","Kraftförsörjning":"Yhteiskunnan palvelut","Energi":"Energia"};
const isNum = s => /^[\d ]+(,\d+)?$/.test(s.trim());
export function parseNordnetLines(lines) {
  let asOf = null, on = false; const holdings = []; let pend = [];
  for (const cells of lines) { const t = cells.join(' ');
    const d = t.match(/Per (\d{4}-\d{2}-\d{2}) innehades/); if (d) { asOf = d[1]; on = true; continue; }
    if (!on) continue; if (/^\s*Summa Kategori 1|Summa Överlåtbara/.test(t)) break;
    const c = cells.map(s => s.trim()).filter(Boolean);
    if (c.length >= 4 && isNum(c.at(-1)) && isNum(c.at(-2)) && isNum(c.at(-3)) && /, /.test(c[0])) {
      const q = num(c.at(-3)), v = num(c.at(-2)), name = c[0].split(',')[0].trim();
      pend.push({ n: name, w: num(c.at(-1)), c: /\((HEL|STO)\)|SSAB/.test(c[0]) ? 'Sweden' : (c[0].match(/, (Finland|Sverige|Sweden)/) ? 'Finland' : '–'), cur: 'EUR', px: q ? +(v / q).toFixed(2) : 0 }); continue; }
    if (c.length >= 3 && !isNum(c[0]) && isNum(c.at(-1)) && isNum(c.at(-2)) && pend.length) { const s = SV[c[0]] || c[0]; pend.forEach(p => { p.s = s; holdings.push(p); }); pend = []; }
  }
  if (!holdings.length) throw new Error('PDF:stä ei löytynyt Nordnetin salkkuluetteloa (Not 1 Finansiella instrument).');
  return { asOf, holdings };
}
export async function pdfLines(pdfjs, data) {
  const doc = await pdfjs.getDocument({ data, isEvalSupported: false }).promise; const lines = [];
  for (let p = 1; p <= doc.numPages; p++) { const tc = await (await doc.getPage(p)).getTextContent(); const rows = new Map();
    for (const it of tc.items) { if (!it.str || !it.str.trim()) continue; const y = Math.round(it.transform[5]); const k = [...rows.keys()].find(k => Math.abs(k - y) <= 2) ?? y;
      (rows.get(k) || rows.set(k, []).get(k)).push({ x: it.transform[4], s: it.str, w: it.width }); }
    for (const k of [...rows.keys()].sort((a, b) => b - a)) { const its = rows.get(k).sort((a, b) => a.x - b.x); const cells = []; let end = -1e9;
      for (const it of its) { if (cells.length && it.x - end < 4) cells[cells.length - 1] += (it.x - end > 0.5 ? ' ' : '') + it.s; else cells.push(it.s); end = it.x + it.w; }
      lines.push(cells); } }
  return lines;
}

// Tunnista muoto sisällöstä (ei tiedostopäätteestä/MIME-tyypistä). Palauttaa 'pdf' | 'xlsx' | 'ishares' | 'seligson' | 'unknown'.
export function decodeBytes(u8) {
  if (u8[0] === 0xFF && u8[1] === 0xFE) return new TextDecoder('utf-16le').decode(u8);
  if (u8[0] === 0xFE && u8[1] === 0xFF) return new TextDecoder('utf-16be').decode(u8);
  const t = new TextDecoder('utf-8').decode(u8); return (t.match(/\uFFFD/g) || []).length > 3 ? new TextDecoder('windows-1252').decode(u8) : t; }
export function sniff(u8, text) {
  if (u8 && u8[0] === 0x25 && u8[1] === 0x50 && u8[2] === 0x44 && u8[3] === 0x46) return 'pdf';
  if (u8 && u8[0] === 0x50 && u8[1] === 0x4B) return 'xlsx';
  if (u8 && u8[0] === 0xD0 && u8[1] === 0xCF) return 'xls-binary';
  if (isIsharesRows(tableRows(text))) return 'ishares';
  if (/Arvopaperien listaus|päivitetty\s+\d{2}\.\d{2}\.\d{4}/i.test(text) || /^[^\t\n]+\t[^\t\n]+\t[^\t\n]+\t.*\t[\d,]+\s*$/m.test(text)) return 'seligson';
  return 'unknown'; }
