// Savutesti: käynnistää MCP-palvelimen, tarkistaa työkalut ja laskennan
// keinotekoisella aineistolla. Ei lataa eikä tallenna liikkeeseenlaskijan omistustiedostoja.
// Valinnainen verkkolataus: LAPIVALAISU_SMOKE_FETCH=1
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const cache = await fs.mkdtemp(path.join(os.tmpdir(), 'lapivalaisu-smoke-'));

const ISHARES = [
  'Holdings as of,15/Jan/2026',
  'Name,Weight (%),Sector,Asset Class,Location,Market Currency,Price',
  'Nordea Bank Abp,55,Financials,Equity,Finland,EUR,10.00',
  'Sample Holdings Inc,45,Information Technology,Equity,United States,USD,20.00',
  '',
].join('\n');

const SELIGSON = [
  'Arvopaperien listaus päivitetty 15.01.2026',
  'Nordea\tSuomi\tRahoitus\tkpl\t12,5',
  'Nokia\tSuomi\tTeknologia\tkpl\t8,0',
  '',
].join('\n');

const EXPECTED_TOOLS = ['list_supported_funds', 'fetch_fund_holdings', 'load_holdings_file', 'analyze_portfolio'];

function fail(msg) {
  console.error('SMOKE FAIL:', msg);
  process.exitCode = 1;
  throw new Error(msg);
}

const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
if (typeof pdfjs.getDocument !== 'function') fail('pdfjs-dist legacy build missing getDocument');

const core = await import('@lapivalaisu/core');
if (typeof core.analyze !== 'function' || typeof core.parseIshares !== 'function' || typeof core.supportedFunds !== 'function') {
  fail('core exports missing');
}

const transport = new StdioClientTransport({
  command: 'node',
  args: [path.join(here, 'server.js')],
  cwd: here,
  stderr: 'pipe',
  env: { ...process.env, LAPIVALAISU_CACHE: cache },
});
transport.stderr?.on('data', (chunk) => process.stderr.write(chunk));

const client = new Client({ name: 'lapivalaisu-smoke', version: '0.1.0' });
try {
  await client.connect(transport);

  const tools = (await client.listTools()).tools.map((t) => t.name).sort();
  console.log('tools:', tools.join(', '));
  for (const name of EXPECTED_TOOLS) if (!tools.includes(name)) fail(`missing tool ${name}`);

  const call = async (name, args = {}) => {
    const result = await client.callTool({ name, arguments: args });
    const text = result.content?.[0]?.text ?? '';
    if (result.isError) fail(`${name}: ${text}`);
    return JSON.parse(text);
  };

  const listed = await call('list_supported_funds');
  if (!Array.isArray(listed.funds) || listed.funds.length !== core.supportedFunds().length) {
    fail(`fund count ${listed.funds?.length}`);
  }
  if (listed.funds.some((f) => f.holdings || f.positions)) fail('catalog leaked holdings');
  console.log('funds:', listed.funds.length);

  const ishares = await call('load_holdings_file', { fund: 'EUNL', text: ISHARES });
  if (ishares.holdings !== 2) fail(`ishares holdings ${ishares.holdings}`);
  const seligson = await call('load_holdings_file', { fund: 'OMXH25', text: SELIGSON });
  if (seligson.holdings !== 2) fail(`seligson holdings ${seligson.holdings}`);

  const cached = await call('fetch_fund_holdings', { fund: 'IE00B4L5Y983' });
  if (!cached.fromCache || cached.holdings !== 2) fail(`expected cache hit, got ${JSON.stringify(cached)}`);

  const analysis = await call('analyze_portfolio', {
    positions: [
      { id: 'EUNL', eur: 20000 },
      { id: 'SLG-OMXH25', eur: 5000 },
      { id: 'Nordea', eur: 2000 },
    ],
    account: 'ost',
    top: 5,
  });
  if (analysis.summary?.totalEur !== 27000) fail(`total ${analysis.summary?.totalEur}`);
  if (!analysis.overlap?.some((o) => o.weightedOverlapPct > 0)) fail('no overlap');
  if (analysis.missingFunds?.length) fail(`missing funds ${analysis.missingFunds.join(',')}`);
  if (!(analysis.dividends?.estimatedAnnualEur > 0)) fail('dividend estimate missing');
  if (analysis.account !== 'ost') fail(`account ${analysis.account}`);
  if (!analysis.disclaimer) fail('disclaimer missing');
  console.log(JSON.stringify({
    summary: analysis.summary,
    top: analysis.topHoldings.map((t) => `${t.name} ${t.pct}%`),
    overlap: analysis.overlap,
    dividends: analysis.dividends.estimatedAnnualEur,
    account: analysis.account,
  }, null, 2));

  if (process.env.LAPIVALAISU_SMOKE_FETCH === '1') {
    for (const fund of ['EUNL', 'SLG-OMXH25', 'NN-SUOMI']) {
      const live = await call('fetch_fund_holdings', { fund, force: true });
      console.log('live', fund, live.holdings, live.asOf || '');
      if (!live.holdings) fail(`live fetch empty for ${fund}`);
    }
  }

  console.log('SMOKE OK');
} finally {
  await client.close().catch(() => {});
  await fs.rm(cache, { recursive: true, force: true });
}
