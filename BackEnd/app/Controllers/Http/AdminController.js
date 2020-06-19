const express = require('express');
const router = express.Router();
const AuthenMiddleware = require('../../Middlewares/AuthMiddleware');
const CustomerService = require('../../Services/CustomerService');
const ShipperService = require('../../Services/ShipperService');
const RequestsService = require('../../Services/RequestsService');
const TypeShipService = require('../../Services/TypeShipService');

//middleware
router.use((req, res, next) => {
    AuthenMiddleware.authAdmin({req, res, next});
});

router.get('/shipper/getData/:id', (req, res, next) => {
    const userId = req.params.id;
    ShipperService.getData(userId)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});

router.get('/customer/getData/:id', (req, res, next) => {
    const userId = req.params.id;
    CustomerService.getData(userId)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});

router.put('/shipper/edit/:id', (req, res, next)=>{    
    ShipperService.updateById(req.params.id, req.body)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});

router.put('/customer/edit/:id', (req, res, next)=>{    
    CustomerService.updateById(req.params.id, req.body)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});

router.get('/getAllCustomers', (req, res, next) => {
    CustomerService.getAll()
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        console.log(err);
        res.json(err);
    })
});

router.get('/getAllShippers', (req, res, next) => {
    ShipperService.getAll()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        });
});

router.get('/getAllRequests', (req, res) => {
    RequestsService.getAll()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        });
});

router.delete('/customer/delete/:id', (req, res, next) => {
    CustomerService.deleteById(req.params.id, req.body)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});

router.delete('/request/delete/:id', (req, res, next) => {
    RequestsService.deleteById(req.params.id, req.body)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});

router.delete('/shipper/delete/:id', (req, res, next) => {
    ShipperService.deleteById(req.params.id, req.body)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});

router.put('/active/customer/:id', (req, res, next) => {
    CustomerService.activeCustomerById(req.params.id, req.body)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});

router.put('/active/shipper/:id', (req, res, next)=>{
    ShipperService.activeShipperById(req.params.id, req.body)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});


module.exports = router;