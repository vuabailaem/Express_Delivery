const express = require('express');

const router = express.Router();

router.use('/customer', require(__dirname + '/Http/CustomerController'));

module.exports = router;