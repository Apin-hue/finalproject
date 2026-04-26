const Customer = require('../models/Customer');

/**
 * Customer Controller
 */
class CustomerController {
  /**
   * Create customer
   */
  static async create(req, res) {
    try {
      const { name, email, phone, address } = req.body;

      const customer = await Customer.create(name, email, phone, address);
      res.status(201).json({
        success: true,
        message: 'Customer created successfully',
        data: customer
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get customer by ID
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const customer = await Customer.getById(id);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      res.json({
        success: true,
        data: customer
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get all customers
   */
  static async getAll(req, res) {
    try {
      const customers = await Customer.getAll();
      res.json({
        success: true,
        data: customers,
        count: customers.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Update customer
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, email, phone, address } = req.body;

      const customer = await Customer.update(id, name, email, phone, address);
      res.json({
        success: true,
        message: 'Customer updated successfully',
        data: customer
      });
    } catch (error) {
      if (error.message === 'Customer not found') {
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
   * Delete customer
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;
      await Customer.delete(id);

      res.json({
        success: true,
        message: 'Customer deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Customer not found') {
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

module.exports = CustomerController;
