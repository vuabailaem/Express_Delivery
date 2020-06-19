const express = require('express');
const router = express.Router();
const ShipperService = require('../../Services/ShipperService');
const AuthenMiddleware = require('../../Middlewares/AuthMiddleware');
const jwt = require('jsonwebtoken');

router.post('/add', (req, res, next) => {
    ShipperService.add(req.body)
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        console.log(err);
        res.json(err);
    })
});

//middleware
router.use((req, res, next) => {
    AuthenMiddleware.authShipper({req, res, next});
});

router.get('/getMyData', (req, res, next) => {
    const userId = req.shipper.id;
    ShipperService.getData(userId)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});

router.put('/edit', (req, res, next)=>{
    const { headers } = req;
    const token = headers.authorization;
    const dataToken = jwt.verify(token, Env.APP_KEY);
    const id = dataToken.id; 
    ShipperService.updateById(id, req.body)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});

router.put('/readyShip', (req, res, next)=>{
    const shipperId = req.shipper.id;
    ShipperService.readyShip(shipperId)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});

router.put('/cancelReady', (req, res, next)=>{
    let shipperId = req.shipper.id;
    ShipperService.cancelReady(shipperId)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});

module.exports = router;