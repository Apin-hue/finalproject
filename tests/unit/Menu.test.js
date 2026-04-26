const Menu = require('../../src/models/Menu');
const { db, initializeDatabase, clearAllTables } = require('../../db/database');

describe('Menu Model Unit Tests', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  beforeEach(async () => {
    await clearAllTables();
  });

  describe('Create Menu', () => {
    test('should create a menu item with valid data', async () => {
      const menu = await Menu.create('Nasi Kuning', 'Nasi kuning dengan telur dan timun', 25000, 'Rice', 10);
      
      expect(menu).toHaveProperty('id');
      expect(menu.name).toBe('Nasi Kuning');
      expect(menu.price).toBe(25000);
      expect(menu.category).toBe('Rice');
      expect(menu.stock).toBe(10);
    });

    test('should reject menu creation with empty name', async () => {
      expect.assertions(1);
      try {
        await Menu.create('', 'Description', 25000, 'Rice');
      } catch (error) {
        expect(error.message).toBe('Menu name is required');
      }
    });

    test('should reject menu creation with invalid price', async () => {
      expect.assertions(1);
      try {
        await Menu.create('Nasi Kuning', 'Description', 0, 'Rice');
      } catch (error) {
        expect(error.message).toBe('Price must be greater than 0');
      }
    });

    test('should reject menu creation with negative price', async () => {
      expect.assertions(1);
      try {
        await Menu.create('Nasi Kuning', 'Description', -5000, 'Rice');
      } catch (error) {
        expect(error.message).toBe('Price must be greater than 0');
      }
    });

    test('should reject menu creation with empty category', async () => {
      expect.assertions(1);
      try {
        await Menu.create('Nasi Kuning', 'Description', 25000, '');
      } catch (error) {
        expect(error.message).toBe('Category is required');
      }
    });

    test('should reject menu creation with negative stock', async () => {
      expect.assertions(1);
      try {
        await Menu.create('Nasi Kuning', 'Description', 25000, 'Rice', -5);
      } catch (error) {
        expect(error.message).toBe('Stock cannot be negative');
      }
    });

    test('should create menu with max stock by default', async () => {
      const menu = await Menu.create('Nasi Kuning', 'Description', 25000, 'Rice');
      expect(menu.stock).toBe(0);
    });
  });

  describe('Get Menu', () => {
    test('should get menu by ID', async () => {
      const created = await Menu.create('Nasi Kuning', 'Description', 25000, 'Rice', 10);
      const menu = await Menu.getById(created.id);
      
      expect(menu.id).toBe(created.id);
      expect(menu.name).toBe('Nasi Kuning');
    });

    test('should get all menus', async () => {
      await Menu.create('Nasi Kuning', 'Description', 25000, 'Rice', 10);
      await Menu.create('Soto Ayam', 'Description', 15000, 'Soup', 5);
      
      const menus = await Menu.getAll();
      expect(menus.length).toBe(2);
    });

    test('should get menus by category', async () => {
      await Menu.create('Nasi Kuning', 'Description', 25000, 'Rice', 10);
      await Menu.create('Nasi Goreng', 'Description', 20000, 'Rice', 8);
      await Menu.create('Soto Ayam', 'Description', 15000, 'Soup', 5);
      
      const menus = await Menu.getByCategory('Rice');
      expect(menus.length).toBe(2);
    });
  });

  describe('Update Menu', () => {
    test('should update menu successfully', async () => {
      const created = await Menu.create('Nasi Kuning', 'Description', 25000, 'Rice', 10);
      const updated = await Menu.update(created.id, 'Nasi Kuning Premium', 'Updated description', 30000, 'Rice', 15, 1);
      
      expect(updated.name).toBe('Nasi Kuning Premium');
      expect(updated.price).toBe(30000);
      expect(updated.stock).toBe(15);
    });

    test('should reject update with invalid price', async () => {
      expect.assertions(1);
      const created = await Menu.create('Nasi Kuning', 'Description', 25000, 'Rice', 10);
      
      try {
        await Menu.update(created.id, 'Nasi Kuning', 'Description', 0, 'Rice');
      } catch (error) {
        expect(error.message).toBe('Price must be greater than 0');
      }
    });

    test('should reject update of non-existent menu', async () => {
      expect.assertions(1);
      try {
        await Menu.update(999, 'Nasi Kuning', 'Description', 25000, 'Rice');
      } catch (error) {
        expect(error.message).toBe('Menu not found');
      }
    });
  });

  describe('Stock Management', () => {
    test('should update stock when item is ordered', async () => {
      const menu = await Menu.create('Nasi Kuning', 'Description', 25000, 'Rice', 10);
      const newStock = await Menu.updateStock(menu.id, 3);
      
      expect(newStock).toBe(7);
    });

    test('should reject order with insufficient stock', async () => {
      expect.assertions(1);
      const menu = await Menu.create('Nasi Kuning', 'Description', 25000, 'Rice', 2);
      
      try {
        await Menu.updateStock(menu.id, 5);
      } catch (error) {
        expect(error.message).toBe('Insufficient stock');
      }
    });

    test('should update stock to zero on complete order', async () => {
      const menu = await Menu.create('Nasi Kuning', 'Description', 25000, 'Rice', 3);
      const newStock = await Menu.updateStock(menu.id, 3);
      
      expect(newStock).toBe(0);
    });
  });

  describe('Soft Delete Menu', () => {
    test('should soft delete menu item', async () => {
      const menu = await Menu.create('Nasi Kuning', 'Description', 25000, 'Rice', 10);
      await Menu.delete(menu.id);
      
      const menus = await Menu.getAll();
      expect(menus.length).toBe(0);
    });

    test('should reject deletion of non-existent menu', async () => {
      expect.assertions(1);
      try {
        await Menu.delete(999);
      } catch (error) {
        expect(error.message).toBe('Menu not found');
      }
    });
  });
});
