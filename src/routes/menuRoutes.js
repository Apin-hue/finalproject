const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/MenuController');

// Menu routes
router.post('/menus', MenuController.create);
router.get('/menus', MenuController.getAll);
router.get('/menus/:id', MenuController.getById);
router.get('/menus/category/:category', MenuController.getByCategory);
router.put('/menus/:id', MenuController.update);
router.delete('/menus/:id', MenuController.delete);

module.exports = router;
