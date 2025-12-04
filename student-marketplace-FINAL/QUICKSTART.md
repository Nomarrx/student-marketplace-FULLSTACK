# ⚡ QUICK START - Get Running in 5 Minutes!

## 📦 What You Have

```
student-marketplace-FINAL/
├── frontend/        ← Vue.js 3 frontend
├── src/             ← Node.js backend
├── uploads/         ← File uploads
├── package.json     ← Backend dependencies
└── README.md        ← Full documentation
```

---

## 🚀 Setup Steps

### 1️⃣ Backend (2 minutes)

```bash
# Install dependencies
npm install

# Create .env file
# Copy .env.example and add your values:
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=student_marketplace
JWT_SECRET=super-secret-key

# Start backend
npm start
```

**Expected Output:**
```
✅ Database connected successfully!
🚀 Server running on http://localhost:5000
```

---

### 2️⃣ Database (1 minute)

1. Start XAMPP
2. Start MySQL
3. Open: http://localhost/phpmyadmin
4. Create database: `student_marketplace`
5. Done! (Tables auto-create)

---

### 3️⃣ Frontend (2 minutes)

```bash
# Open NEW terminal
cd frontend

# Install Vue dependencies
npm install

# Start frontend
npm run dev
```

**Expected Output:**
```
VITE ready in 300 ms
➜  Local:   http://localhost:5173/
```

---

## ✅ Test It!

1. Open: http://localhost:5173
2. Click "Register"
3. Fill form:
   - Name: Darrel Baffour
   - Email: test@saskpolytech.ca
   - Upload SaskPoly student ID
   - Password: password123
4. Watch AI OCR scan! 🤖
5. Submit!

---

## 🔐 Verify Account

After registration:
1. Go to: http://localhost/phpmyadmin
2. Database: `student_marketplace`
3. Table: `users`
4. Find your email
5. Change `isVerified` from `0` to `1`
6. Login!

---

## 📂 Project Structure

```
ROOT/
├── frontend/          # Vue.js (Port 5173)
│   ├── src/
│   │   ├── views/    # Pages
│   │   ├── components/
│   │   └── router/
│   └── package.json
│
├── src/              # Backend (Port 5000)
│   ├── controllers/
│   ├── routes/
│   └── index.js
│
└── package.json      # Backend deps
```

---

## 🎯 What's Done

✅ Homepage  
✅ Login  
✅ Register (with AI OCR!)  
✅ Browse Listings  
✅ Backend (100%)  

---

## 🚧 What's Left (6 pages)

1. Listing Detail
2. Create Listing
3. My Listings
4. User Profile
5. Messages
6. Admin Dashboard

**Timeline:** 3.5 weeks = PLENTY OF TIME! 💪

---

## 💻 Development

**Terminal 1 (Backend):**
```bash
npm start
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Edit files → Auto-reload! 🔥

---

## 🐛 Problems?

**Backend won't start:**
- Check MySQL running
- Check .env file exists
- Run: `npm install`

**Frontend won't start:**
- Check you're in `/frontend`
- Run: `npm install`

**OCR slow:**
- First time downloads 2MB
- Subsequent faster

---

## 📅 Timeline

**Week 1 (Now - Dec 2):** ✅ DONE!  
**Week 2 (Dec 3-9):** Build 3 pages  
**Week 3 (Dec 10-16):** Build 3 pages  
**Week 4 (Dec 17-20):** Polish & submit  

---

## 🎉 YOU GOT THIS!

Full docs in: `README.md`

**Need help? Just ask!** 🚀
