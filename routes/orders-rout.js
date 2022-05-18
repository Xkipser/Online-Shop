const express = require('express');

const ordersControl = require('../controllers/order-controller');

const router = express.Router();

router.get('/orders', ordersControl.getOrders);

router.post('/orders', ordersControl.addOrder);

router.get('/success', ordersControl.getSuccess);

router.get('/cancel', ordersControl.getCancel);

module.exports = router;