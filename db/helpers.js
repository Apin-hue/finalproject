/**
 * Database Helper Utilities
 * Fungsi-fungsi tambahan untuk database operations
 */

const { db } = require('./database');

/**
 * Execute a single query
 */
const executeQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

/**
 * Execute a select query (returns one row)
 */
const executeGetQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

/**
 * Execute a select query (returns all rows)
 */
const executeAllQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

/**
 * Get table statistics
 */
const getTableStats = async () => {
  try {
    const stats = {
      customers: await executeGetQuery('SELECT COUNT(*) as count FROM customers'),
      menus: await executeGetQuery('SELECT COUNT(*) as count FROM menus'),
      orders: await executeGetQuery('SELECT COUNT(*) as count FROM orders'),
      order_items: await executeGetQuery('SELECT COUNT(*) as count FROM order_items'),
      payments: await executeGetQuery('SELECT COUNT(*) as count FROM payments')
    };
    return stats;
  } catch (error) {
    throw new Error(`Failed to get table stats: ${error.message}`);
  }
};

/**
 * Get database file size (in bytes)
 */
const getDatabaseSize = async () => {
  const fs = require('fs');
  const path = require('path');
  
  const dbPath = path.join(__dirname, 'diadoek.db');
  try {
    const stats = fs.statSync(dbPath);
    return {
      size_bytes: stats.size,
      size_kb: (stats.size / 1024).toFixed(2),
      size_mb: (stats.size / (1024 * 1024)).toFixed(2)
    };
  } catch (error) {
    return { size_bytes: 0, size_kb: 0, size_mb: 0 };
  }
};

/**
 * Export database to JSON
 */
const exportToJSON = async () => {
  try {
    const data = {
      customers: await executeAllQuery('SELECT * FROM customers'),
      menus: await executeAllQuery('SELECT * FROM menus'),
      orders: await executeAllQuery('SELECT * FROM orders'),
      order_items: await executeAllQuery('SELECT * FROM order_items'),
      payments: await executeAllQuery('SELECT * FROM payments'),
      exported_at: new Date().toISOString()
    };
    return data;
  } catch (error) {
    throw new Error(`Failed to export data: ${error.message}`);
  }
};

/**
 * Get database statistics for reporting
 */
const getDatabaseReport = async () => {
  try {
    const stats = await getTableStats();
    const size = await getDatabaseSize();
    
    const totalCustomers = stats.customers?.count || 0;
    const totalOrders = stats.orders?.count || 0;
    const totalMenus = stats.menus?.count || 0;
    
    const totalRevenue = await executeGetQuery(
      'SELECT SUM(amount) as total FROM payments WHERE status = ?',
      ['completed']
    );
    
    const avgOrderValue = await executeGetQuery(
      'SELECT AVG(total_amount) as avg FROM orders'
    );
    
    return {
      tables: stats,
      size: size,
      summary: {
        total_customers: totalCustomers,
        total_orders: totalOrders,
        total_menus: totalMenus,
        total_revenue: totalRevenue?.total || 0,
        average_order_value: Math.round(avgOrderValue?.avg || 0)
      },
      generated_at: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Failed to generate report: ${error.message}`);
  }
};

module.exports = {
  executeQuery,
  executeGetQuery,
  executeAllQuery,
  getTableStats,
  getDatabaseSize,
  exportToJSON,
  getDatabaseReport
};
