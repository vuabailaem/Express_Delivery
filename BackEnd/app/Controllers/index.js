const express = require('express');

const router = express.Router();

router.use('/customer', require(__dirname + '/Http/CustomerController'));
router.use('/auth', require(__dirname + '/Http/AuthController'));
router.use('/shipper', require(__dirname + '/Http/ShipperController'));
router.use('/typeShip', require(__dirname + '/Http/TypeShipController'));
router.use('/admin', require(__dirname + '/Http/AdminController'));


module.exports = router;