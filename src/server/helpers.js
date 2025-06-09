// src/server/helpers.js

/**
 * Envoie une réponse HTTP JSON avec le bon code.
 * @param {object} res - l'objet réponse (polka ou express)
 * @param {number} status - code HTTP
 * @param {object} data - objet à envoyer en JSON
 */
function respond(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

module.exports = { respond };
