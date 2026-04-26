const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/CustomerController');

// Customer routes
router.post('/customers', CustomerController.create);
router.get('/customers', CustomerController.getAll);
router.get('/customers/:id', CustomerController.getById);
router.put('/customers/:id', CustomerController.update);
router.delete('/customers/:id', CustomerController.delete);

module.exports = router;
