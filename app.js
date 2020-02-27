// Define Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

// Content
const app = express();

// Import file routes config ./app/routes/*
const projects = require('./app/Routes/projects.route');

// Connect to DB
mongoose.connect(
    'mongodb+srv://admin:admin@rest-ytb-1ufyf.mongodb.net/test?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
    }
)

// Middleware
/** Set up morgan */
app.use(logger('dev'));

/** Set up bodyparser */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Set up Routes
app.use('/projects',projects);

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