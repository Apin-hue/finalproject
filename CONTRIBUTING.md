# CONTRIBUTING GUIDELINES

Panduan untuk development dan contributing pada Diadoek Restaurant System.

---

## 🎯 Code Standards

### Naming Conventions

**Files:**
- Models: `PascalCase` (e.g., `Customer.js`)
- Controllers: `PascalCase` (e.g., `CustomerController.js`)
- Routes: `camelCase` (e.g., `customerRoutes.js`)
- Tests: `ClassName.test.js` (e.g., `Customer.test.js`)

**Variables & Functions:**
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRIES`)
- Functions: `camelCase` (e.g., `getUserById()`)
- Classes: `PascalCase` (e.g., `CustomerModel`)
- Private: Prefix underscore (e.g., `_insertOrderItems()`)

**Database:**
- Tables: `snake_case` (e.g., `order_items`)
- Columns: `snake_case` (e.g., `created_at`)

---

## ✅ Code Quality

### Best Practices

1. **Always Validate Input**
```javascript
// ✅ Good
if (!name || name.trim() === '') {
  throw new Error('Name is required');
}

// ❌ Bad
if (name) {
  // process without validation
}
```

2. **Proper Error Handling**
```javascript
// ✅ Good
try {
  const result = await operation();
  return result;
} catch (error) {
  throw new Error(`Operation failed: ${error.message}`);
}

// ❌ Bad
const result = await operation();
return result;
```

3. **Consistent Response Format**
```javascript
// ✅ Good
res.json({
  success: true,
  message: "Operation successful",
  data: result
});

// ❌ Bad
res.json(result);
```

4. **DRY Principle - Don't Repeat Yourself**
```javascript
// ✅ Good - Create helper function
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Then reuse everywhere

// ❌ Bad - Repeating code
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  // validate 1
}
// ... later ...
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  // validate 2
}
```

---

## 🧪 Testing Standards

### Writing New Tests

1. **Unit Test Structure**
```javascript
describe('ComponentName Unit Tests', () => {
  beforeAll(async () => {
    // Setup once
  });

  beforeEach(async () => {
    // Setup before each test
  });

  describe('Feature Group', () => {
    test('should do something when condition is met', async () => {
      // Arrange
      const input = { /* setup */ };
      
      // Act
      const result = await function(input);
      
      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

2. **Test Naming**
- Be descriptive
- Use "should" pattern
- Test name = expected behavior

```javascript
// ✅ Good test names
test('should create customer with valid data')
test('should reject customer with empty name')
test('should throw error for duplicate email')

// ❌ Bad test names
test('customer test')
test('create')
test('error')
```

3. **AAA Pattern (Arrange-Act-Assert)**
```javascript
test('should calculate order total correctly', async () => {
  // Arrange
  const items = [
    { price: 10000, quantity: 2 },
    { price: 5000, quantity: 1 }
  ];
  const expected = 25000;

  // Act
  const total = calculateTotal(items);

  // Assert
  expect(total).toBe(expected);
});
```

4. **Test Coverage Goals**
- Aim for > 70% coverage for new code
- Test happy path AND error cases
- Test edge cases
- Test validation rules

---

## 📝 Commit Guidelines

### Commit Message Format

Use conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `test`: Adding or updating tests
- `docs`: Documentation
- `refactor`: Code refactoring
- `chore`: Maintenance
- `ci`: CI/CD changes

**Examples:**
```bash
# Good commits
git commit -m "feat(order): add order cancellation feature"
git commit -m "fix(payment): fix payment status update issue"
git commit -m "test(customer): add email validation tests"
git commit -m "docs: update API documentation"
git commit -m "refactor(database): optimize query performance"

# Bad commits
git commit -m "updated"
git commit -m "fixed bug"
git commit -m "changes"
```

---

## 📁 Project Structure Rules

### File Organization

```
src/
├── models/          (Business logic only)
├── controllers/     (Request/response handling)
├── routes/          (Define endpoints only)
├── middleware/      (Express middleware)
└── utils/           (Shared utilities)
```

**Rules:**
- Models: No HTTP logic
- Controllers: No database queries (use models)
- Routes: No business logic
- Keep separation of concerns

---

## 🔒 Security Practices

### Input Validation
```javascript
// ✅ Always validate
if (!email || !isValidEmail(email)) {
  throw new Error('Invalid email');
}

// ❌ Never trust user input
const result = db.query(`SELECT * FROM users WHERE email = '${email}'`);
// SQL Injection vulnerability!
```

### Parameterized Queries
```javascript
// ✅ Good - Prevents SQL injection
const query = 'SELECT * FROM users WHERE email = ?';
db.get(query, [email], callback);

// ❌ Bad - SQL injection risk
const query = `SELECT * FROM users WHERE email = '${email}'`;
db.get(query, callback);
```

### Error Messages
```javascript
// ✅ Good - Safe error message
throw new Error('Invalid credentials');

// ❌ Bad - Reveals system details
throw new Error('Database connection failed: localhost:3306');
```

---

## 🚀 Performance Guidelines

### Database Queries

1. **Use Indexes**
```javascript
// Consider adding indexes for frequently queried columns
// Future: db.run('CREATE INDEX idx_email ON customers(email)');
```

2. **Avoid N+1 Queries**
```javascript
// ❌ Bad - Multiple queries
const orders = await Order.getAll();
for (const order of orders) {
  const items = await Order.getItems(order.id); // N+1 problem
}

// ✅ Good - Single query with join
const orders = await Order.getAllWithItems();
```

3. **Pagination (Future)**
```javascript
// When adding: limit result sets
const limit = 10;
const offset = (page - 1) * limit;
// SELECT * FROM orders LIMIT ? OFFSET ?
```

---

## 📚 Documentation Standards

### Code Documentation

```javascript
/**
 * Create a new customer record
 * @param {string} name - Customer name (required)
 * @param {string} email - Customer email (optional, must be unique)
 * @param {string} phone - Customer phone (optional, 10-15 digits)
 * @returns {Promise<Object>} Created customer object
 * @throws {Error} If validation fails or email already exists
 */
static async create(name, email, phone) {
  // implementation
}
```

### README Documentation

Update README when:
- Adding new features
- Changing API endpoints
- Adding new database tables
- Changing dependencies
- Important bug fixes

---

## 🔄 Pull Request Process

1. **Before Creating PR**
   - Run all tests: `npm test`
   - Check coverage: `npm test -- --coverage`
   - Lint code (if available)
   - Update relevant documentation

2. **PR Description**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Test addition
- [ ] Documentation update

## Testing Done
- [ ] Unit tests added
- [ ] Integration tests added
- [ ] Manual testing performed

## Checklist
- [ ] Tests pass
- [ ] Coverage maintained
- [ ] Documentation updated
- [ ] No breaking changes
```

3. **Before Merging**
   - All tests must pass
   - Coverage >= 60%
   - At least 1 review approval
   - CI/CD pipeline successful

---

## 🎓 Learning Resources

### Recommended Reading

1. **Testing**
   - Jest Documentation: https://jestjs.io
   - Supertest: https://github.com/visionmedia/supertest
   - Testing Best Practices

2. **Node.js & Express**
   - Express Guide: https://expressjs.com
   - Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices

3. **Database**
   - SQLite Documentation
   - Database Design Principles
   - Relationships & Foreign Keys

---

## 👥 Team Communication

### Before Starting Work

1. Check existing issues
2. Check pull requests
3. Discuss major changes
4. Mention in team chat

### During Development

1. Keep commits small and focused
2. Write clear commit messages
3. Ask for help if stuck
4. Share progress updates

### Code Review Etiquette

**When giving feedback:**
- Be respectful and constructive
- Focus on code, not person
- Suggest improvements, not demands
- Praise good practices

**When receiving feedback:**
- Be open to suggestions
- Explain your reasoning if you disagree
- Ask clarifying questions
- Thank reviewers

---

## 🐛 Bug Reporting

### Issue Template

```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Node version: 
- npm version:
- OS:

## Error Message/Logs
```

---

## ✨ Code Review Checklist

When reviewing code, check:

- [ ] Code follows naming conventions
- [ ] Input validation present
- [ ] Error handling implemented
- [ ] Tests included and passing
- [ ] Coverage maintained
- [ ] Documentation updated
- [ ] No security issues
- [ ] Performance acceptable
- [ ] DRY principle followed
- [ ] Code is readable

---

**Remember:** Write code for humans, not computers. Make it clear, maintainable, and well-tested! 🚀

Last Updated: April 2024
