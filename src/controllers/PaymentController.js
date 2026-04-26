const Payment = require('../models/Payment');

/**
 * Payment Controller
 */
class PaymentController {
  /**
   * Create payment
   */
  static async create(req, res) {
    try {
      const { order_id, amount, payment_method } = req.body;

      const payment = await Payment.create(order_id, amount, payment_method);
      res.status(201).json({
        success: true,
        message: 'Payment created successfully',
        data: payment
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get payment by ID
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const payment = await Payment.getById(id);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      res.json({
        success: true,
        data: payment
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get payments by order
   */
  static async getByOrderId(req, res) {
    try {
      const { orderId } = req.params;
      const payments = await Payment.getByOrderId(orderId);

      res.json({
        success: true,
        data: payments,
        count: payments.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get all payments
   */
  static async getAll(req, res) {
    try {
      const payments = await Payment.getAll();
      res.json({
        success: true,
        data: payments,
        count: payments.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Update payment status
   */
  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const payment = await Payment.updateStatus(id, status);
      res.json({
        success: true,
        message: 'Payment status updated successfully',
        data: payment
      });
    } catch (error) {
      if (error.message === 'Payment not found') {
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
   * Get daily revenue
   */
  static async getDailyRevenue(req, res) {
    try {
      const { date } = req.params;
      const revenue = await Payment.getDailyRevenue(date);

      res.json({
        success: true,
        data: revenue
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get revenue by payment method
   */
  static async getRevenueByMethod(req, res) {
    try {
      const revenue = await Payment.getRevenueByMethod();

      res.json({
        success: true,
        data: revenue
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = PaymentController;
