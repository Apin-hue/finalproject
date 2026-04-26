const Payment = require('../../src/models/Payment');
const Order = require('../../src/models/Order');
const Customer = require('../../src/models/Customer');
const Menu = require('../../src/models/Menu');
const { initializeDatabase, clearAllTables } = require('../../db/database');

describe('Payment Model Unit Tests', () => {
  let customerId, menuId, orderId;

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
    
    // Create test order
    const items = [{ menu_id: menuId, quantity: 2, price: 25000 }];
    const order = await Order.create(customerId, items, 'cash');
    orderId = order.id;
  });

  describe('Create Payment', () => {
    test('should create payment with valid data', async () => {
      const payment = await Payment.create(orderId, 50000, 'cash');
      
      expect(payment).toHaveProperty('id');
      expect(payment.order_id).toBe(orderId);
      expect(payment.amount).toBe(50000);
      expect(payment.payment_method).toBe('cash');
      expect(payment.status).toBe('pending');
    });

    test('should reject payment with invalid order ID', async () => {
      expect.assertions(1);
      
      try {
        await Payment.create(0, 50000, 'cash');
      } catch (error) {
        expect(error.message).toBe('Valid order ID is required');
      }
    });

    test('should reject payment with invalid amount', async () => {
      expect.assertions(1);
      
      try {
        await Payment.create(orderId, 0, 'cash');
      } catch (error) {
        expect(error.message).toBe('Amount must be greater than 0');
      }
    });

    test('should reject payment with negative amount', async () => {
      expect.assertions(1);
      
      try {
        await Payment.create(orderId, -50000, 'cash');
      } catch (error) {
        expect(error.message).toBe('Amount must be greater than 0');
      }
    });

    test('should reject payment with invalid payment method', async () => {
      expect.assertions(1);
      
      try {
        await Payment.create(orderId, 50000, '');
      } catch (error) {
        expect(error.message).toBe('Payment method is required');
      }
    });

    test('should reject payment with invalid payment method type', async () => {
      expect.assertions(1);
      
      try {
        await Payment.create(orderId, 50000, 'bitcoin');
      } catch (error) {
        expect(error.message).toBe('Invalid payment method');
      }
    });

    test('should accept valid payment methods', async () => {
      const methods = ['cash', 'card', 'transfer', 'e-wallet'];
      
      for (const method of methods) {
        const payment = await Payment.create(orderId, 50000, method);
        expect(payment.payment_method).toBe(method);
        
        if (methods.indexOf(method) < methods.length - 1) {
          const newItems = [{ menu_id: menuId, quantity: 1, price: 25000 }];
          const newOrder = await Order.create(customerId, newItems, 'cash');
          orderId = newOrder.id;
        }
      }
    });
  });

  describe('Get Payment', () => {
    test('should get payment by ID', async () => {
      const created = await Payment.create(orderId, 50000, 'cash');
      const payment = await Payment.getById(created.id);
      
      expect(payment.id).toBe(created.id);
      expect(payment.amount).toBe(50000);
    });

    test('should get payments by order ID', async () => {
      await Payment.create(orderId, 30000, 'cash');
      await Payment.create(orderId, 20000, 'card');
      
      const payments = await Payment.getByOrderId(orderId);
      expect(payments.length).toBe(2);
    });

    test('should get all payments', async () => {
      await Payment.create(orderId, 50000, 'cash');
      
      const newItems = [{ menu_id: menuId, quantity: 1, price: 25000 }];
      const newOrder = await Order.create(customerId, newItems, 'cash');
      await Payment.create(newOrder.id, 25000, 'card');
      
      const payments = await Payment.getAll();
      expect(payments.length).toBe(2);
    });

    test('should get payments by status', async () => {
      const payment1 = await Payment.create(orderId, 50000, 'cash');
      await Payment.updateStatus(payment1.id, 'completed');
      
      const newItems = [{ menu_id: menuId, quantity: 1, price: 25000 }];
      const newOrder = await Order.create(customerId, newItems, 'cash');
      await Payment.create(newOrder.id, 25000, 'card');
      
      const completed = await Payment.getByStatus('completed');
      expect(completed.length).toBe(1);
      expect(completed[0].status).toBe('completed');
    });
  });

  describe('Update Payment', () => {
    test('should update payment status to completed', async () => {
      const payment = await Payment.create(orderId, 50000, 'cash');
      const updated = await Payment.updateStatus(payment.id, 'completed');
      
      expect(updated.status).toBe('completed');
    });

    test('should update payment status to failed', async () => {
      const payment = await Payment.create(orderId, 50000, 'cash');
      const updated = await Payment.updateStatus(payment.id, 'failed');
      
      expect(updated.status).toBe('failed');
    });

    test('should reject invalid payment status', async () => {
      expect.assertions(1);
      const payment = await Payment.create(orderId, 50000, 'cash');
      
      try {
        await Payment.updateStatus(payment.id, 'invalid_status');
      } catch (error) {
        expect(error.message).toBe('Invalid status');
      }
    });

    test('should reject update of non-existent payment', async () => {
      expect.assertions(1);
      try {
        await Payment.updateStatus(999, 'completed');
      } catch (error) {
        expect(error.message).toBe('Payment not found');
      }
    });
  });

  describe('Revenue Reports', () => {
    test('should get daily revenue', async () => {
      const payment = await Payment.create(orderId, 50000, 'cash');
      await Payment.updateStatus(payment.id, 'completed');
      
      const today = new Date().toISOString().split('T')[0];
      const revenue = await Payment.getDailyRevenue(today);
      
      expect(revenue.total_revenue).toBe(50000);
      expect(revenue.transaction_count).toBe(1);
    });

    test('should get revenue by payment method', async () => {
      const payment1 = await Payment.create(orderId, 50000, 'cash');
      await Payment.updateStatus(payment1.id, 'completed');
      
      const newItems = [{ menu_id: menuId, quantity: 1, price: 25000 }];
      const newOrder = await Order.create(customerId, newItems, 'cash');
      const payment2 = await Payment.create(newOrder.id, 25000, 'card');
      await Payment.updateStatus(payment2.id, 'completed');
      
      const revenue = await Payment.getRevenueByMethod();
      expect(revenue.length).toBeGreaterThan(0);
    });
  });
});
