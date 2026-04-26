const request = require('supertest');
const app = require('../../src/app');
const { initializeDatabase, clearAllTables } = require('../../db/database');
const Customer = require('../../src/models/Customer');
const Menu = require('../../src/models/Menu');
const Order = require('../../src/models/Order');

describe('Order API Integration Tests', () => {
  let customerId, menuId;

  beforeAll(async () => {
    await initializeDatabase();
  });

  beforeEach(async () => {
    await clearAllTables();

    const customer = await Customer.create('John Doe', 'john@example.com', '08123456789');
    customerId = customer.id;

    const menu = await Menu.create('Nasi Kuning', 'Description', 25000, 'Rice', 10);
    menuId = menu.id;
  });

  describe('POST /api/orders', () => {
    test('should create order successfully via API', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          customer_id: customerId,
          items: [
            { menu_id: menuId, quantity: 2, price: 25000 }
          ],
          payment_method: 'cash'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.total_amount).toBe(50000);
      expect(response.body.data.status).toBe('pending');
    });

    test('should reject order with insufficient stock', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          customer_id: customerId,
          items: [
            { menu_id: menuId, quantity: 20, price: 25000 }
          ],
          payment_method: 'cash'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should reject order with non-existent menu', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          customer_id: customerId,
          items: [
            { menu_id: 999, quantity: 2, price: 25000 }
          ],
          payment_method: 'cash'
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/orders', () => {
    test('should retrieve all orders', async () => {
      const items = [{ menu_id: menuId, quantity: 2, price: 25000 }];
      await Order.create(customerId, items, 'cash');

      const customer2 = await Customer.create('Jane Doe', 'jane@example.com', '08987654321');
      await Order.create(customer2.id, items, 'card');

      const response = await request(app).get('/api/orders');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
    });
  });

  describe('GET /api/orders/:id', () => {
    test('should retrieve order by ID with items', async () => {
      const items = [{ menu_id: menuId, quantity: 2, price: 25000 }];
      const order = await Order.create(customerId, items, 'cash');

      const response = await request(app).get(`/api/orders/${order.id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toBeDefined();
      expect(response.body.data.items.length).toBe(1);
    });
  });

  describe('GET /api/orders/customer/:customerId', () => {
    test('should retrieve orders by customer', async () => {
      const items = [{ menu_id: menuId, quantity: 2, price: 25000 }];
      await Order.create(customerId, items, 'cash');
      await Order.create(customerId, items, 'card');

      const response = await request(app).get(`/api/orders/customer/${customerId}`);

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(2);
    });
  });

  describe('GET /api/orders/status/:status', () => {
    test('should retrieve orders by status', async () => {
      const items = [{ menu_id: menuId, quantity: 2, price: 25000 }];
      const order = await Order.create(customerId, items, 'cash');
      await Order.updateStatus(order.id, 'confirmed');

      const response = await request(app).get('/api/orders/status/confirmed');

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].status).toBe('confirmed');
    });
  });

  describe('PUT /api/orders/:id/status', () => {
    test('should update order status successfully', async () => {
      const items = [{ menu_id: menuId, quantity: 2, price: 25000 }];
      const order = await Order.create(customerId, items, 'cash');

      const response = await request(app)
        .put(`/api/orders/${order.id}/status`)
        .send({ status: 'confirmed' });

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('confirmed');
    });
  });

  describe('PUT /api/orders/:id/cancel', () => {
    test('should cancel order successfully', async () => {
      const items = [{ menu_id: menuId, quantity: 2, price: 25000 }];
      const order = await Order.create(customerId, items, 'cash');

      const response = await request(app).put(`/api/orders/${order.id}/cancel`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/orders/:customerId/summary', () => {
    test('should get customer order summary', async () => {
      const items = [{ menu_id: menuId, quantity: 2, price: 25000 }];
      await Order.create(customerId, items, 'cash');
      await Order.create(customerId, items, 'card');

      const response = await request(app).get(`/api/orders/${customerId}/summary`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.total_orders).toBe(2);
      expect(response.body.data.total_spent).toBe(100000);
    });
  });
});

describe('Payment API Integration Tests', () => {
  let customerId, menuId, orderId;

  beforeAll(async () => {
    await initializeDatabase();
  });

  beforeEach(async () => {
    await clearAllTables();

    const customer = await Customer.create('John Doe', 'john@example.com', '08123456789');
    customerId = customer.id;

    const menu = await Menu.create('Nasi Kuning', 'Description', 25000, 'Rice', 10);
    menuId = menu.id;

    const items = [{ menu_id: menuId, quantity: 2, price: 25000 }];
    const order = await Order.create(customerId, items, 'cash');
    orderId = order.id;
  });

  describe('POST /api/payments', () => {
    test('should create payment successfully via API', async () => {
      const response = await request(app)
        .post('/api/payments')
        .send({
          order_id: orderId,
          amount: 50000,
          payment_method: 'cash'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.amount).toBe(50000);
      expect(response.body.data.status).toBe('pending');
    });

    test('should reject payment with invalid amount', async () => {
      const response = await request(app)
        .post('/api/payments')
        .send({
          order_id: orderId,
          amount: 0,
          payment_method: 'cash'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/payments', () => {
    test('should retrieve all payments', async () => {
      await request(app)
        .post('/api/payments')
        .send({
          order_id: orderId,
          amount: 50000,
          payment_method: 'cash'
        });

      const response = await request(app).get('/api/payments');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/payments/order/:orderId', () => {
    test('should retrieve payments by order', async () => {
      await request(app)
        .post('/api/payments')
        .send({
          order_id: orderId,
          amount: 50000,
          payment_method: 'cash'
        });

      const response = await request(app).get(`/api/payments/order/${orderId}`);

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(1);
    });
  });

  describe('PUT /api/payments/:id/status', () => {
    test('should update payment status successfully', async () => {
      const paymentRes = await request(app)
        .post('/api/payments')
        .send({
          order_id: orderId,
          amount: 50000,
          payment_method: 'cash'
        });

      const paymentId = paymentRes.body.data.id;

      const response = await request(app)
        .put(`/api/payments/${paymentId}/status`)
        .send({ status: 'completed' });

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('completed');
    });
  });

  describe('GET /api/revenue/by-method', () => {
    test('should retrieve revenue by payment method', async () => {
      const payment = await request(app)
        .post('/api/payments')
        .send({
          order_id: orderId,
          amount: 50000,
          payment_method: 'cash'
        });

      await request(app)
        .put(`/api/payments/${payment.body.data.id}/status`)
        .send({ status: 'completed' });

      const response = await request(app).get('/api/revenue/by-method');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});

describe('Full Order Flow Integration Test', () => {
  let customerId, menuId;

  beforeAll(async () => {
    await initializeDatabase();
  });

  beforeEach(async () => {
    await clearAllTables();

    const customer = await Customer.create('John Doe', 'john@example.com', '08123456789');
    customerId = customer.id;

    const menu = await Menu.create('Nasi Kuning', 'Description', 25000, 'Rice', 10);
    menuId = menu.id;
  });

  test('should complete full order workflow: create -> confirm -> process payment', async () => {
    // Step 1: Create order
    const orderRes = await request(app)
      .post('/api/orders')
      .send({
        customer_id: customerId,
        items: [{ menu_id: menuId, quantity: 2, price: 25000 }],
        payment_method: 'cash'
      });

    expect(orderRes.status).toBe(201);
    const orderId = orderRes.body.data.id;

    // Step 2: Confirm order
    const confirmRes = await request(app)
      .put(`/api/orders/${orderId}/status`)
      .send({ status: 'confirmed' });

    expect(confirmRes.status).toBe(200);
    expect(confirmRes.body.data.status).toBe('confirmed');

    // Step 3: Create payment
    const paymentRes = await request(app)
      .post('/api/payments')
      .send({
        order_id: orderId,
        amount: 50000,
        payment_method: 'cash'
      });

    expect(paymentRes.status).toBe(201);
    const paymentId = paymentRes.body.data.id;

    // Step 4: Complete payment
    const completePaymentRes = await request(app)
      .put(`/api/payments/${paymentId}/status`)
      .send({ status: 'completed' });

    expect(completePaymentRes.status).toBe(200);
    expect(completePaymentRes.body.data.status).toBe('completed');

    // Step 5: Verify final state
    const orderCheckRes = await request(app).get(`/api/orders/${orderId}`);
    expect(orderCheckRes.body.data.status).toBe('confirmed');
  });
});
