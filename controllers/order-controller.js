const stripe = require('stripe')('sk_test_51L0nzDK5fuUNlZb57YQGWKxjy1Zfj5RMy2vrOhAqSNldlM2y3ioYjRNNIWVrG7JLRx6XjL8W0azwnqLsKpQ1Q0Yq00brApV3SA');

const Order = require('../models/order-model');
const Client = require('../models/client-model');

async function getOrders(req, res) {
    try {
        const orders = await Order.findAllForUser(res.locals.uid);

        res.render('orders', { orders: orders });
    } catch (error) {
        next(error);
    }
}

async function addOrder(req, res, next) {
    const cart = res.locals.cart;

    let userDocument;
    try {
        userDocument = await Client.findById(res.locals.uid);
    } catch (error) {
        next(error);
        return;
    }

    const order = new Order(cart, userDocument);

    try {
        await order.save();
    } catch (error) {
        next(error);
    }

    req.session.cart = null;

    const session = await stripe.checkout.sessions.create({
        line_items: cart.items.map(function(item) {
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.product.title
                    },
                    unit_amount: +item.product.price.toFixed(2) * 100
                },
                quantity: item.quantity,
            }
        }),
        mode: 'payment',
        success_url: `http://localhost:3000/success`,
        cancel_url: `http://localhost:3000/cancel`,
    });
    
    res.redirect(303, session.url);
}

function getCancel(req, res) {
    res.render('cancel')
}

function getSuccess(req, res) {
    res.render('success')
}

module.exports = {
    addOrder: addOrder,
    getOrders: getOrders,
    getCancel: getCancel,
    getSuccess: getSuccess
}