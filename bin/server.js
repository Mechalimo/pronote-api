#!/usr/bin/env node

const server = require('../src/server');

if (process.argv.length === 2 && process.argv[1] === '--help') {
    console.log('Syntax: pronote-api-server [port (default: 21727)] [host (default: 0.0.0.0)]');
    return;
}

const port = parseInt(process.env.PORT, 10) || 10000;
const host = '0.0.0.0';

console.log('DEBUG: Valeur de process.env.PORT =', process.env.PORT);
console.log('DEBUG: Port utilisé =', port);

server(host, port).then(() => {
    console.log(`--> Listening on ${host}:${port}`);
}).catch(err => {
    console.error('Error during server start');
    console.error(err);
});
