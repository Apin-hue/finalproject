const { db } = require('../../db/database');

/**
 * Customer Model
 */
class Customer {
  /**
   * Create a new customer
   */
  static create(name, email, phone, address) {
    return new Promise((resolve, reject) => {
      // Validation
      if (!name || name.trim() === '') {
        reject(new Error('Customer name is required'));
        return;
      }

      if (email && !this.isValidEmail(email)) {
        reject(new Error('Invalid email format'));
        return;
      }

      if (phone && !this.isValidPhone(phone)) {
        reject(new Error('Invalid phone format'));
        return;
      }

      const query = `
        INSERT INTO customers (name, email, phone, address)
        VALUES (?, ?, ?, ?)
      `;

      db.run(query, [name, email || null, phone || null, address || null], function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            reject(new Error('Email already exists'));
          } else {
            reject(err);
          }
        } else {
          resolve({
            id: this.lastID,
            name,
            email: email || null,
            phone: phone || null,
            address: address || null
          });
        }
      });
    });
  }

  /**
   * Get customer by ID
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM customers WHERE id = ?';
      db.get(query, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  /**
   * Get all customers
   */
  static getAll() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM customers ORDER BY created_at DESC';
      db.all(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  /**
   * Update customer
   */
  static update(id, name, email, phone, address) {
    return new Promise((resolve, reject) => {
      if (!name || name.trim() === '') {
        reject(new Error('Customer name is required'));
        return;
      }

      if (email && !this.isValidEmail(email)) {
        reject(new Error('Invalid email format'));
        return;
      }

      if (phone && !this.isValidPhone(phone)) {
        reject(new Error('Invalid phone format'));
        return;
      }

      const query = `
        UPDATE customers 
        SET name = ?, email = ?, phone = ?, address = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      db.run(query, [name, email || null, phone || null, address || null, id], function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            reject(new Error('Email already exists'));
          } else {
            reject(err);
          }
        } else if (this.changes === 0) {
          reject(new Error('Customer not found'));
        } else {
          resolve({
            id,
            name,
            email: email || null,
            phone: phone || null,
            address: address || null
          });
        }
      });
    });
  }

  /**
   * Delete customer
   */
  static delete(id) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM customers WHERE id = ?';
      db.run(query, [id], function(err) {
        if (err) reject(err);
        else if (this.changes === 0) reject(new Error('Customer not found'));
        else resolve(true);
      });
    });
  }

  /**
   * Validate email format
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone format (minimal validation)
   */
  static isValidPhone(phone) {
    const phoneRegex = /^(\d{10,15})$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  }
}

module.exports = Customer;
