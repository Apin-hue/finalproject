const { db } = require('../../db/database');

/**
 * Menu Model
 */
class Menu {
  /**
   * Create a new menu item
   */
  static create(name, description, price, category, stock = 0) {
    return new Promise((resolve, reject) => {
      // Validation
      if (!name || name.trim() === '') {
        reject(new Error('Menu name is required'));
        return;
      }

      if (price === undefined || price === null || price <= 0) {
        reject(new Error('Price must be greater than 0'));
        return;
      }

      if (!category || category.trim() === '') {
        reject(new Error('Category is required'));
        return;
      }

      if (stock < 0) {
        reject(new Error('Stock cannot be negative'));
        return;
      }

      const query = `
        INSERT INTO menus (name, description, price, category, stock)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.run(query, [name, description || null, price, category, stock], function(err) {
        if (err) reject(err);
        else {
          resolve({
            id: this.lastID,
            name,
            description: description || null,
            price,
            category,
            stock,
            is_available: 1
          });
        }
      });
    });
  }

  /**
   * Get menu by ID
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM menus WHERE id = ?';
      db.get(query, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  /**
   * Get all menus
   */
  static getAll() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM menus WHERE is_available = 1 ORDER BY category, name';
      db.all(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  /**
   * Get menus by category
   */
  static getByCategory(category) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM menus WHERE category = ? AND is_available = 1 ORDER BY name';
      db.all(query, [category], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  /**
   * Update menu
   */
  static update(id, name, description, price, category, stock, is_available) {
    return new Promise((resolve, reject) => {
      if (name && name.trim() === '') {
        reject(new Error('Menu name cannot be empty'));
        return;
      }

      if (price !== undefined && price !== null && price <= 0) {
        reject(new Error('Price must be greater than 0'));
        return;
      }

      if (stock !== undefined && stock !== null && stock < 0) {
        reject(new Error('Stock cannot be negative'));
        return;
      }

      const query = `
        UPDATE menus 
        SET name = ?, description = ?, price = ?, category = ?, stock = ?, is_available = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      db.run(
        query,
        [name, description || null, price, category, stock, is_available !== undefined ? is_available : 1, id],
        function(err) {
          if (err) reject(err);
          else if (this.changes === 0) reject(new Error('Menu not found'));
          else resolve({ id, name, description, price, category, stock, is_available });
        }
      );
    });
  }

  /**
   * Delete menu (soft delete)
   */
  static delete(id) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE menus SET is_available = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      db.run(query, [id], function(err) {
        if (err) reject(err);
        else if (this.changes === 0) reject(new Error('Menu not found'));
        else resolve(true);
      });
    });
  }

  /**
   * Update stock
   */
  static updateStock(id, quantity) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT stock FROM menus WHERE id = ?';
      db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        if (!row) {
          reject(new Error('Menu not found'));
          return;
        }

        const newStock = row.stock - quantity;
        if (newStock < 0) {
          reject(new Error('Insufficient stock'));
          return;
        }

        const updateQuery = 'UPDATE menus SET stock = ? WHERE id = ?';
        db.run(updateQuery, [newStock, id], function(err) {
          if (err) reject(err);
          else resolve(newStock);
        });
      });
    });
  }
}

module.exports = Menu;
