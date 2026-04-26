# 🚀 PANDUAN INSTALL NODE.JS & JALANKAN APLIKASI

**Problem:** localhost tidak bisa diakses karena Node.js belum terinstall

## ✅ SOLUSI - Install Node.js

### Step 1: Download Node.js

1. Buka website: **https://nodejs.org**
2. Download **LTS version** (Long Term Support)
   - Recommended: v20.x LTS atau v18.x LTS
3. Download file `.msi` untuk Windows

### Step 2: Install Node.js

1. Jalankan file **node-vXX.x.x-x64.msi** yang sudah di-download
2. Klik **Next** sampai selesai
3. Pastikan checklist:
   - ✅ Node.js runtime
   - ✅ npm package manager

### Step 3: Verifikasi Instalasi

Buka **Command Prompt** (CMD) atau **PowerShell** dan jalankan:

```bash
node --version
npm --version
```

Jika keluar versi, berarti sukses! Contoh:
```
v20.11.0
10.2.4
```

---

## 🎯 JALANKAN APLIKASI SETELAH NODE.JS INSTALLED

Setelah Node.js terinstall, buka **Command Prompt** atau **PowerShell** dan jalankan:

### 1. Buka Folder Project

```bash
cd "C:\Users\JOHAN\Downloads\KICAU\final project matt"
```

### 2. Install Dependencies

```bash
npm install
```

Tunggu sampai selesai (kurang lebih 2-5 menit)

### 3. Jalankan Aplikasi

```bash
npm run dev
```

Akan keluar output seperti ini:
```
Database initialized successfully
Diadoek Restaurant System API running on http://localhost:3000
```

### 4. Buka di Browser

Buka browser dan akses:
```
http://localhost:3000/health
```

Seharusnya terlihat:
```json
{
  "success": true,
  "message": "Diadoek Restaurant System API is running",
  "timestamp": "2024-04-24T10:30:00.000Z"
}
```

---

## 🔧 JIKA MASIH ADA MASALAH

### Error: "Port 3000 already in use"

Gunakan port lain:
```bash
PORT=3001 npm run dev
```

Lalu buka: `http://localhost:3001/health`

### Error: Masih tidak terkoneksi

1. Pastikan aplikasi sudah start (lihat output di CMD/PowerShell)
2. Cek internet connection - tidak perlu internet sebenarnya (localhost)
3. Coba restart CMD/PowerShell
4. Coba restart computer

### Download Node.js tidak berfungsi?

Kunjungi: **https://nodejs.org/en/download/**

Atau download dari mirror:
- https://npm.taobao.org/mirrors/node/
- https://nodejs.org/dist/

---

## ✨ COMMANDS PENTING

```bash
# Buka folder project
cd "C:\Users\JOHAN\Downloads\KICAU\final project matt"

# Install dependencies (jalankan 1x)
npm install

# Jalankan aplikasi dengan auto-reload
npm run dev

# Jalankan aplikasi mode production
npm start

# Jalankan test
npm test

# Jalankan test + lihat coverage
npm test -- --coverage
```

---

## 📝 TROUBLESHOOTING CHECKLIST

- [ ] Node.js di-download & di-install
- [ ] `node --version` keluar versi
- [ ] `npm --version` keluar versi
- [ ] Buka Command Prompt/PowerShell
- [ ] Navigate ke folder project
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Buka `http://localhost:3000/health` di browser
- [ ] Lihat response JSON

---

**Jika sudah selesai semua step di atas, localhost akan berjalan! 🚀**

Hubungi saya jika masih ada masalah!
