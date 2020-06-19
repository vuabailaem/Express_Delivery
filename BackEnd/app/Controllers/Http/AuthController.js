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

router.get('/getRole', (req, res, next) => {
    const { headers } = req;
    const token = headers.authorization;
    AuthService.getRole(token)
        .then(role => {
            res.json(role);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});


module.exports = router;