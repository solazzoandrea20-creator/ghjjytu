const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.get('/*', async (req, res) => {
  try {
    const targetUrl = req.originalUrl.slice(1);

    const response = await axios.get(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121 Safari/537.36",
        "Accept-Language": "it-IT,it;q=0.9,en;q=0.8",
        "Referer": targetUrl,
      },
    });

    const $ = cheerio.load(response.data);

    // QUI METTI IL TUO CSS DI PULIZIA
    $('body').append(`
      <style>
        /* INCOLLA QUI IL TUO CSS */
      </style>
    `);

    res.send($.html());
  } catch (err) {
    console.log(err.message);
    res.send("Errore proxy: " + err.message);
  }
});

app.listen(10000, () => {
  console.log("Proxy attivo su porta 10000");
});
