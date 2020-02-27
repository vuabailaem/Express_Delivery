// Define Dependencies
const http = require('http');
const app = require('./app');

// Define PORT
const port = process.env.PORT || 8888;

// Create a server
const server = http.createServer(app);

// List a port ???
server.listen(port);

/**
 * Note: This app want to run command: npm start
 * 
 */