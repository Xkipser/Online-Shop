const express = require('express');

const prodControl = require('../controllers/product-controller');
const clientControl = require('../controllers/client-controller');
const cartControl = require('../controllers/cart-controller');

const router = express.Router();

router.get('/', clientControl.getHome);

router.get('/shop', clientControl.getHome);

router.get('/cart', cartControl.getCart);

router.post('/cart', cartControl.addCartItem);

router.patch('/cart', cartControl.updateCartItem);

router.get('/signup', clientControl.getSignup);

router.post('/signup', clientControl.postSignup);

router.get('/login', clientControl.getLogin);

router.post('/login', clientControl.postLogin);

router.get('/logout', clientControl.logout);

router.get('/view-prod/:id', prodControl.getProdDetail);

router.get('/401', function(req, res) {
    res.status(401).render('401');
});

router.get('/403', function(req, res) {
    res.status(403).render('403');
});

module.exports = router;