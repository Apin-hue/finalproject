const Menu = require('../models/Menu');

/**
 * Menu Controller
 */
class MenuController {
  /**
   * Create menu item
   */
  static async create(req, res) {
    try {
      const { name, description, price, category, stock } = req.body;

      const menu = await Menu.create(name, description, price, category, stock);
      res.status(201).json({
        success: true,
        message: 'Menu item created successfully',
        data: menu
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get menu by ID
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const menu = await Menu.getById(id);

      if (!menu) {
        return res.status(404).json({
          success: false,
          message: 'Menu item not found'
        });
      }

      res.json({
        success: true,
        data: menu
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get all menus
   */
  static async getAll(req, res) {
    try {
      const menus = await Menu.getAll();
      res.json({
        success: true,
        data: menus,
        count: menus.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get menus by category
   */
  static async getByCategory(req, res) {
    try {
      const { category } = req.params;
      const menus = await Menu.getByCategory(category);

      res.json({
        success: true,
        data: menus,
        count: menus.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Update menu
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description, price, category, stock, is_available } = req.body;

      const menu = await Menu.update(id, name, description, price, category, stock, is_available);
      res.json({
        success: true,
        message: 'Menu item updated successfully',
        data: menu
      });
    } catch (error) {
      if (error.message === 'Menu not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Delete menu
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;
      await Menu.delete(id);

      res.json({
        success: true,
        message: 'Menu item deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Menu not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = MenuController;
