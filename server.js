const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 10000;
const TARGET = "https://www.jerseys-catalog.com";

app.get('*', async (req, res) => {
  try {
    const path = req.originalUrl === '/' ? '' : req.originalUrl;
    const url = TARGET + path;

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121 Safari/537.36",
        "Accept-Language": "it-IT,it;q=0.9,en;q=0.8",
      },
      responseType: 'arraybuffer'
    });

    const contentType = response.headers['content-type'];

    // Se NON è HTML (immagini, css, js) passa diretto
    if (!contentType.includes('text/html')) {
      res.set('Content-Type', contentType);
      return res.send(response.data);
    }

    const html = response.data.toString();
    const $ = cheerio.load(html);

    // Inseriamo il tuo CSS
    $('head').append(`
      <style>
      /* IL TUO CSS QUI */
      </style>
    `);

    res.send($.html());

  } catch (err) {
    console.log(err.message);
    res.send("Errore proxy: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log("Proxy attivo su porta " + PORT);
});
