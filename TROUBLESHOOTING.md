# TROUBLESHOOTING GUIDE
## Diadoek Restaurant System

Solusi untuk masalah umum yang mungkin terjadi.

---

## Installation Issues

### Error: "npm: command not found"

**Causes:** Node.js atau npm belum terinstall

**Solution:**
1. Download Node.js dari https://nodejs.org
2. Install LTS version (v16 atau lebih tinggi)
3. Verify installation:
```bash
node --version
npm --version
```

---

### Error: "Cannot find module 'express'"

**Causes:** Dependencies belum diinstall

**Solution:**
```bash
npm install
# Atau jika sudah clear cache sebelumnya:
npm cache clean --force
npm install
```

---

### Error: "npm ERR! ERR! Network timeout"

**Causes:** Network connection timeout

**Solution:**
```bash
# Increase npm timeout
npm install --fetch-timeout=120000 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000

# Atau gunakan yarn
npm install -g yarn
yarn install
```

---

## Runtime Issues

### Error: "Port 3000 already in use"

**Causes:** Port 3000 sudah digunakan aplikasi lain

**Solutions:**

**Option 1: Kill existing process**

Windows:
```bash
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

macOS/Linux:
```bash
lsof -i :3000
kill -9 <PID_NUMBER>
```

**Option 2: Use different port**
```bash
PORT=3001 npm run dev
```

---

### Error: "Cannot find database"

**Causes:** Database file belum exist atau corrupt

**Solution:**
```bash
# Delete database
rm db/diadoek.db
rm db/diadoek.db-journal  # jika ada

# Restart aplikasi - database akan auto-create
npm run dev
```

---

### Error: "EACCES: permission denied"

**Causes:** Permission issue pada file/folder

**Solutions:**

Windows: Run command prompt as Administrator

macOS/Linux:
```bash
# Fix permissions
chmod +x node_modules/.bin/*
sudo chown -R $(whoami) db/
```

---

## Database Issues

### Error: "database is locked"

**Causes:** Multiple processes mengakses database bersamaan

**Solution:**
```bash
# 1. Kill all  application instances
# 2. Delete lock files
rm db/diadoek.db-journal

# 3. Restart
npm run dev
```

---

### Error: "SQLITE_CANTOPEN"

**Causes:** Database file tidak bisa dibuka

**Solution:**
```bash
# 1. Check db folder exists
ls db/

# 2. If not, create it
mkdir db

# 3. Delete database dan restart
rm db/diadoek.db
npm run dev
```

---

### Error: "SQLITE_NOTADB"

**Causes:** Database file corrupt

**Solution:**
```bash
# Backup corrupt file
mv db/diadoek.db db/diadoek.db.backup

# Restart - new database akan created
npm run dev
```

---

## Testing Issues

### Error: "Test suites failed to compile"

**Causes:** Syntax error atau missing dependencies

**Solution:**
```bash
# 1. Reinstall dependencies
npm install

# 2. Check syntax
npm test -- --verbose

# 3. Look at specific error message
```

---

### Error: "Jest timeout exceeded"

**Causes:** Test terlalu lama

**Solution:**
```bash
# Increase timeout
npm test -- --testTimeout=30000

# Atau edit jest.config.js:
testTimeout: 30000
```

---

### Error: "Tests pass locally but fail in CI"

**Causes:** Environment differences

**Solutions:**
```bash
# 1. Set environment
NODE_ENV=test npm test

# 2. Clear cache
npm test -- --clearCache

# 3. Use same Node version as CI
nvm install 18.x
nvm use 18.x
npm test
```

---

### Error: "Coverage threshold not met"

**Causes:** Code coverage < 60%

**Solution:**
```bash
# 1. Generate coverage report
npm test -- --coverage

# 2. Open in browser
# Windows: coverage/lcov-report/index.html
# macOS/Linux: open coverage/lcov-report/index.html

# 3. Add more tests untuk uncovered lines

# 4. Re-run tests
npm test
```

---

## API Issues

### Error: "Cannot POST /api/customers"

**Causes:** Route belum terdaftar atau typo URL

**Solution:**
```bash
# 1. Check route ada di routes/*.js
# 2. Check route registered di app.js
# 3. Check URL spelling
# Correct: POST http://localhost:3000/api/customers
```

---

### Error: "400 Bad Request"

**Causes:** Invalid request body atau missing fields

**Solution:**
Check API_DOCUMENTATION.md untuk:
- Valid request format
- Required fields
- Field validation rules

Example:
```bash
# ❌ Wrong - missing required fields
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{}'

# ✅ Correct - all required fields
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe"}'
```

---

### Error: "404 Not Found"

**Causes:** Resource tidak exist di database

**Solution:**
```bash
# 1. Get list semua resources
curl http://localhost:3000/api/customers

# 2. Use ID yang ada
curl http://localhost:3000/api/customers/1

# 3. Jika masih 404, create resource dulu
curl -X POST http://localhost:3000/api/customers \
  -d '{"name":"New Customer"}'
```

---

### Error: "500 Internal Server Error"

**Causes:** Server-side error

**Solution:**
```bash
# 1. Check server logs di terminal
# Look untuk error message

# 2. Enable verbose logging (jika ada)
DEBUG=* npm run dev

# 3. Check database connection
# Make sure db/ folder exists dan writable

# 4. Restart server
# Stop: Ctrl+C
# Start: npm run dev
```

---

## Git Issues

### Error: "Cannot push to GitHub"

**Causes:** Git belum configured atau no permissions

**Solution:**
```bash
# 1. Configure git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 2. Initialize git
git init

# 3. Add all files
git add .

# 4. Commit
git commit -m "Initial commit: Diadoek Restaurant System"

# 5. Add remote
git remote add origin https://github.com/yourusername/repo-name.git

# 6. Push
git push -u origin main
```

---

### Error: "Cannot find .gitignore"

**Solution:**
File `.gitignore` sudah ada di project. Jika hilang, lihat README untuk restore.

---

## Development Tips

### Slow Performance

**Solutions:**
```bash
# 1. Clear node_modules cache
npm cache clean --force

# 2. Reinstall fresh
rm -rf node_modules package-lock.json
npm install

# 3. Disable watch mode jika tidak digunakan
npm start  # production mode

# 4. Check database size
ls -lh db/
```

---

### Want to Reset Everything

```bash
# 1. Stop server (Ctrl+C)

# 2. Delete database
rm db/diadoek.db db/diadoek.db-journal

# 3. Clean install
rm -rf node_modules package-lock.json
npm install

# 4. Start fresh
npm run dev
```

---

### Debug Mode

```bash
# Enable verbose logging
DEBUG=express:* npm run dev

# Or with custom prefix
DEBUG=diadoek:* npm run dev

# Or in tests
npm test -- --verbose
```

---

## Common Validation Errors

### "Invalid email format"

**Valid formats:**
- user@example.com ✅
- john.smith@domain.co.uk ✅
- test+tag@email.com ✅

**Invalid formats:**
- user@.com ❌
- @example.com ❌
- user.example.com ❌

---

### "Invalid phone format"

**Valid formats:**
- 08123456789 ✅
- +62812345789 ✅
- (0812) 345-6789 ✅

**Invalid formats:**
- abc ❌
- 123 ❌
- phone ❌

---

### "Price must be greater than 0"

**Valid:**
- 25000 ✅
- 10500.50 ✅

**Invalid:**
- 0 ❌
- -5000 ❌

---

### "Stock cannot be negative"

**Valid:**
- 10 ✅
- 0 ✅

**Invalid:**
- -5 ❌

---

## Performance Optimization

### Slow API Responses

**Solutions:**
```bash
# 1. Check database size
du -sh db/diadoek.db

# 2. Add indexes (future)
# For now, reset if too large
rm db/diadoek.db

# 3. Check network
curl http://localhost:3000/health
```

---

### High Memory Usage

**Solutions:**
```bash
# 1. Clear cache
npm cache clean --force

# 2. Restart server
# Stop: Ctrl+C
# Start: npm run dev

# 3. Check for memory leaks in tests
npm test -- --memoryLimit=2048
```

---

## Getting Help

### Where to Look

1. **README.md** - General information & usage
2. **SETUP_GUIDE.md** - Detailed setup steps
3. **API_DOCUMENTATION.md** - API reference
4. **Test files** - Usage examples
5. **This file** - Troubleshooting

### Debug Steps

1. Read error message carefully
2. Check relevant documentation
3. Search in test files for similar usage
4. Try minimal reproduce case
5. Check server logs

---

## Still Having Issues?

1. Review all files in docs/
2. Check test files untuk examples
3. Verify installation steps
4. Try reset everything
5. Contact instructor

---

**Last Updated:** April 2024
