#!/usr/bin/env node
// Läpivalaisu MCP -palvelin (stdio). Ajetaan käyttäjän/agentin OMALLA koneella.
// fetch_fund_holdings lataa liikkeeseenlaskijan julkisen tiedoston virallisesta osoitteesta käyttäjän koneelta
// ja tallentaa sen vain paikalliseen välimuistiin (~/.cache/lapivalaisu). Mikään ei kulje Läpivalaisun palvelimen kautta.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import fs from 'fs/promises'; import path from 'path'; import os from 'os';
import { supportedFunds, CATALOG, sniff, decodeBytes, parseIshares, parseSeligson, parseNordnetLines, pdfLines, analyze } from '@lapivalaisu/core';

const CACHE = process.env.LAPIVALAISU_CACHE || path.join(os.homedir(), '.cache', 'lapivalaisu');
const UA = 'lapivalaisu-mcp/0.1 (user-initiated download on user machine)';
const ok = o => ({ content: [{ type: 'text', text: JSON.stringify(o, null, 2) }] });
const fail = m => ({ content: [{ type: 'text', text: JSON.stringify({ error: m }) }], isError: true });
const fundMeta = q => { const k = String(q).trim().toUpperCase(); return CATALOG.funds.find(f => [f.id, f.isin, ...f.tickers].some(t => t.toUpperCase() === k)); };

async function parseBytes(u8, text, fmt) {
  const kind = sniff(u8, text ?? decodeBytes(u8)); const t = text ?? decodeBytes(u8);
  if (fmt && kind !== (fmt === 'nordnet-pdf' ? 'pdf' : fmt)) throw new Error(`Tunnistettu muoto "${kind}", odotettiin "${fmt}".`);
  if (kind === 'ishares') return parseIshares(t);
  if (kind === 'seligson') return parseSeligson(t);
  if (kind === 'pdf') { const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs'); return parseNordnetLines(await pdfLines(pdfjs, u8)); }
  throw new Error(`Muotoa ei tunnistettu (${kind}). Tuetut: iShares CSV/XML-xls, Seligson HTML/teksti, Nordnet PDF.`); }
async function save(id, rec) { await fs.mkdir(CACHE, { recursive: true }); await fs.writeFile(path.join(CACHE, id + '.json'), JSON.stringify(rec)); return rec; }
async function loadCached() { try { const fs_ = await fs.readdir(CACHE); return Promise.all(fs_.filter(f => f.endsWith('.json')).map(async f => JSON.parse(await fs.readFile(path.join(CACHE, f), 'utf8')))); } catch { return []; } }
const brief = r => ({ id: r.id, name: r.name, asOf: r.asOf, source: r.source, holdings: r.holdings.length, cachedAt: r.cachedAt, cacheFile: path.join(CACHE, r.id + '.json') });

const server = new McpServer({ name: 'lapivalaisu', version: '0.1.0' });
server.tool('list_supported_funds', 'Lists supported funds/ETFs with official issuer pages and download URLs, plus unsupported funds and why. Also shows which are cached locally.', {}, async () => {
  const c = Object.fromEntries((await loadCached()).map(r => [r.id, r.asOf]));
  return ok({ funds: supportedFunds().map(f => ({ ...f, cachedAsOf: c[f.id] ?? null })), unsupported: CATALOG.unsupported, cacheDir: CACHE }); });
server.tool('fetch_fund_holdings', "Downloads the issuer's public holdings file from its official URL ON THIS (the user's) MACHINE, parses it and caches it locally. This is the user's own fetch; nothing is sent to Läpivalaisu servers. Respect issuer terms; for personal use.",
  { fund: z.string().describe('Fund id, ticker or ISIN, e.g. EUNL, IE00B4L5Y983'), force: z.boolean().optional() }, async ({ fund, force }) => {
  const f = fundMeta(fund); if (!f) return fail(`Tuntematon rahasto: ${fund}. Katso list_supported_funds.`);
  const url = supportedFunds().find(s => s.id === f.id).downloadUrl; if (!url) return fail('Ei suoraa latausosoitetta; lataa tiedosto käsin ja käytä load_holdings_file.');
  if (!force) { const c = (await loadCached()).find(r => r.id === f.id); if (c && Date.now() - Date.parse(c.cachedAt) < 864e5) return ok({ fromCache: true, ...brief(c) }); }
  try { const res = await fetch(url, { headers: { 'User-Agent': UA } }); if (!res.ok) return fail(`Lataus epäonnistui HTTP ${res.status} (${url}). Lataa tiedosto selaimella ja käytä load_holdings_file.`);
    const u8 = new Uint8Array(await res.arrayBuffer()); const d = await parseBytes(u8, null, f.format);
    return ok({ fromCache: false, ...brief(await save(f.id, { id: f.id, name: f.name, isin: f.isin, ...d, source: url, cachedAt: new Date().toISOString() })) });
  } catch (e) { return fail(String(e.message || e)); } });
server.tool('load_holdings_file', 'Loads a holdings file the user already downloaded (local path) or pasted text, detects the format by content, parses and caches it locally.',
  { fund: z.string().describe('Fund id/ticker/ISIN this file belongs to'), path: z.string().optional(), text: z.string().optional() }, async ({ fund, path: p, text }) => {
  const f = fundMeta(fund); if (!f) return fail(`Tuntematon rahasto: ${fund}.`); if (!p && !text) return fail('Anna path tai text.');
  try { const u8 = p ? new Uint8Array(await fs.readFile(p)) : null; const d = await parseBytes(u8, text ?? null, f.format);
    return ok(brief(await save(f.id, { id: f.id, name: f.name, isin: f.isin, ...d, source: p ? 'file:' + path.resolve(p) : 'pasted text', cachedAt: new Date().toISOString() })));
  } catch (e) { return fail(String(e.message || e)); } });
server.tool('analyze_portfolio', 'Look-through analysis: combined top holdings, fund overlap, sector/country/currency, Helsinki dividend estimate with Finnish tax note. Uses locally cached fund holdings. Estimate, not investment advice.',
  { positions: z.array(z.object({ id: z.string().describe('Fund id/ticker/ISIN, or a direct stock name e.g. Nordea'), eur: z.number().positive() })),
    account: z.enum(['aot', 'ost']).default('aot').describe('aot = arvo-osuustili, ost = osakesäästötili'), top: z.number().int().min(1).max(200).optional() },
  async ({ positions, account, top }) => {
  try { const funds = await loadCached(); const r = analyze({ funds, positions, account, top });
    if (r.missingFunds.length) r.hint = `Lataa ensin: ${r.missingFunds.join(', ')} (fetch_fund_holdings).`; return ok(r); } catch (e) { return fail(String(e.message || e)); } });
await server.connect(new StdioServerTransport());
