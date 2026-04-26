const Order = require('../../src/models/Order');
const Customer = require('../../src/models/Customer');
const Menu = require('../../src/models/Menu');
const { initializeDatabase, clearAllTables } = require('../../db/database');

describe('Order Model Unit Tests', () => {
  let customerId, menuId;

  beforeAll(async () => {
    await initializeDatabase();
  });

  beforeEach(async () => {
    await clearAllTables();
    
    // Create test customer
    const customer = await Customer.create('John Doe', 'john@example.com', '08123456789');
    customerId = customer.id;
    
    // Create test menu
    const menu = await Menu.create('Nasi Kuning', 'Description', 25000, 'Rice', 10);
    menuId = menu.id;
  });

  describe('Create Order', () => {
    test('should create order with valid data', async () => {
      const items = [{ menu_id: menuId, quantity: 2, price: 25000 }];
      const order = await Order.create(customerId, items, 'cash');
      
      expect(order).toHaveProperty('id');
      expect(order.customer_id).toBe(customerId);
      expect(order.total_amount).toBe(50000);
      expect(order.status).toBe('pending');
      expect(order.payment_method).toBe('cash');
    });

    test('should reject order with invalid customer ID', async () => {
      expect.assertions(1);
      const items = [{ menu_id: menuId, quantity: 2, price: 25000 }];
      
      try {
        await Order.create(0, items, 'cash');
      } catch (error) {
        expect(error.message).toBe('Valid customer ID is required');
      }
    });

    test('should reject order with empty items', async () => {
      expect.assertions(1);
      
      try {
        await Order.create(customerId, [], 'cash');
      } catch (error) {
        expect(error.message).toBe('Order must contain at least one item');
      }
    });

    test('should reject order with invalid payment method', async () => {
      expect.assertions(1);
      const items = [{ menu_id: menuId, quantity: 2, price: 25000 }];
      
      try {
        await Order.create(customerId, items, '');
      } catch (error) {
        expect(error.message).toBe('Payment method is required');
      }
    });

    test('should calculate total amount correctly with multiple items', async () => {
      const menu2 = await Menu.create('Soto Ayam', 'Description', 15000, 'Soup', 10);
      const items = [
        { menu_id: menuId, quantity: 2, price: 25000 },
        { menu_id: menu2.id, quantity: 1, price: 15000 }
      ];
      
      const order = await Order.create(customerId, items, 'cash');
      expect(order.total_amount).toBe(65000);
    });
  });

  describe('Get Order', () => {
    test('should get order by ID', async () => {
      const items = [{ menu_id: menuId, quantity: 2, price: 25000 }];
      const created = await Order.create(customerId, items, 'cash');
      const order = await Order.getById(created.id);
      
      expect(order.id).toBe(created.id);
      expect(order.customer_id).toBe(customerId);
    });

    test('should get all orders', async () => {
      const items = [{ menu_id: menuId, quantity: 2, price: 25000 }];
      await Order.create(customerId, items, 'cash');
      
      const customer2 = await Customer.create('Jane Doe', 'jane@example.com', '08987654321');
      await Order.create(customer2.id, items, 'card');
      
      const orders = await Order.getAll();
      expect(orders.length).toBe(2);
    });

    test('should get orders by customer', async () => {
      const items = [{ menu_id: menuId, quantity: 2, price: 25000 }];
      await Order.create(customerId, items, 'cash');
      
      const customer2 = await Customer.create('Jane Doe', 'jane@example.com', '08987654321');
      await Order.create(customer2.id, items, 'card');
      
      const orders = await Order.getByCustomer(customerId);
      expect(orders.length).toBe(1);
      expect(orders[0].customer_id).toBe(customerId);
    });

    test('should get orders by status', async () => {
      const items = [{ menu_id: menuId, quantity: 2, price: 25000 }];
      const order = await Order.create(customerId, items, 'cash');
      await Order.updateStatus(order.id, 'confirmed');
      
      const orders = await Order.getByStatus('confirmed');
      expect(orders.length).toBe(1);
      expect(orders[0].status).toBe('confirmed');
    });

    test('should get order items', async () => {
      const items = [{ menu_id: menuId, quantity: 2, price: 25000 }];
      const order = await Order.create(customerId, items, 'cash');
      
      const orderItems = await Order.getItems(order.id);
      expect(orderItems.length).toBe(1);
      expect(orderItems[0].quantity).toBe(2);
    });
  });

  describe('Update Order', () => {
    test('should update order status', async () => {
      const items = [{ menu_id: menuId, quantity: 2, price: 25000 }];
      const order = await Order.create(customerId, items, 'cash');
      
      const updated = await Order.updateStatus(order.id, 'confirmed');
      expect(updated.status).toBe('confirmed');
    });

    test('should reject invalid order status', async () => {
      expect.assertions(1);
      const items = [{ menu_id: menuId, quantity: 2, price: 25000 }];
      const order = await Order.create(customerId, items, 'cash');
      
      try {
        await Order.updateStatus(order.id, 'invalid_status');
      } catch (error) {
        expect(error.message).toBe('Invalid status');
      }
    });

    test('should reject update of non-existent order', async () => {
      expect.assertions(1);
      try {
        await Order.updateStatus(999, 'confirmed');
      } catch (error) {
        expect(error.message).toBe('Order not found');
      }
    });

    test('should update payment method', async () => {
      const items = [{ menu_id: menuId, quantity: 2, price: 25000 }];
      const order = await Order.create(customerId, items, 'cash');
      
      const updated = await Order.updatePaymentMethod(order.id, 'card');
      expect(updated.payment_method).toBe('card');
    });
  });

  describe('Cancel Order', () => {
    test('should cancel pending order', async () => {
      const items = [{ menu_id: menuId, quantity: 2, price: 25000 }];
      const order = await Order.create(customerId, items, 'cash');
      
      await Order.cancel(order.id);
      const cancelled = await Order.getById(order.id);
      expect(cancelled.status).toBe('cancelled');
    });

    test('should reject cancel of completed order', async () => {
      expect.assertions(1);
      const items = [{ menu_id: menuId, quantity: 2, price: 25000 }];
      const order = await Order.create(customerId, items, 'cash');
      
      await Order.updateStatus(order.id, 'completed');
      
      try {
        await Order.cancel(order.id);
      } catch (error) {
        expect(error.message).toBe('Order not found or already completed');
      }
    });
  });

  describe('Order Summary', () => {
    test('should get customer order summary', async () => {
      const items = [{ menu_id: menuId, quantity: 2, price: 25000 }];
      await Order.create(customerId, items, 'cash');
      await Order.create(customerId, items, 'card');
      
      const summary = await Order.getSummary(customerId);
      expect(summary.total_orders).toBe(2);
      expect(summary.total_spent).toBe(100000);
    });
  });
});
