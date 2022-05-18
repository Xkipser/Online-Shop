const mongodb = require('mongodb');

const Product = require('../models/product-model');

const ObjectId = mongodb.ObjectId;

async function getProdDetail(req, res, next) {
    const prodId = new ObjectId(req.params.id);

    try {
        const prodDetail = await Product.findOne(prodId);
        res.render('prod-details', { prodDetail: prodDetail });
    } catch (error) {
        next(error);
        return;
    }
}

module.exports = {
    getProdDetail: getProdDetail
}