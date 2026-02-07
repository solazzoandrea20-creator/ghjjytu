const express = require('express');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

const TARGET = 'https://www.jerseys-catalog.com';

const CSS = `
<style>
.price,.product-price,.amount,.old-price,.special-price,span[class*="price"],div[class*="price"]{display:none!important;}
body > header > div{display:none!important;}
.copy{display:none!important;}
</style>
`;

app.use(async (req, res) => {
  try {
    const url = TARGET + req.originalUrl;

    const response = await fetch(url);
    const contentType = response.headers.get('content-type');

    if (contentType.includes('text/html')) {
      const html = await response.text();
      const $ = cheerio.load(html);

      $('head').append(CSS);

      // Riscrive tutti i link interni
      $('a').each((i, el) => {
        const href = $(el).attr('href');
        if (href && href.startsWith('/')) {
          $(el).attr('href', href);
        }
      });

      res.send($.html());
    } else {
      // immagini, css, js passano diretti
      const buffer = await response.buffer();
      res.set('Content-Type', contentType);
      res.send(buffer);
    }
  } catch (err) {
    res.status(500).send('Errore proxy');
  }
});

app.listen(PORT, () => {
  console.log('Proxy attivo su porta', PORT);
});
