const express = require('express');
const { getCartProducts } = require('./cartControllers'); 

const router = express.Router();

router.post('/cart/products', getCartProducts);

module.exports = router;