# 📑 DOCUMENTATION INDEX
## Diadoek Restaurant Management System

Quick reference untuk semua dokumentasi dan file dalam project.

---

## 🚀 QUICK START

**Baru di project?**
1. Read: [README.md](README.md) - Overview & features
2. Read: [SETUP_GUIDE.md](SETUP_GUIDE.md) - Installation & running
3. Run: `npm install && npm test`

---

## 📚 DOCUMENTATION FILES

### Getting Started
| File | Purpose | Read Time |
|------|---------|-----------|
| [README.md](README.md) | Complete project overview | 10-15 min |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Step-by-step setup instructions | 10 min |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Completion checklist & metrics | 5 min |

### API & Development
| File | Purpose | Read Time |
|------|---------|-----------|
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | Complete API reference with examples | 15 min |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Code standards & guidelines | 10 min |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Common issues & solutions | As needed |

### Reports & Analysis
| File | Purpose | Read Time |
|------|---------|-----------|
| [LAPORAN_PROYEK.md](LAPORAN_PROYEK.md) | Formal 2-3 page project report | 10 min |
| [LICENSE](LICENSE) | MIT License | 2 min |

---

## 📂 SOURCE CODE STRUCTURE

### Application Code (src/)

**Models** - Business Logic
- [src/models/Customer.js](src/models/Customer.js) - Customer data operations
- [src/models/Menu.js](src/models/Menu.js) - Menu management
- [src/models/Order.js](src/models/Order.js) - Order handling
- [src/models/Payment.js](src/models/Payment.js) - Payment processing

**Controllers** - Request Handlers
- [src/controllers/CustomerController.js](src/controllers/CustomerController.js) - Customer endpoints
- [src/controllers/MenuController.js](src/controllers/MenuController.js) - Menu endpoints
- [src/controllers/OrderController.js](src/controllers/OrderController.js) - Order endpoints
- [src/controllers/PaymentController.js](src/controllers/PaymentController.js) - Payment endpoints

**Routes** - API Definitions
- [src/routes/customerRoutes.js](src/routes/customerRoutes.js) - /api/customers/*
- [src/routes/menuRoutes.js](src/routes/menuRoutes.js) - /api/menus/*
- [src/routes/orderRoutes.js](src/routes/orderRoutes.js) - /api/orders/*
- [src/routes/paymentRoutes.js](src/routes/paymentRoutes.js) - /api/payments/*

**Main Application**
- [src/app.js](src/app.js) - Express app setup & middleware

### Database (db/)

- [db/database.js](db/database.js) - SQLite initialization & schema
- [db/helpers.js](db/helpers.js) - Database utility functions

### Tests

**Unit Tests** (31 test cases)
- [tests/unit/Customer.test.js](tests/unit/Customer.test.js) - Customer model tests
- [tests/unit/Menu.test.js](tests/unit/Menu.test.js) - Menu model tests
- [tests/unit/Order.test.js](tests/unit/Order.test.js) - Order model tests
- [tests/unit/Payment.test.js](tests/unit/Payment.test.js) - Payment model tests

**Integration Tests** (10+ test cases)
- [tests/integration/API.test.js](tests/integration/API.test.js) - Customer & Menu APIs
- [tests/integration/OrderPayment.test.js](tests/integration/OrderPayment.test.js) - Order & Payment workflows

### Configuration

- [package.json](package.json) - Dependencies & npm scripts
- [jest.config.js](jest.config.js) - Jest testing configuration
- [.env.example](.env.example) - Environment variables template
- [.gitignore](.gitignore) - Git ignore rules

### CI/CD

- [.github/workflows/ci.yml](.github/workflows/ci.yml) - GitHub Actions pipeline

---

## 🎯 COMMON TASKS

### Development

**Start development server:**
```bash
npm run dev
# Server runs at http://localhost:3000
```

**Run all tests:**
```bash
npm test
```

**Generate coverage report:**
```bash
npm test -- --coverage
# Open: coverage/lcov-report/index.html
```

**Test specific file:**
```bash
npm test -- Customer.test.js
```

### API Testing

**Using curl:**
```bash
curl http://localhost:3000/health
```

**Using Postman:**
1. Import endpoints dari [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
2. Test endpoints manually
3. Check responses

### Database Management

**Reset database:**
```bash
rm db/diadoek.db
npm run dev  # Auto-creates new database
```

**View database (SQLite CLI):**
```bash
sqlite3 db/diadoek.db
.tables
SELECT * FROM customers;
.quit
```

---

## 📖 FEATURE DOCUMENTATION

### Customer Management
- **Docs:** [API_DOCUMENTATION.md#customer-endpoints](API_DOCUMENTATION.md#-customer-endpoints)
- **Code:** [src/models/Customer.js](src/models/Customer.js)
- **Tests:** [tests/unit/Customer.test.js](tests/unit/Customer.test.js)
- **Routes:** [src/routes/customerRoutes.js](src/routes/customerRoutes.js)

### Menu Management
- **Docs:** [API_DOCUMENTATION.md#menu-endpoints](API_DOCUMENTATION.md#️-menu-endpoints)
- **Code:** [src/models/Menu.js](src/models/Menu.js)
- **Tests:** [tests/unit/Menu.test.js](tests/unit/Menu.test.js)
- **Routes:** [src/routes/menuRoutes.js](src/routes/menuRoutes.js)

### Order Management
- **Docs:** [API_DOCUMENTATION.md#order-endpoints](API_DOCUMENTATION.md#-order-endpoints)
- **Code:** [src/models/Order.js](src/models/Order.js)
- **Tests:** [tests/unit/Order.test.js](tests/unit/Order.test.js) + [tests/integration/OrderPayment.test.js](tests/integration/OrderPayment.test.js)
- **Routes:** [src/routes/orderRoutes.js](src/routes/orderRoutes.js)

### Payment Management
- **Docs:** [API_DOCUMENTATION.md#payment-endpoints](API_DOCUMENTATION.md#-payment-endpoints)
- **Code:** [src/models/Payment.js](src/models/Payment.js)
- **Tests:** [tests/unit/Payment.test.js](tests/unit/Payment.test.js) + [tests/integration/OrderPayment.test.js](tests/integration/OrderPayment.test.js)
- **Routes:** [src/routes/paymentRoutes.js](src/routes/paymentRoutes.js)

---

## 🧪 TESTING REFERENCE

### Test Statistics
- **Unit Tests:** 31 test cases
- **Integration Tests:** 10+ test cases
- **Total Coverage:** 65.2%
- **Coverage Target:** 60% (✅ EXCEEDED)

### Test Files
- Unit: [tests/unit/](tests/unit/Customer.test.js)
- Integration: [tests/integration/](tests/integration/API.test.js)

### Running Tests
```bash
npm test                      # All tests + coverage
npm run test:unit            # Unit tests only
npm run test:integration     # Integration tests only
npm run test:watch           # Watch mode
```

---

## 🔍 TROUBLESHOOTING

**Having issues?**
- Check: [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common problems & solutions
- Check: [SETUP_GUIDE.md](SETUP_GUIDE.md) - Installation help
- Check: Test files for usage examples

**Common commands:**
```bash
# View help
npm list
npm audit

# Clear cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install

# Reset database
rm db/diadoek.db
npm run dev
```

---

## 📊 PROJECT METRICS

| Metric | Value |
|--------|-------|
| Total Files | 25+ |
| Lines of Production Code | 2,100+ |
| Lines of Test Code | 1,800+ |
| Test Cases | 41+ |
| API Endpoints | 26+ |
| Database Tables | 5 |
| Code Coverage | 65.2% |
| Documentation Files | 9 |

---

## 🔗 NAVIGATION GUIDE

### For Project Managers
1. [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Status & metrics
2. [LAPORAN_PROYEK.md](LAPORAN_PROYEK.md) - Detailed report

### For Developers
1. [SETUP_GUIDE.md](SETUP_GUIDE.md) - Setup instructions
2. [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference
3. [CONTRIBUTING.md](CONTRIBUTING.md) - Code standards
4. [README.md](README.md) - Full documentation

### For QA/Testing
1. [README.md](README.md#-testing-results) - Test results
2. [LAPORAN_PROYEK.md](LAPORAN_PROYEK.md#3-strategi-testing) - Testing strategy
3. [tests/](tests/) - Test files

### For DevOps/CI-CD
1. [.github/workflows/ci.yml](.github/workflows/ci.yml) - CD pipeline
2. [README.md](README.md#-continuous-integration) - CI explanation
3. [package.json](package.json) - Build scripts

---

## 📝 FILE SIZE REFERENCE

| Category | Files |
|----------|-------|
| Source Code | 13 files |
| Tests | 6 files |
| Configuration | 5 files |
| Documentation | 9 files |
| Database | 2 files |
| **Total** | **35+ files** |

---

## 🚀 NEXT STEPS

### For First-Time Setup
1. Read [README.md](README.md)
2. Follow [SETUP_GUIDE.md](SETUP_GUIDE.md)
3. Run `npm test` - all tests should pass
4. Run `npm run dev` - server should start

### For API Integration
1. Read [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
2. Check example curl commands
3. Test with Postman or curl
4. Integrate into your client application

### For Deployment
1. Check [README.md#-deployment](README.md#-deployment)
2. Configure environment variables
3. Run production build
4. Setup CI/CD with GitHub Actions

### For Contributing
1. Read [CONTRIBUTING.md](CONTRIBUTING.md)
2. Follow code standards
3. Write tests for new features
4. Submit pull request

---

## 📞 COMMON QUESTIONS

**Where's the source code?**
→ [src/](src/) folder

**Where are the tests?**
→ [tests/](tests/) folder

**How do I run the app?**
→ Follow [SETUP_GUIDE.md](SETUP_GUIDE.md)

**What are the API endpoints?**
→ Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

**How's the code structured?**
→ See [README.md#-project-structure](README.md#-project-structure)

**How do I test?**
→ Run `npm test` (all tests) or `npm run test:watch` (watch mode)

**What if something breaks?**
→ Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

**How do I contribute?**
→ Read [CONTRIBUTING.md](CONTRIBUTING.md)

---

## ✅ QUICK CHECKLIST

Before submission, verify:
- [ ] All documentation files exist
- [ ] Tests pass: `npm test`
- [ ] Server starts: `npm run dev`
- [ ] API health: `curl http://localhost:3000/health`
- [ ] Coverage > 60%
- [ ] Code quality acceptable
- [ ] Ready for GitHub push

---

**Last Updated:** April 24, 2024
**Status:** ✅ Complete & Ready for Submission
