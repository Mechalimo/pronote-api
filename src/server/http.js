const polka = require('polka');
const body = require('body-parser'); // si tu utilises Polka, sinon 'express.json()' avec Express
const { respond } = require('./helpers'); // adapte si ta logique de réponse est différente

const server = polka();

// Middleware pour parser le JSON
server.use(body.json());

// Route de test (optionnel)
server.get('/', (req, res) => {
  respond(res, 200, { status: "API Pronote en ligne" });
});

// Route /login
server.post('/login', async (req, res) => {
  // Log pour debug
  console.log('POST /login body:', req.body);

  // Déstructure avec fallback pour éviter les undefined
  const { url, username, password } = req.body || {};
  if (!url || !username || !password) {
    return respond(res, 400, { error: 'url, username, and password are required' });
  }

  // On tente la connexion Pronote
  try {
    const pronote = require('../../index.js'); // adapte le chemin si besoin
    const session = await pronote.login(url, username, password, 'none');
    console.log('Résultat login Pronote:', session);

    if (session && session.user) {
      return respond(res, 200, {
        success: true,
        name: session.user.name,
        // Ajoute d'autres infos utiles si besoin
      });
    } else {
      return respond(res, 401, { error: "Identifiants invalides ou accès refusé" });
    }
  } catch (err) {
    // Log de l'erreur backend pour debug
    console.error('Erreur login Pronote:', err);
    return respond(res, 401, { error: err.message || "Erreur de connexion à Pronote" });
  }
});

// Exporte pour bin/server.js
module.exports = server;
