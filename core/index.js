export * from './parsers.js'; export * from './engine.js'; export { CATALOG, DIVIDENDS, ALIASES } from './data.js';
import { CATALOG } from './data.js';
export const supportedFunds = () => CATALOG.funds.map(f => ({ id: f.id, name: f.name, isin: f.isin, tickers: f.tickers, issuer: f.issuer, format: f.format, officialPage: f.page, downloadUrl: downloadUrl(f), steps: f.steps }));
export function downloadUrl(f) {
  if (f.download) return f.download;
  const m = f.format === 'ishares' && String(f.page).match(/products\/(\d+)/); if (m) return `https://www.ishares.com/uk/individual/en/products/${m[1]}/x/latest-holdings.csv`;
  if (f.format === 'seligson') return f.page;
  if (f.id === 'NN-SUOMI') return 'https://nordnetab.com/wp-content/uploads/2026/08/Halvarsredogorelse-Nordnet-Suomi-Indeksi-2026.pdf';
  return null; }
