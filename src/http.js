/* eslint no-console: off */

const polka = require('polka');
const body = require('body-parser');

function start(host, port, handlers)
{
    const server = polka();
    server.use(body.json());

    server.post('/auth/login', (req, res) => handle(req, res, handlers.login));
    server.post('/auth/logout', (req, res) => handle(req, res, handlers.logout));
    server.post('/graphql', (req, res) => handle(req, res, handlers.graphql));

    // Route REST pour Flutter (login direct)
    server.post('/login', async (req, res) => {
        const { url, username, password } = req.body;
        if (!url || !username || !password) {
            return respond(res, 400, { error: 'url, username, and password are required' });
        }
        try {
            // MODIFIE ICI :
            const { default: pronote } = require('../index.js');
            const session = await pronote.login(url, username, password, 'student'); // ou 'parent'
            if (session && session.user) {
                return respond(res, 200, { success: true, name: session.user.name });
            } else {
                return respond(res, 401, { error: "Identifiants invalides ou accès refusé" });
            }
        } catch (err) {
            return respond(res, 401, { error: err.message || "Erreur de connexion à Pronote" });
        }
    });

    return new Promise((resolve, reject) => {
        server.listen(port, host, err => {
            if (err) {
                return reject(err);
            }

            return resolve();
        })
    });
}

function handle(req, res, handler)
{
    handler(req.body, req.headers.token)
        .then(result => respond(res, 200, result))
        .catch(err => {
            console.error('Error during request handling :');
            console.error(err);

            if (err.message) {
                delete err.http;
                respond(res, err.http || 500, err);
            } else {
                respond(res, 500, {
                    message: 'Internal error : ' + err
                });
            }
        });
}

function respond(res, code, obj)
{
    const data = JSON.stringify(obj);
    const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(data)
    };

    res.writeHead(code, headers);
    res.end(data);
}

module.exports = start;
