const { db } = require('../../db/database');

/**
 * Payment Model
 */
class Payment {
  /**
   * Create a new payment
   */
  static create(orderId, amount, paymentMethod) {
    return new Promise((resolve, reject) => {
      // Validation
      if (!orderId || orderId <= 0) {
        reject(new Error('Valid order ID is required'));
        return;
      }

      if (!amount || amount <= 0) {
        reject(new Error('Amount must be greater than 0'));
        return;
      }

      if (!paymentMethod || paymentMethod.trim() === '') {
        reject(new Error('Payment method is required'));
        return;
      }

      // Validate payment method
      const validMethods = ['cash', 'card', 'transfer', 'e-wallet'];
      if (!validMethods.includes(paymentMethod.toLowerCase())) {
        reject(new Error('Invalid payment method'));
        return;
      }

      const query = `
        INSERT INTO payments (order_id, amount, payment_method, status)
        VALUES (?, ?, ?, 'pending')
      `;

      db.run(query, [orderId, amount, paymentMethod], function(err) {
        if (err) reject(err);
        else {
          resolve({
            id: this.lastID,
            order_id: orderId,
            amount,
            payment_method: paymentMethod,
            status: 'pending'
          });
        }
      });
    });
  }

  /**
   * Get payment by ID
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM payments WHERE id = ?';
      db.get(query, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  /**
   * Get payment by order ID
   */
  static getByOrderId(orderId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM payments WHERE order_id = ? ORDER BY created_at DESC';
      db.all(query, [orderId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  /**
   * Get all payments
   */
  static getAll() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM payments ORDER BY created_at DESC';
      db.all(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  /**
   * Get payments by status
   */
  static getByStatus(status) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM payments WHERE status = ? ORDER BY created_at DESC';
      db.all(query, [status], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  /**
   * Update payment status
   */
  static updateStatus(id, status) {
    return new Promise((resolve, reject) => {
      const validStatuses = ['pending', 'completed', 'failed', 'cancelled'];
      
      if (!validStatuses.includes(status)) {
        reject(new Error('Invalid status'));
        return;
      }

      const query = 'UPDATE payments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      db.run(query, [status, id], function(err) {
        if (err) reject(err);
        else if (this.changes === 0) reject(new Error('Payment not found'));
        else resolve({ id, status });
      });
    });
  }

  /**
   * Get daily revenue
   */
  static getDailyRevenue(date) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          DATE(created_at) as date,
          SUM(amount) as total_revenue,
          COUNT(*) as transaction_count
        FROM payments
        WHERE status = 'completed' AND DATE(created_at) = ?
        GROUP BY DATE(created_at)
      `;
      db.get(query, [date], (err, row) => {
        if (err) reject(err);
        else resolve(row || { total_revenue: 0, transaction_count: 0 });
      });
    });
  }

  /**
   * Get total revenue by payment method
   */
  static getRevenueByMethod() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          payment_method,
          SUM(amount) as total_amount,
          COUNT(*) as transaction_count
        FROM payments
        WHERE status = 'completed'
        GROUP BY payment_method
      `;
      db.all(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }
}

module.exports = Payment;
