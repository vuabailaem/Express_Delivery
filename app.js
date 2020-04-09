// Define Dependencies
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
global.Env = process.env;

// Content
const app = express();
const cors = require('cors');
app.use(cors());

/** Set up bodyparser */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Import file routes config ./app/routes/*
// const projects = require('./app/Routes/projects.route');

//Config directory controller
const controllers = require(__dirname + '/app/controllers');
app.use(controllers);

//server
const http = require('http').Server(app);

// Connect to DB

// Middleware
/** Set up morgan */
// app.use(logger('dev'));


//Set up Routes
// app.use('/projects',projects);

http.listen(Env.PORT, () => {
    console.log(`Server run at port: ${Env.PORT}`);
});


// Cast 404 Errors and forward them to error handler
app.use((req, res, next) => {
    const err = new Error('Not found!');
    err.status = 404;
    next(err);
});

// Error handler function
app.use((req, res, next) => {
    const error = app.get('env') === 'development' ? err : {};
    const status = err.status || 500;

    // Respone to client
    res.status(status).json({
        error: {
            message: error.message
        }
    });
});

// Modules exports
module.exports = app;