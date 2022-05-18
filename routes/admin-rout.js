const express = require('express');

const adminController = require('../controllers/admin-controller');
const imageUploadMiddleware = require('../middlewares/multer-middleware');

const router = express.Router();

router.get('/manage-prod', adminController.getManageProd);

router.get('/add-prod', adminController.getAddProd);

router.post('/add-prod', imageUploadMiddleware, adminController.postAddProd);

router.get('/update-product/:id', adminController.getEditProduct);

router.post('/update-product/:id', imageUploadMiddleware, adminController.postEditProduct);

router.delete('/update-product/:id', adminController.deleteProd);

router.get('/manage-order', adminController.getManageOrder);

router.patch('/manage-order/:id', adminController.updateOrder);

module.exports = router;