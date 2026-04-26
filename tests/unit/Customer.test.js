const Customer = require('../../src/models/Customer');
const { db, initializeDatabase, clearAllTables } = require('../../db/database');

describe('Customer Model Unit Tests', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  beforeEach(async () => {
    await clearAllTables();
  });

  describe('Create Customer', () => {
    test('should create a customer with valid data', async () => {
      const customer = await Customer.create('John Doe', 'john@example.com', '08123456789', 'Jl. Sudirman');
      
      expect(customer).toHaveProperty('id');
      expect(customer.name).toBe('John Doe');
      expect(customer.email).toBe('john@example.com');
      expect(customer.phone).toBe('08123456789');
    });

    test('should reject customer creation with empty name', async () => {
      expect.assertions(1);
      try {
        await Customer.create('', 'john@example.com', '08123456789');
      } catch (error) {
        expect(error.message).toBe('Customer name is required');
      }
    });

    test('should reject customer with invalid email format', async () => {
      expect.assertions(1);
      try {
        await Customer.create('John Doe', 'invalid-email', '08123456789');
      } catch (error) {
        expect(error.message).toBe('Invalid email format');
      }
    });

    test('should reject customer with invalid phone format', async () => {
      expect.assertions(1);
      try {
        await Customer.create('John Doe', 'john@example.com', 'abc');
      } catch (error) {
        expect(error.message).toBe('Invalid phone format');
      }
    });

    test('should reject duplicate email', async () => {
      expect.assertions(1);
      await Customer.create('John Doe', 'john@example.com', '08123456789');
      
      try {
        await Customer.create('Jane Doe', 'john@example.com', '08987654321');
      } catch (error) {
        expect(error.message).toBe('Email already exists');
      }
    });

    test('should create customer without optional fields', async () => {
      const customer = await Customer.create('John Doe');
      
      expect(customer.id).toBeDefined();
      expect(customer.name).toBe('John Doe');
      expect(customer.email).toBeNull();
      expect(customer.phone).toBeNull();
    });
  });

  describe('Get Customer', () => {
    test('should get customer by ID', async () => {
      const created = await Customer.create('John Doe', 'john@example.com', '08123456789');
      const customer = await Customer.getById(created.id);
      
      expect(customer.id).toBe(created.id);
      expect(customer.name).toBe('John Doe');
    });

    test('should return undefined for non-existent customer', async () => {
      const customer = await Customer.getById(999);
      expect(customer).toBeUndefined();
    });

    test('should get all customers', async () => {
      await Customer.create('John Doe', 'john@example.com', '08123456789');
      await Customer.create('Jane Doe', 'jane@example.com', '08987654321');
      
      const customers = await Customer.getAll();
      expect(customers.length).toBe(2);
    });
  });

  describe('Update Customer', () => {
    test('should update customer successfully', async () => {
      const created = await Customer.create('John Doe', 'john@example.com', '08123456789');
      const updated = await Customer.update(created.id, 'John Smith', 'john@example.com', '08123456789');
      
      expect(updated.name).toBe('John Smith');
    });

    test('should reject update with empty name', async () => {
      expect.assertions(1);
      const created = await Customer.create('John Doe', 'john@example.com', '08123456789');
      
      try {
        await Customer.update(created.id, '', 'john@example.com');
      } catch (error) {
        expect(error.message).toBe('Customer name cannot be empty');
      }
    });

    test('should reject update of non-existent customer', async () => {
      expect.assertions(1);
      try {
        await Customer.update(999, 'John Smith', 'john@example.com');
      } catch (error) {
        expect(error.message).toBe('Customer not found');
      }
    });
  });

  describe('Delete Customer', () => {
    test('should delete customer successfully', async () => {
      const created = await Customer.create('John Doe', 'john@example.com', '08123456789');
      await Customer.delete(created.id);
      
      const customer = await Customer.getById(created.id);
      expect(customer).toBeUndefined();
    });

    test('should reject deletion of non-existent customer', async () => {
      expect.assertions(1);
      try {
        await Customer.delete(999);
      } catch (error) {
        expect(error.message).toBe('Customer not found');
      }
    });
  });

  describe('Email Validation', () => {
    test('should validate correct email format', () => {
      expect(Customer.isValidEmail('test@example.com')).toBe(true);
      expect(Customer.isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    test('should reject invalid email format', () => {
      expect(Customer.isValidEmail('invalid')).toBe(false);
      expect(Customer.isValidEmail('invalid@')).toBe(false);
      expect(Customer.isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('Phone Validation', () => {
    test('should validate correct phone format', () => {
      expect(Customer.isValidPhone('08123456789')).toBe(true);
      expect(Customer.isValidPhone('(081) 234-56789')).toBe(true);
    });

    test('should reject invalid phone format', () => {
      expect(Customer.isValidPhone('abc')).toBe(false);
      expect(Customer.isValidPhone('123')).toBe(false);
    });
  });
});
