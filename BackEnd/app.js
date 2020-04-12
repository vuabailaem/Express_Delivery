// Define Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();
global.Env = process.env;

// Content
const app = express();
const cors = require('cors');
app.use(cors());

/** Set up bodyparser */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/api/dangnhap', function(req, res) {
    if(req.body.username == 'tuanlm' && req.body.password == '1234'){
        const token = jwt.sign({ten: 'leminhtuan'},'tuanlm',{algorithm: 'HS256', expiresIn: '3h'})
        res.json({access_token:token});
    } else {
        res.send('Dang nhap that bai');
    }
});

// app.use(function(req, res, next) {
//     const token = req.headers.authorization;
//     if(!token) {
//         return res.json({
//             message: 'TOKEN_UNAVAILABLE',
//             data: null
//         });
//     }
//     jwt.verify(token, 'tuanlm', function(err, dataToken){
//         if(err)
//             return res.status(403).send({
//                 message:'Token invalid'
//             });
//         else 
//             return next();
//     });
// });

app.get('/api/test', function(req, res) {
    res.send('Day la api test.');    
});

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