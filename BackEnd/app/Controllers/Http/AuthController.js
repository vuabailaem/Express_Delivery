const express = require('express');
const router = express.Router();
const AuthService = require('../../Services/AuthService');

//login
router.post('/login', (req, res, next) => {
    const body = req.body;
    AuthService.login(body)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});