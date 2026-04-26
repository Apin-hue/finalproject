const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');

// Order routes
router.post('/orders', OrderController.create);
router.get('/orders', OrderController.getAll);
router.get('/orders/:id', OrderController.getById);
router.get('/orders/customer/:customerId', OrderController.getByCustomer);
router.get('/orders/status/:status', OrderController.getByStatus);
router.put('/orders/:id/status', OrderController.updateStatus);
router.put('/orders/:id/cancel', OrderController.cancel);
router.get('/orders/:customerId/summary', OrderController.getSummary);

module.exports = router;
