const express = require('express');
const router = express.Router();
const CustomerService = require('../../Services/CustomerService');
const RequestService = require('../../Services/RequestsService');
const AuthenMiddleware = require('../../Middlewares/AuthMiddleware');
const NotificationService = require('../../Services/NotificationService');
const jwt = require('jsonwebtoken');


router.post('/add', (req, res, next) => {
    CustomerService.add(req.body)
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        console.log(err);
        res.json(err);
    })
});

router.use((req, res, next) => {
    AuthenMiddleware.authCustomer({req, res, next});
});

router.get('/getMyData', (req, res, next) => {
    const userId = req.customer.id;
    CustomerService.getData(userId)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});

router.get('/getMyRequests', (req, res, next) => {
    const userId = req.customer.id;
    CustomerService.getMyRequest(userId)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});


router.put('/edit', (req, res, next) => {
    const { headers } = req;
    const token = headers.authorization;
    const dataToken = jwt.verify(token, Env.APP_KEY);
    const id = dataToken.id; 
    CustomerService.updateById(id, req.body)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});

router.get('/getMyNotification', (req, res, next) => {
    CustomerService.getMyNotification(req.customer.id)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
 });

router.put('/confirmRequest', (req, res, next) => {
    const body = req.body;
    RequestService.confirmRequest(body.requestId, body.starsCount, body.comment)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});

router.put('/checkedNotifications', (req, res, next) => {
    CustomerService.checkedNotifications(req.customer.id)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});

module.exports = router;