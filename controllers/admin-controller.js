const sessionValidation = require('../util/validation-session');
const validation = require('../util/validation');

const Product = require('../models/product-model');
const Order = require('../models/order-model');

async function getManageProd(req, res, next) {
    try {
        const products = await Product.findAll();

        res.render('manage-prod', { products: products });
    } catch (error) {
        next(error);
        return;
    }
}

function getAddProd(req, res) {
    res.render('add-prod');
}

async function postAddProd(req, res, next) {
    const product = new Product({
        ...req.body,
        image: req.file.filename
    });

    try {
        await product.save();
    } catch (error) {
        next(error);
        return;
    }

    res.redirect('/admin/manage-prod');
}

async function getEditProduct(req, res, next) {
    try {
        const product = await Product.findOne(req.params.id);

        res.render('update-product', { product: product })
    } catch (error) {
        next(error);
    }
}

async function postEditProduct(req, res, next) {
    const product = new Product({
        ...req.body,
        _id: req.params.id
    });

    if (req.file) {
        product.replaceImage(req.file.filename);
    }

    try {
        await product.save();
    } catch (error) {
        next(error);
        return;
    }

    res.redirect('/admin/manage-prod');
}

async function deleteProd(req, res, next) {
    let product;

    try {
        product = await Product.findOne(req.params.id);
        await product.remove();
    } catch (error) {
        return next(error);
    }

    res.json({ message: 'Deleted product!' });
}

async function getManageOrder(req, res, next) {
    try {
        const orders = await Order.findAll();

        res.render('manage-order', { orders: orders });
    } catch (error) {
        next(error);
    }
}

async function updateOrder(req, res, next) {
    const orderId = req.params.id;
    const newStatus = req.body.newStatus;
  
    try {
        const order = await Order.findById(orderId);
    
        order.status = newStatus;
    
        await order.save();
    
        res.json({ message: 'Order updated', newStatus: newStatus });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getManageProd: getManageProd,
    getAddProd: getAddProd,
    postAddProd: postAddProd,
    getEditProduct: getEditProduct,
    postEditProduct: postEditProduct,
    deleteProd: deleteProd,
    getManageOrder: getManageOrder,
    updateOrder: updateOrder
}