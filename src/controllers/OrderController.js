const Order = require('../models/Order');
const Menu = require('../models/Menu');

/**
 * Order Controller
 */
class OrderController {
  /**
   * Create order
   */
  static async create(req, res) {
    try {
      const { customer_id, items, payment_method } = req.body;

      // Validate items
      for (const item of items) {
        const menu = await Menu.getById(item.menu_id);
        if (!menu) {
          return res.status(404).json({
            success: false,
            message: `Menu item ${item.menu_id} not found`
          });
        }

        if (menu.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${menu.name}`
          });
        }
      }

      const order = await Order.create(customer_id, items, payment_method);
      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get order by ID
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.getById(id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      const items = await Order.getItems(id);
      order.items = items;

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get all orders
   */
  static async getAll(req, res) {
    try {
      const orders = await Order.getAll();
      res.json({
        success: true,
        data: orders,
        count: orders.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get orders by customer
   */
  static async getByCustomer(req, res) {
    try {
      const { customerId } = req.params;
      const orders = await Order.getByCustomer(customerId);

      res.json({
        success: true,
        data: orders,
        count: orders.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get orders by status
   */
  static async getByStatus(req, res) {
    try {
      const { status } = req.params;
      const orders = await Order.getByStatus(status);

      res.json({
        success: true,
        data: orders,
        count: orders.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Update order status
   */
  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await Order.updateStatus(id, status);
      res.json({
        success: true,
        message: 'Order status updated successfully',
        data: order
      });
    } catch (error) {
      if (error.message === 'Order not found') {
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
   * Cancel order
   */
  static async cancel(req, res) {
    try {
      const { id } = req.params;
      await Order.cancel(id);

      res.json({
        success: true,
        message: 'Order cancelled successfully'
      });
    } catch (error) {
      if (error.message === 'Order not found or already completed') {
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

  /**
   * Get order summary
   */
  static async getSummary(req, res) {
    try {
      const { customerId } = req.params;
      const summary = await Order.getSummary(customerId);

      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = OrderController;
