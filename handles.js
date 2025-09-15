const url = require('url');
const fs = require('fs');
const path = require('path');

function sendJSON(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data, null, 2));
}

function send404(res, pathname = '') {
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(
    `<!doctype html>
<html lang="fr">
  <head><meta charset="utf-8"><title>404</title></head>
  <body>
    <h1>404 – Introuvable</h1>
    <p>Le chemin <code>${pathname}</code> n’existe pas.</p>
    <p><a href="/">Retour à l’accueil</a></p>
  </body>
</html>`
  );
}

function serveJsonFile(res, name) {
  // Sécurise le nom: lettres/chiffres/-,_ uniquement
  if (!/^[a-z0-9_-]+$/i.test(name)) {
    return send404(res, `/${name}`);
  }

  const filePath = path.join(__dirname, 'content', `${name}.json`);
  if (!fs.existsSync(filePath)) {
    return send404(res, `/${name}`);
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(raw);
    return sendJSON(res, json);
  } catch (err) {
    // Si JSON invalide → 500
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Erreur lors de la lecture de ${name}.json : ${err.message}`);
  }
}

function home(res) {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(
    `<!doctype html>
<html lang="fr">
  <head><meta charset="utf-8"><title>Accueil</title></head>
  <body>
    <h1>Accueil</h1>
    <ul>
      <li><a href="/hello?name=John">/hello?name=John</a></li>
      <li><a href="/about">/about</a> (sert content/about.json)</li>
      <li><a href="/contact">/contact</a> (si tu crées content/contact.json)</li>
      <li><a href="/zzzz">/zzzz</a> (doit renvoyer 404 si le JSON n’existe pas)</li>
    </ul>
  </body>
</html>`
  );
}

function hello(req, res, params) {
  const name = params.name ? String(params.name) : 'anonymous';
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(`Hello ${name}`);
}

function serverHandle(req, res) {
  const route = url.parse(req.url);
  const pathname = route.pathname;
  const params = new URLSearchParams(route.query || '');

  // 1) Accueil
  if (pathname === '/') return home(res);

  // 2) /hello (avec query ?name=...)
  if (pathname === '/hello') return hello(req, res, Object.fromEntries(params));

  // 3) Route fixe /about -> content/about.json
  if (pathname === '/about') return serveJsonFile(res, 'about');

  // 4) Routage dynamique : /xxx -> content/xxx.json (si présent)
  //    Exclusions : /favicon.ico etc.
  if (pathname && pathname !== '/favicon.ico') {
    const name = pathname.slice(1); // retire le premier '/'
    return serveJsonFile(res, name);
  }

  // 5) Sinon 404
  return send404(res, pathname);
}

module.exports = { serverHandle };
