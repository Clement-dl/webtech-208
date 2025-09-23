// serveur/src/app.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const articlesRouter = require('./routes/articles');

const app = express();
app.use(express.json());

// Accueil (liens)
app.get('/', (req, res) => {
  res.type('text/html').send(`
    <h1>WebTech-208 API</h1>
    <p>Routes utiles :</p>
    <ul>
      <li><a href="/hello?name=John">/hello?name=John</a></li>
      <li><a href="/about">/about</a> (lit content/about.json)</li>
      <li><a href="/articles">/articles</a> (API JSON)</li>
    </ul>
  `);
});

// Continuité lab2
app.get('/hello', (req, res) => {
  const name = String(req.query.name || 'anonymous');
  res.type('text/plain').send(`Hello ${name}`);
});

app.get('/about', (req, res, next) => {
  try {
    const file = path.join(__dirname, '..', '..', 'content', 'about.json');
    if (!fs.existsSync(file)) {
      return res.status(404).type('text/plain').send('about.json manquant');
    }
    const json = JSON.parse(fs.readFileSync(file, 'utf-8'));
    res.json(json);
  } catch (err) {
    next(err);
  }
});

// API lab3 
app.use('/articles', articlesRouter);

// 404 générique
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Erreurs
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error', details: err?.message });
});

module.exports = app;
