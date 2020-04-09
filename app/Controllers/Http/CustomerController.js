const express = require('express');
const router = express.Router();
const CustomerService = require('../../Services/CustomerService');

router.get('/getAll', (req, res, next) => {
    CustomerService.getAll()
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        console.log(err);
        res.json(err);
    })
});

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

router.delete('/:id', (req, res, next) => {
    CustomerService.deleteById(req.params.id, req.body)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});

router.put('/:id', (req, res, next) => {
    CustomerService.updateById(req.params.id, req.body)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
})

module.exports = router;