# SETUP GUIDE - Diadoek Restaurant System

Panduan lengkap untuk setup dan menjalankan sistem.

## 📋 Prerequisites

- Node.js v16.x atau lebih tinggi
- npm v7.x atau lebih tinggi  
- Git
- Text editor (VS Code recommended)

Cek versi:
```bash
node --version
npm --version
git --version
```

## 🔧 Step-by-Step Setup

### Step 1: Download/Clone Repository

```bash
# Jika clone dari GitHub
git clone https://github.com/yourusername/diadoek-restaurant-system.git
cd diadoek-restaurant-system

# Atau gunakan folder yang sudah ada
cd "final project matt"
```

### Step 2: Install Dependencies

```bash
npm install
```

Tunggu proses selesai. Ini akan install:
- Express.js (backend framework)
- SQLite3 (database)
- Jest & Supertest (testing framework)
- Nodemon (development auto-reload)
- Dan dependencies lainnya

### Step 3: Setup Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env jika diperlukan
# Default: PORT=3000, NODE_ENV=development
```

### Step 4: Jalankan Aplikasi

#### Mode Development (dengan auto-reload)
```bash
npm run dev
```

Aplikasi akan start di `http://localhost:3000`

#### Mode Production
```bash
npm start
```

### Step 5: Verify Setup

Cek apakah API berjalan:

```bash
# Di terminal baru, jalankan:
curl http://localhost:3000/health
```

Response yang benar:
```json
{
  "success": true,
  "message": "Diadoek Restaurant System API is running",
  "timestamp": "2024-04-24T10:30:00.000Z"
}
```

## 🧪 Running Tests

### Test All
```bash
npm test
```

### Test Unit Only
```bash
npm run test:unit
```

### Test Integration Only  
```bash
npm run test:integration
```

### Test With Watch Mode
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm test -- --coverage
```

Buka: `coverage/lcov-report/index.html` untuk visualisasi

## 📝 Using the API

### Example 1: Create Customer

```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "08123456789",
    "address": "Jl. Sudirman"
  }'
```

### Example 2: Create Menu

```bash
curl -X POST http://localhost:3000/api/menus \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nasi Kuning",
    "description": "Nasi kuning dengan telur",
    "price": 25000,
    "category": "Rice",
    "stock": 10
  }'
```

### Example 3: Create Order

```bash
# Pastikan customer dan menu sudah ada dengan ID tertentu
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "items": [
      {
        "menu_id": 1,
        "quantity": 2,
        "price": 25000
      }
    ],
    "payment_method": "cash"
  }'
```

### Example 4: Create Payment

```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": 1,
    "amount": 50000,
    "payment_method": "cash"
  }'
```

## 🔍 Database Management

### Database Location
```
db/diadoek.db
```

### Reset Database
```bash
# Hapus file database
rm db/diadoek.db

# Restart aplikasi - database akan re-initialize
npm run dev
```

### View Database (dengan SQLite CLI)

```bash
# Install SQLite jika belum ada
# Windows:
choco install sqlite

# macOS:
brew install sqlite3

# Linux:
sudo apt-get install sqlite3

# Buka database
sqlite3 db/diadoek.db

# Di SQLite prompt:
.tables                  # Lihat semua tabel
SELECT * FROM customers; # Lihat data customer
.quit                    # Keluar
```

## 🚨 Troubleshooting

### Error: "Cannot find module 'express'"

**Solution:** Run `npm install`

### Error: "Port 3000 already in use"

**Solution:** 
```bash
# Windows: Find dan kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :3000
kill -9 <PID>

# Atau gunakan port lain:
PORT=3001 npm run dev
```

### Error: "Database is locked"

**Solution:** 
- Close semua instance aplikasi
- Hapus `.db-journal` jika ada
- Restart aplikasi

### Tests Timeout

**Solution:**
```bash
# Increase timeout
npm test -- --testTimeout=30000
```

## 🔗 Important Links

- README: [README.md](./README.md)
- Laporan: [LAPORAN_PROYEK.md](./LAPORAN_PROYEK.md)
- API Docs: Lihat README sections

## 📞 Need Help?

1. Cek error message carefully
2. Review README.md
3. Cek test files untuk usage examples
4. Lihat logs di console

## ✅ Checklist Before Submission

- [ ] npm install completed successfully
- [ ] npm test - all tests passing
- [ ] npm run dev - server starts without errors
- [ ] curl health endpoint - returns 200
- [ ] Coverage report > 60%
- [ ] README.md complete dan readable
- [ ] LAPORAN_PROYEK.md complete
- [ ] .gitignore properly configured
- [ ] .env.example exists
- [ ] package.json scripts correct
- [ ] No hardcoded secrets in code
- [ ] All endpoints documented
- [ ] Ready for GitHub push

---

**Good luck with your project! 🚀**
