const request = require('supertest');
const app = require('../../src/app');
const { initializeDatabase, clearAllTables, db } = require('../../db/database');
const Customer = require('../../src/models/Customer');
const Menu = require('../../src/models/Menu');

describe('Customer API Integration Tests', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  beforeEach(async () => {
    await clearAllTables();
  });

  describe('POST /api/customers', () => {
    test('should create customer successfully via API', async () => {
      const response = await request(app)
        .post('/api/customers')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '08123456789',
          address: 'Jl. Sudirman, Jakarta'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('John Doe');
      expect(response.body.data).toHaveProperty('id');
    });

    test('should return 400 for invalid customer data', async () => {
      const response = await request(app)
        .post('/api/customers')
        .send({
          name: '',
          email: 'john@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/customers', () => {
    test('should retrieve all customers', async () => {
      await Customer.create('John Doe', 'john@example.com', '08123456789');
      await Customer.create('Jane Doe', 'jane@example.com', '08987654321');

      const response = await request(app).get('/api/customers');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data.length).toBe(2);
    });

    test('should return empty list when no customers', async () => {
      const response = await request(app).get('/api/customers');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
    });
  });

  describe('GET /api/customers/:id', () => {
    test('should retrieve customer by ID', async () => {
      const customer = await Customer.create('John Doe', 'john@example.com', '08123456789');

      const response = await request(app).get(`/api/customers/${customer.id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('John Doe');
    });

    test('should return 404 for non-existent customer', async () => {
      const response = await request(app).get('/api/customers/999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/customers/:id', () => {
    test('should update customer successfully', async () => {
      const customer = await Customer.create('John Doe', 'john@example.com', '08123456789');

      const response = await request(app)
        .put(`/api/customers/${customer.id}`)
        .send({
          name: 'John Smith',
          email: 'john@example.com',
          phone: '08123456789'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('John Smith');
    });
  });

  describe('DELETE /api/customers/:id', () => {
    test('should delete customer successfully', async () => {
      const customer = await Customer.create('John Doe', 'john@example.com', '08123456789');

      const response = await request(app).delete(`/api/customers/${customer.id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify deletion
      const check = await request(app).get(`/api/customers/${customer.id}`);
      expect(check.status).toBe(404);
    });
  });
});

describe('Menu API Integration Tests', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  beforeEach(async () => {
    await clearAllTables();
  });

  describe('POST /api/menus', () => {
    test('should create menu item successfully via API', async () => {
      const response = await request(app)
        .post('/api/menus')
        .send({
          name: 'Nasi Kuning',
          description: 'Nasi kuning dengan telur',
          price: 25000,
          category: 'Rice',
          stock: 10
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Nasi Kuning');
    });
  });

  describe('GET /api/menus', () => {
    test('should retrieve all available menus', async () => {
      await Menu.create('Nasi Kuning', 'Description', 25000, 'Rice', 10);
      await Menu.create('Soto Ayam', 'Description', 15000, 'Soup', 5);

      const response = await request(app).get('/api/menus');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
    });
  });

  describe('GET /api/menus/category/:category', () => {
    test('should retrieve menus by category', async () => {
      await Menu.create('Nasi Kuning', 'Description', 25000, 'Rice', 10);
      await Menu.create('Nasi Goreng', 'Description', 20000, 'Rice', 8);
      await Menu.create('Soto Ayam', 'Description', 15000, 'Soup', 5);

      const response = await request(app).get('/api/menus/category/Rice');

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(2);
    });
  });

  describe('PUT /api/menus/:id', () => {
    test('should update menu item successfully', async () => {
      const menu = await Menu.create('Nasi Kuning', 'Description', 25000, 'Rice', 10);

      const response = await request(app)
        .put(`/api/menus/${menu.id}`)
        .send({
          name: 'Nasi Kuning Premium',
          description: 'Updated description',
          price: 30000,
          category: 'Rice',
          stock: 15,
          is_available: 1
        });

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('Nasi Kuning Premium');
    });
  });

  describe('DELETE /api/menus/:id', () => {
    test('should delete menu item successfully', async () => {
      const menu = await Menu.create('Nasi Kuning', 'Description', 25000, 'Rice', 10);

      const response = await request(app).delete(`/api/menus/${menu.id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
