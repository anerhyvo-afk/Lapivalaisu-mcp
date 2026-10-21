# Läpivalaisu

Läpivalaisu on työkalu suomalaiselle sijoittajalle. Se näyttää, mitä ETF:n, suomalaisen rahaston ja suoran Helsingin pörssin osakkeen takana on: yhdistetyt omistukset, rahastojen päällekkäisyys, sektori-, maa- ja valuuttajakauma sekä arvio osingoista. Osinko-osuudessa on huomio suomalaisesta verotuksesta arvo-osuustilillä (`aot`) ja osakesäästötilillä (`ost`).

Tämä repositorio on avoimen lähdekoodin MCP-palvelin ja sen laskentaydin. Palvelin käynnistyy omalla koneellasi stdio-rajapinnalla. Sama analyysi on selaimessa osoitteessa [lapivalaisu.pages.dev](https://lapivalaisu.pages.dev). HTTP-rajapinta: [lapivalaisu.pages.dev/api/analyze](https://lapivalaisu.pages.dev/api/analyze). Kuvaus: [lapivalaisu.pages.dev/openapi.json](https://lapivalaisu.pages.dev/openapi.json).

Tulos on arvio, ei sijoitusneuvonta.

## Liikkeeseenlaskijoiden tiedostot

`fetch_fund_holdings` hakee liikkeeseenlaskijan julkisen tiedoston **sinun koneeltasi** virallisesta osoitteesta ja tallentaa sen vain paikalliseen välimuistiin (`~/.cache/lapivalaisu`, tai hakemisto jonka annat muuttujalla `LAPIVALAISU_CACHE`). Mitään ei lähetetä Läpivalaisun palvelimelle.

**Tämä repositorio ei sisällä eikä jaa edelleen liikkeeseenlaskijoiden omistustietoja.** Mukana ei ole CSV-, PDF-, XLS- eikä HTML-omistuslistoja. `core/data.js` on oma luettelo tuetuista rahastoista, latausohjeista ja osinkotaulukosta. Siinä ei ole omistusrivejä.

Noudata kunkin liikkeeseenlaskijan käyttöehtoja. Lataus on tarkoitettu henkilökohtaiseen käyttöön.

## Vaatimukset

- Node.js 20 tai uudempi

## Asennus

```bash
cd mcp
npm install
node test-client.mjs
```

Savutesti käynnistää palvelimen, tarkistaa työkalut ja ajaa analyysin pienellä keinotekoisella aineistolla. Se ei lataa liikkeeseenlaskijoiden tiedostoja.

MCP-asiakas käynnistää palvelimen itse. Käsin sen voi käynnistää komennolla `node server.js` (stdio, ei HTTP-porttia).

## MCP-asiakkaan asetukset

Korvaa polku kloonatun repositorion `mcp/server.js`-tiedoston absoluuttisella polulla.

### Claude Desktop

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "lapivalaisu": {
      "command": "node",
      "args": ["/absoluuttinen/polku/Lapivalaisu-mcp/mcp/server.js"]
    }
  }
}
```

### Cursor

Projektissa `.cursor/mcp.json` tai käyttäjän asetuksissa `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "lapivalaisu": {
      "command": "node",
      "args": ["/absoluuttinen/polku/Lapivalaisu-mcp/mcp/server.js"]
    }
  }
}
```

Välimuistin paikan voi vaihtaa `env`-kentällä:

```json
{
  "mcpServers": {
    "lapivalaisu": {
      "command": "node",
      "args": ["/absoluuttinen/polku/Lapivalaisu-mcp/mcp/server.js"],
      "env": {
        "LAPIVALAISU_CACHE": "/absoluuttinen/polku/lapivalaisu-cache"
      }
    }
  }
}
```

## Työkalut

| Työkalu | Kuvaus |
| --- | --- |
| `list_supported_funds` | Listaa tuetut rahastot ja ETF:t: nimi, ISIN, tickerit, virallinen sivu, latausosoite ja se, onko omistuslista jo paikallisessa välimuistissa. Mukana myös rahastot, joita ei tueta, ja syy. |
| `fetch_fund_holdings` | Lataa liikkeeseenlaskijan julkisen omistustiedoston virallisesta osoitteesta tällä koneella, jäsentää sen ja tallentaa välimuistiin. `fund`: tunnus, ticker tai ISIN (esim. `EUNL`, `IE00B4L5Y983`). `force` (valinnainen): ohita alle vuorokauden ikäinen välimuisti. |
| `load_holdings_file` | Lukee tiedoston, jonka olet jo ladannut (`path`), tai liitetyn tekstin (`text`). Tunnistaa muodon sisällöstä, jäsentää ja tallentaa välimuistiin. `fund`: mihin rahastoon tiedosto kuuluu. |
| `analyze_portfolio` | Läpivalaisu välimuistin omistuksista: suurimmat yhdistetyt omistukset, rahastojen päällekkäisyys, sektori, maa ja valuutta sekä Helsingin pörssin osinko ja suomalainen verohuomio. `positions`: taulukko `{ "id", "eur" }`. `account`: `aot` (arvo-osuustili) tai `ost` (osakesäästötili). `top` (valinnainen): montako omistusta palautetaan. |

Suora osake annetaan nimellä, esimerkiksi `{ "id": "Nordea", "eur": 2000 }`. Rahasto annetaan tunnuksella, tickerillä tai ISINillä.

Tuetut muodot: iSharesin (BlackRock) omistus-CSV tai vastaava taulukko, Seligson & Co:n arvopaperilistaus (tallennettu HTML tai kopioitu taulukko) ja Nordnet Suomi Indeksin puolivuosi- tai vuosikatsauksen PDF. Jos suoralla latausosoitteella ei ole tiedostoa, lataa se itse liikkeeseenlaskijan sivulta ja käytä `load_holdings_file`.

## Rakenne

- `core/` — jäsentimet, laskenta ja luettelo (`data.js`). Paketti `@lapivalaisu/core`, jonka `mcp` ottaa riippuvuudeksi polusta `file:../core`.
- `mcp/` — stdio-MCP-palvelin (`server.js`) ja savutesti (`test-client.mjs`).

`core/data.js` on ylläpidettävä luettelo. Sivustorepositorion `gen-data.mjs` luki hakemistoa `src/data`, jota ei ole tässä paketissa, joten generaattori on jätetty pois. Muokkaa `data.js`-tiedostoa suoraan.

## English

Look-through analysis for Finnish investors: ETFs, Finnish funds, and Helsinki-listed stocks. This MCP server runs on your own machine. It reports combined holdings, fund overlap, sector, country and currency exposure, and a dividend estimate with a Finnish tax note (share account vs. equity savings account).

The tool fetches issuer files on the user's own machine and caches them locally. This repository does not include or redistribute issuer holdings data. Follow each issuer's terms. Results are estimates, not investment advice.

```bash
cd mcp && npm install && node test-client.mjs
```

Point Claude Desktop or Cursor at `mcp/server.js` using the JSON snippets above.

- Web: https://lapivalaisu.pages.dev
- API: https://lapivalaisu.pages.dev/api/analyze
- OpenAPI: https://lapivalaisu.pages.dev/openapi.json

MIT License. Copyright 2026 Antti Hyvönen.
