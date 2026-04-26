const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');

// Payment routes
router.post('/payments', PaymentController.create);
router.get('/payments', PaymentController.getAll);
router.get('/payments/:id', PaymentController.getById);
router.get('/payments/order/:orderId', PaymentController.getByOrderId);
router.put('/payments/:id/status', PaymentController.updateStatus);
router.get('/revenue/daily/:date', PaymentController.getDailyRevenue);
router.get('/revenue/by-method', PaymentController.getRevenueByMethod);

module.exports = router;
