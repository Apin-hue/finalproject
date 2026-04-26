const { db } = require('../../db/database');

/**
 * Order Model
 */
class Order {
  /**
   * Create a new order
   */
  static create(customerId, items, paymentMethod = 'cash') {
    return new Promise((resolve, reject) => {
      // Validation
      if (!customerId || customerId <= 0) {
        reject(new Error('Valid customer ID is required'));
        return;
      }

      if (!items || items.length === 0) {
        reject(new Error('Order must contain at least one item'));
        return;
      }

      if (!paymentMethod || paymentMethod.trim() === '') {
        reject(new Error('Payment method is required'));
        return;
      }

      let totalAmount = 0;
      for (const item of items) {
        if (!item.menu_id || !item.quantity || item.quantity <= 0) {
          reject(new Error('Invalid item in order'));
          return;
        }
        if (!item.price || item.price <= 0) {
          reject(new Error('Invalid price in order'));
          return;
        }
        totalAmount += item.price * item.quantity;
      }

      const query = `
        INSERT INTO orders (customer_id, total_amount, payment_method, status)
        VALUES (?, ?, ?, 'pending')
      `;

      db.run(query, [customerId, totalAmount, paymentMethod], function(err) {
        if (err) {
          reject(err);
        } else {
          const orderId = this.lastID;
          Order._insertOrderItems(orderId, items)
            .then(() => resolve({
              id: orderId,
              customer_id: customerId,
              total_amount: totalAmount,
              status: 'pending',
              payment_method: paymentMethod
            }))
            .catch(reject);
        }
      });
    });
  }

  /**
   * Insert order items
   */
  static _insertOrderItems(orderId, items) {
    return new Promise((resolve, reject) => {
      let completed = 0;
      let hasError = false;

      items.forEach((item, index) => {
        const query = `
          INSERT INTO order_items (order_id, menu_id, quantity, price)
          VALUES (?, ?, ?, ?)
        `;

        db.run(query, [orderId, item.menu_id, item.quantity, item.price], (err) => {
          if (err && !hasError) {
            hasError = true;
            reject(err);
            return;
          }

          completed++;
          if (completed === items.length && !hasError) {
            resolve();
          }
        });
      });
    });
  }

  /**
   * Get order by ID
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM orders WHERE id = ?';
      db.get(query, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  /**
   * Get all orders
   */
  static getAll() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM orders ORDER BY created_at DESC';
      db.all(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  /**
   * Get orders by customer
   */
  static getByCustomer(customerId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC';
      db.all(query, [customerId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  /**
   * Get orders by status
   */
  static getByStatus(status) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC';
      db.all(query, [status], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  /**
   * Get order items
   */
  static getItems(orderId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT oi.*, m.name, m.category 
        FROM order_items oi
        JOIN menus m ON oi.menu_id = m.id
        WHERE oi.order_id = ?
      `;
      db.all(query, [orderId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  /**
   * Update order status
   */
  static updateStatus(id, status) {
    return new Promise((resolve, reject) => {
      const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
      
      if (!validStatuses.includes(status)) {
        reject(new Error('Invalid status'));
        return;
      }

      const query = 'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      db.run(query, [status, id], function(err) {
        if (err) reject(err);
        else if (this.changes === 0) reject(new Error('Order not found'));
        else resolve({ id, status });
      });
    });
  }

  /**
   * Update payment method
   */
  static updatePaymentMethod(id, paymentMethod) {
    return new Promise((resolve, reject) => {
      if (!paymentMethod || paymentMethod.trim() === '') {
        reject(new Error('Payment method is required'));
        return;
      }

      const query = 'UPDATE orders SET payment_method = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      db.run(query, [paymentMethod, id], function(err) {
        if (err) reject(err);
        else if (this.changes === 0) reject(new Error('Order not found'));
        else resolve({ id, payment_method: paymentMethod });
      });
    });
  }

  /**
   * Cancel order
   */
  static cancel(id) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND status != ?';
      db.run(query, ['cancelled', id, 'completed'], function(err) {
        if (err) reject(err);
        else if (this.changes === 0) reject(new Error('Order not found or already completed'));
        else resolve(true);
      });
    });
  }

  /**
   * Get order summary
   */
  static getSummary(customerId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          COUNT(*) as total_orders,
          SUM(total_amount) as total_spent,
          AVG(total_amount) as average_order_value
        FROM orders
        WHERE customer_id = ?
      `;
      db.get(query, [customerId], (err, row) => {
        if (err) reject(err);
        else resolve(row || {});
      });
    });
  }
}

module.exports = Order;
