const express = require('express');
const router = express.Router();
const TypeShipService = require('../../Services/TypeShipService');

router.get('/getAll', (req, res, next)=>{
    TypeShipService.getAll()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});

router.get('/getName/:id', (req, res, next)=>{
    TypeShipService.getById(req.params.id)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});

router.put('/active/:id', (req, res, next) => {
    TypeShipService.activeById(req.params.id, req.body)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});

router.put('/edit/:id', (req, res, next) => {
    TypeShipService.updateById(req.params.id, req.body)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});

router.post('/add', (req, res, next) => {
    TypeShipService.add(req.body)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});

router.delete('/delete/:id', (req, res, next) => {
    TypeShipService.deleteById(req.params.id)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});

router.get('/getAllActive', (req, res, next)=>{
    TypeShipService.getAllActive()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});

module.exports = router;