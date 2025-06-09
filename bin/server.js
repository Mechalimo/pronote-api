#!/usr/bin/env node

/* eslint no-console: off */

const server = require('../src/server');

if (process.argv.length === 2 && process.argv[1] === '--help') {
    console.log('Syntax: pronote-api-server [port (default: 21727)] [host (default: 0.0.0.0)]');
    return;
}

const port = parseInt(process.env.PORT, 10) || parseInt(process.argv[2], 10) || 21727;
const host = '0.0.0.0';

server(host, port).then(() => {
    console.log(`--> Listening on ${host}:${port}`);
}).catch(err => {
    console.error('Error during server start');
    console.error(err);
});
