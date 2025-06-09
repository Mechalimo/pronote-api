process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err);
    if (err.stack) {
        console.error(err.stack);
    }
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION:', reason);
    if (reason && reason.stack) {
        console.error(reason.stack);
    }
});

const { graphql } = require('graphql');

const http = require('./http');
const context = require('./context');
const getSchemas = require('./schemas');
const { login, logout, getSession } = require('./auth');

async function start(host, port)
{
    const schemas = await getSchemas();

    // Correction : http doit être une fonction (ancienne architecture)
    // Si tu utilises Polka/Express, remplace tout ce bloc par http.listen(port, ...)
    if (typeof http === 'function') {
        await http(host, port, {
            graphql: ({ query, variables }, token) => handle(token, schemas, query, context, variables),
            login: params => login(params),
            logout: (_, token) => logout(token)
        });
    } else if (http && typeof http.listen === 'function') {
        // Version Polka/Express classique (host ignoré)
        http.listen(port, () => {
            console.log(`Serveur lancé sur le port ${port} !`);
        });
    } else {
        throw new Error("Le module ./http n'est ni une fonction, ni un serveur compatible Express/Polka !");
    }
}

async function handle(token, schemas, query, context, variables)
{
    if (!token) {
        throw {
            http: 401,
            message: 'Missing \'Token\' header'
        };
    }

    if (!query) {
        throw {
            http: 400,
            message: 'Missing \'query\' field or \'Content-Type: application/json\' header'
        };
    }

    const session = getSession(token);
    if (!session) {
        throw {
            http: 401,
            message: 'Unknown session token'
        };
    }

    const schema = schemas[session.type.name];
    return await graphql(schema, query, context(session), null, variables);
}

module.exports = start;
