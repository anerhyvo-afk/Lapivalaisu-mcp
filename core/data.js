// Rahastoluettelo, osinkotaulukko ja nimialiakset.
// Ei sisällä liikkeeseenlaskijoiden omistusrivejä.
// Alun perin tuotettu sivustorepositorion gen-data.mjs:llä (src/data). Sitä generaattoria
// ei ole tässä repossa, koska lähdehakemisto ei kuulu tähän pakettiin. Muokkaa tätä tiedostoa suoraan.
export const CATALOG = {
  "_doc": "Oma luettelo tuetuista rahastoista ja ohjeista. Ei sisällä omistustietoja.",
  "funds": [
    {
      "id": "EUNL",
      "name": "iShares Core MSCI World UCITS ETF (Acc)",
      "isin": "IE00B4L5Y983",
      "tickers": [
        "EUNL",
        "SWDA",
        "IWDA"
      ],
      "issuer": "iShares (BlackRock)",
      "format": "ishares",
      "page": "https://www.blackrock.com/fi/individual/products/251882",
      "steps": [
        "Avaa rahaston virallinen sivu (linkki alla). Valitse tarvittaessa sijoittajatyypiksi yksityissijoittaja ja maaksi Suomi.",
        "Siirry kohtaan Holdings / Omistukset.",
        "Lataa koko omistuslista CSV-muodossa (painike esim. ”Download” tai ”Detailed holdings”).",
        "Valitse ladattu .csv-tiedosto alla olevasta painikkeesta."
      ]
    },
    {
      "id": "IS3N",
      "name": "iShares Core MSCI EM IMI UCITS ETF (Acc)",
      "isin": "IE00BKM4GZ66",
      "tickers": [
        "IS3N",
        "EIMI"
      ],
      "issuer": "iShares (BlackRock)",
      "format": "ishares",
      "page": "https://www.blackrock.com/fi/individual/products/264659",
      "steps": [
        "Avaa rahaston virallinen sivu (linkki alla). Valitse tarvittaessa sijoittajatyypiksi yksityissijoittaja ja maaksi Suomi.",
        "Siirry kohtaan Holdings / Omistukset.",
        "Lataa koko omistuslista CSV-muodossa (painike esim. ”Download” tai ”Detailed holdings”).",
        "Valitse ladattu .csv-tiedosto alla olevasta painikkeesta."
      ]
    },
    {
      "id": "SXR8",
      "name": "iShares Core S&P 500 UCITS ETF (Acc)",
      "isin": "IE00B5BMR087",
      "tickers": [
        "SXR8",
        "CSPX"
      ],
      "issuer": "iShares (BlackRock)",
      "format": "ishares",
      "page": "https://www.blackrock.com/fi/individual/products/253743",
      "steps": [
        "Avaa rahaston virallinen sivu (linkki alla). Valitse tarvittaessa sijoittajatyypiksi yksityissijoittaja ja maaksi Suomi.",
        "Siirry kohtaan Holdings / Omistukset.",
        "Lataa koko omistuslista CSV-muodossa (painike esim. ”Download” tai ”Detailed holdings”).",
        "Valitse ladattu .csv-tiedosto alla olevasta painikkeesta."
      ]
    },
    {
      "id": "IUSQ",
      "name": "iShares MSCI ACWI UCITS ETF (Acc)",
      "isin": "IE00B6R52259",
      "tickers": [
        "IUSQ",
        "SSAC"
      ],
      "issuer": "iShares (BlackRock)",
      "format": "ishares",
      "page": "https://www.blackrock.com/fi/individual/products/251850",
      "steps": [
        "Avaa rahaston virallinen sivu (linkki alla). Valitse tarvittaessa sijoittajatyypiksi yksityissijoittaja ja maaksi Suomi.",
        "Siirry kohtaan Holdings / Omistukset.",
        "Lataa koko omistuslista CSV-muodossa (painike esim. ”Download” tai ”Detailed holdings”).",
        "Valitse ladattu .csv-tiedosto alla olevasta painikkeesta."
      ]
    },
    {
      "id": "SXRV",
      "name": "iShares Nasdaq 100 UCITS ETF (Acc)",
      "isin": "IE00B53SZB19",
      "tickers": [
        "SXRV",
        "CNDX"
      ],
      "issuer": "iShares (BlackRock)",
      "format": "ishares",
      "page": "https://www.blackrock.com/fi/individual/products/253741",
      "steps": [
        "Avaa rahaston virallinen sivu (linkki alla). Valitse tarvittaessa sijoittajatyypiksi yksityissijoittaja ja maaksi Suomi.",
        "Siirry kohtaan Holdings / Omistukset.",
        "Lataa koko omistuslista CSV-muodossa (painike esim. ”Download” tai ”Detailed holdings”).",
        "Valitse ladattu .csv-tiedosto alla olevasta painikkeesta."
      ]
    },
    {
      "id": "IUSN",
      "name": "iShares MSCI World Small Cap UCITS ETF",
      "isin": "IE00BF4RFH31",
      "tickers": [
        "IUSN",
        "WSML"
      ],
      "issuer": "iShares (BlackRock)",
      "format": "ishares",
      "page": "https://www.blackrock.com/fi/individual/products/296576",
      "steps": [
        "Avaa rahaston virallinen sivu (linkki alla). Valitse tarvittaessa sijoittajatyypiksi yksityissijoittaja ja maaksi Suomi.",
        "Siirry kohtaan Holdings / Omistukset.",
        "Lataa koko omistuslista CSV-muodossa (painike esim. ”Download” tai ”Detailed holdings”).",
        "Valitse ladattu .csv-tiedosto alla olevasta painikkeesta."
      ]
    },
    {
      "id": "SLG-OMXH25",
      "name": "Seligson & Co OMX Helsinki 25 ETF",
      "isin": "FI0008805627",
      "tickers": [
        "SLG-OMXH25",
        "SLG OMXH25",
        "OMXH25"
      ],
      "issuer": "Seligson & Co",
      "format": "seligson",
      "page": "https://www.seligson.fi/luotain/FundViewer.php?fid=4444&lang=0&task=intro&view=10",
      "steps": [
        "Avaa Seligsonin Rahastoluotaimen arvopaperilistaus (linkki alla).",
        "Tallenna sivu omalle koneellesi: Ctrl+S (Mac: Cmd+S) → ”Verkkosivu, vain HTML”.",
        "Valitse tallennettu .html-tiedosto alla olevasta painikkeesta – tai maalaa koko taulukko, kopioi ja liitä se tekstikenttään."
      ]
    },
    {
      "id": "SEL-SUOMI",
      "name": "Seligson & Co Suomi Indeksirahasto",
      "isin": "FI0008801758",
      "tickers": [
        "SEL-SUOMI"
      ],
      "issuer": "Seligson & Co",
      "format": "seligson",
      "page": "https://www.seligson.fi/luotain/FundViewer.php?fid=581&lang=0&task=intro&view=10",
      "steps": [
        "Avaa Seligsonin Rahastoluotaimen arvopaperilistaus (linkki alla).",
        "Tallenna sivu omalle koneellesi: Ctrl+S (Mac: Cmd+S) → ”Verkkosivu, vain HTML”.",
        "Valitse tallennettu .html-tiedosto alla olevasta painikkeesta – tai maalaa koko taulukko, kopioi ja liitä se tekstikenttään."
      ]
    },
    {
      "id": "SEL-EUROOPPA",
      "name": "Seligson & Co Eurooppa Indeksirahasto",
      "isin": "FI0008801774",
      "tickers": [
        "SEL-EUROOPPA"
      ],
      "issuer": "Seligson & Co",
      "format": "seligson",
      "page": "https://www.seligson.fi/luotain/FundViewer.php?fid=800&lang=0&task=intro&view=10",
      "steps": [
        "Avaa Seligsonin Rahastoluotaimen arvopaperilistaus (linkki alla).",
        "Tallenna sivu omalle koneellesi: Ctrl+S (Mac: Cmd+S) → ”Verkkosivu, vain HTML”.",
        "Valitse tallennettu .html-tiedosto alla olevasta painikkeesta – tai maalaa koko taulukko, kopioi ja liitä se tekstikenttään."
      ]
    },
    {
      "id": "SEL-BRANDS",
      "name": "Seligson & Co Global Top 25 Brands",
      "isin": "FI0008801790",
      "tickers": [
        "SEL-BRANDS"
      ],
      "issuer": "Seligson & Co",
      "format": "seligson",
      "page": "https://www.seligson.fi/luotain/FundViewer.php?fid=795&lang=0&task=intro&view=10",
      "steps": [
        "Avaa Seligsonin Rahastoluotaimen arvopaperilistaus (linkki alla).",
        "Tallenna sivu omalle koneellesi: Ctrl+S (Mac: Cmd+S) → ”Verkkosivu, vain HTML”.",
        "Valitse tallennettu .html-tiedosto alla olevasta painikkeesta – tai maalaa koko taulukko, kopioi ja liitä se tekstikenttään."
      ]
    },
    {
      "id": "NN-SUOMI",
      "name": "Nordnet Suomi Indeksi",
      "isin": "SE0005993102",
      "tickers": [
        "NN-SUOMI"
      ],
      "issuer": "Nordnet Fonder",
      "format": "nordnet-pdf",
      "page": "https://nordnetab.com/funds/our-funds/",
      "steps": [
        "Avaa Nordnet Fonderin rahastoluettelo (linkki alla) ja etsi Nordnet Suomi Indeksi.",
        "Lataa uusin puolivuosikatsaus (Biannual report) tai vuosikertomus (Annual report) PDF-muodossa.",
        "Valitse PDF alla olevasta painikkeesta. Omistukset luetaan katsauksen salkkuluettelosta (päivä näkyy tuloksissa)."
      ]
    }
  ],
  "unsupported": [
    {
      "name": "Vanguard FTSE All-World (VWCE)",
      "why": "Vanguardin sivuston ehdot kieltävät tietojen kopioinnin; tuki harkitaan, jos Vanguard antaa luvan."
    },
    {
      "name": "Nordnet Indeksirahasto Global (IE00BMTD2K75)",
      "why": "Swap-pohjainen rahasto: julkaistut omistukset ovat vakuuskori, eivät indeksi – läpivalaisu olisi harhaanjohtava."
    }
  ]
};
export const DIVIDENDS = {
  "_doc": "Oma taulukko: tilikaudelta 2025 päätetty osinko €/osake yhtiöiden omista tiedotteista. Ei hintoja – tuotto lasketaan selaimessa käyttäjän omista tiedostoista.",
  "companies": {
    "NORDEA": {
      "dps": 0.96,
      "note": "Varsinainen osinko; hallituksella valtuutus puolivuosiosinkoon (ei mukana)",
      "src": "https://www.nordea.com/fi/media/2026-03-24/nordean-varsinainen-yhtiokokous-2026-ja-hallituksen-jarjestaytymiskokouksen-paatokset"
    },
    "SAMPO": {
      "dps": 0.36,
      "src": "https://www.sampo.com/fi/hallinnointi/yhtiokokous/yhtiokokous-2026/"
    },
    "NOKIA": {
      "dps": 0.14,
      "note": "Hallituksen valtuutus enintään 0,14 €, neljässä erässä",
      "src": "https://www.nokia.com/newsroom/fi-fi/nokia-oyjn-varsinaisen-yhti%C3%B6kokouksen-p%C3%A4%C3%A4t%C3%B6kset-ja-hallituksen-j%C3%A4rjest%C3%A4ytymiskokouksen-p%C3%A4%C3%A4t%C3%B6kset/"
    },
    "KONE": {
      "dps": 1.8,
      "note": "B-osake (A-osake 1,7975 €)",
      "src": "https://www.kone.com/global/fi/uutishuone/tiedotteet/2026/kone-oyj-n-varsinaisen-yhtiokokouksen-paatoksia-2026-03-05.html"
    },
    "WARTSILA": {
      "dps": 1.06,
      "note": "Perusosinko 0,54 + lisäosinko 0,52",
      "src": "https://www.wartsila.com/fi/media-fi/uutinen/12-03-2026-wartsilan-varsinaisen-yhtiokokouksen-ja-hallituksen-paatokset-3728536"
    },
    "UPM": {
      "dps": 1.5,
      "src": "https://www.upm.com/fi/ajankohtaista/tiedotteet/2026/04/upm-kymmene-oyjn-varsinaisen-yhtiokokouksen-paatokset/"
    },
    "METSO": {
      "dps": 0.4,
      "src": "https://www.metso.com/fi/yritys/sijoittajat/hallinnointi/yhtiokokous/2026/"
    },
    "ORION": {
      "dps": 1.8,
      "src": "https://production.orion.fi/fi/uutishuone/kaikki-uutiset/tiedotteet/porssitiedotteet/2026/orion-oyjn-varsinaisen-yhtiokokouksen-ja-hallituksen-jarjestaytymiskokouksen-paatokset-24.3.2026"
    },
    "ELISA": {
      "dps": 2.4,
      "note": "Enintään 2,40 €, neljässä erässä",
      "src": "https://elisa.fi/yhtiotieto/sijoittajille/osake/porssitiedotteet/elisan-varsinaisen-yhti%C3%B6kokouksen-2026-p%C3%A4%C3%A4t%C3%B6kset/98A50D493A0088AD"
    },
    "KESKO": {
      "dps": 0.9,
      "src": "https://www.kesko.fi/media/uutiset-ja-tiedotteet/porssitiedotteet/2026/kesko-oyjn-varsinaisen-yhtiokokouksen-paatokset/"
    },
    "VALMET": {
      "dps": 1.35,
      "src": "https://www.valmet.com/fi/uutiset/porssitiedotteet/2026/valmet-oyjn-varsinaisen-yhtiokokouksen-ja-hallituksen-jarjestaytymiskokouksen-paatokset/"
    },
    "KONECRANES": {
      "dps": 2.25,
      "note": "Osakesplitti päätetty – tuotto voi vääristyä, jos hinta on splitin jälkeen",
      "src": "https://www.konecranes.com/fi/press-releases/konecranes-oyjn-varsinaisen-yhtiokokouksen-paatokset-yhtiokokous-paatti-osakesplitista"
    },
    "STORA ENSO": {
      "dps": 0.25,
      "src": "https://www.storaenso.com/en/newsroom/regulatory-and-investor-releases/2026/3/resolutions-by-stora-enso-oyjs-annual-general-meeting-and-the-organising-meeting-of-the-board-of-directors"
    },
    "HUHTAMAKI": {
      "dps": 1.14,
      "src": "https://www.huhtamaki.com/fi/media/nasdaq/stock-exchange-release/2026/huhtamaki-oyjn-varsinaisen-yhtiokokouksen-ja-hallituksen-jarjestaytymiskokouksen-paatokset/"
    },
    "OUTOKUMPU": {
      "dps": 0.13,
      "src": "https://www.outokumpu.com/fi-fi/news/2026/outokummun-varsinaisen-yhtiokokouksen-2026-paatokset-3733934"
    },
    "KEMIRA": {
      "dps": 0.76,
      "src": "https://www.kemira.com/fi/ajankohtaista/uutishuone/tiedotteet/kemira-oyj-varsinaisen-yhtiokokouksen-2026-paatokset/"
    },
    "NESTE": {
      "dps": 0.2,
      "src": "https://www.neste.com/fi-fi/sijoittajille/hallinnointi/yhtiokokoukset/yhtiokokous-2026"
    },
    "FORTUM": {
      "dps": 0.74,
      "src": "https://www.fortum.com/fi/tietoa-meista/sijoittajille/varsinainen-yhtiokokous"
    },
    "KALMAR": {
      "dps": 1.1,
      "note": "B-osake",
      "src": "https://www.kalmar.fi/news--insights/lehdistotiedotteet/2026/kalmar-oyjn-vuoden-2026/"
    },
    "NOKIAN RENKAAT": {
      "dps": 0.25,
      "src": "https://yritys.nokianrenkaat.fi/uutiset-ja-media/uutinen/nokian-renkaat-oyj-n-varsinaisen-yhtiokokouksen-paatokset-9/"
    },
    "LUMO KODIT": {
      "dps": 0.11,
      "src": "https://yritys.lumo.fi/mediatiedotteet-ja-uutiset/kojamo-oyjn-varsinaisen-yhtiokokouksen-ja-hallituksen-jarjestaytymiskokouksen-paatokset-kojamon-uusi-toiminimi-lumo-kodit-oyj/"
    },
    "TOKMANNI": {
      "dps": 0.34,
      "src": "https://tokmannigroup.com/sijoittajat/hallinnointi/yhtiokokoukset/yhtiokokous-2026/"
    }
  }
};
export const ALIASES = {
  "_doc": "Normalisoitu nimi -> liikkeeseenlaskijan avain. Yhdistää osakesarjat (A/B/C) ja nimimuunnokset. Laajennettava; ISIN-tasoa ei saatavilla lähdetiedostoissa.",
  "ALPHABET": "ALPHABET",
  "ALPHABET INC": "ALPHABET",
  "BERKSHIRE HATHAWAY": "BERKSHIRE HATHAWAY",
  "NORDEA BANK": "NORDEA",
  "NORDEA": "NORDEA",
  "NOKIA": "NOKIA",
  "SAMPO": "SAMPO",
  "KONE": "KONE",
  "ORION": "ORION",
  "KESKO": "KESKO",
  "STORA ENSO": "STORA ENSO",
  "UPM KYMMENE": "UPM",
  "UPM": "UPM",
  "WARTSILA": "WARTSILA",
  "METSO": "METSO",
  "METSO OUTOTEC": "METSO",
  "TIETO": "TIETO",
  "TIETOEVRY": "TIETO",
  "TIETOEVRY CORP": "TIETO",
  "KOJAMO": "LUMO KODIT",
  "LUMO KODIT": "LUMO KODIT",
  "HIAB": "HIAB",
  "KALMAR": "KALMAR",
  "MANDATUM": "MANDATUM",
  "ELISA": "ELISA",
  "KONECRANES": "KONECRANES",
  "VALMET": "VALMET",
  "HUHTAMAKI": "HUHTAMAKI",
  "KEMIRA": "KEMIRA",
  "OUTOKUMPU": "OUTOKUMPU",
  "NOKIAN RENKAAT": "NOKIAN RENKAAT",
  "NOKIAN TYRES": "NOKIAN RENKAAT",
  "NESTE": "NESTE",
  "FORTUM": "FORTUM",
  "QT": "QT GROUP",
  "QT GROUP": "QT GROUP",
  "SSAB": "SSAB",
  "TOKMANNI": "TOKMANNI",
  "META PLATFORMS": "META PLATFORMS",
  "TAIWAN SEMICONDUCTOR MANUFACTURING": "TSMC",
  "SHELL": "SHELL",
  "ROYAL DUTCH SHELL": "SHELL",
  "ROCHE": "ROCHE",
  "NESTLE": "NESTLE",
  "NOVO NORDISK": "NOVO NORDISK",
  "SAMSUNG ELECTRONICS": "SAMSUNG ELECTRONICS"
};
