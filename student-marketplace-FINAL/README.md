# 🎓 SaskPolytech Student Marketplace - COMPLETE PROJECT

**Vue.js 3 + Node.js Full-Stack Application**

**Team:** Darrel Baffour, Divine Nworisa, Harsh Vyas  
**Course:** CWEB 280  
**Instructor:** Alex Wang  
**Due Date:** December 20, 2024

---

## 📁 Project Structure

```
student-marketplace-FINAL/
│
├── frontend/              # Vue.js 3 Frontend
│   ├── src/
│   │   ├── views/        # Pages (Homepage, Login, Register, Browse)
│   │   ├── components/   # Reusable components (Navbar)
│   │   ├── composables/  # Vue composables (useAuth)
│   │   ├── services/     # API services (axios)
│   │   └── router/       # Vue Router config
│   ├── package.json
│   └── vite.config.js
│
├── src/                   # Node.js Backend
│   ├── controllers/      # Business logic
│   ├── entities/         # TypeORM entities
│   ├── routes/           # API routes
│   ├── middleware/       # Auth & upload middleware
│   └── index.js         # Server entry point
│
├── uploads/              # File uploads directory
│   ├── student-ids/
│   ├── listings/
│   └── profiles/
│
└── package.json          # Backend dependencies
```

---

## 🚀 QUICK START (5 Minutes!)

### Step 1: Backend Setup
```bash
# Install backend dependencies
npm install

# Create .env file in ROOT directory
# Add this:
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=student_marketplace
JWT_SECRET=super-secret-jwt-key-change-this

# Start backend
npm start
```

**Expected:** `✅ Database connected! 🚀 Server running on http://localhost:5000`

### Step 2: Database Setup
1. Start XAMPP → Start MySQL
2. Open: http://localhost/phpmyadmin
3. Create database: `student_marketplace`
4. Done! (Tables auto-create)

### Step 3: Frontend Setup
```bash
# Open NEW terminal
cd frontend

# Install Vue dependencies
npm install

# Start frontend
npm run dev
```

**Expected:** `➜ Local: http://localhost:5173/`

### Step 4: Test!
1. Open: http://localhost:5173
2. Click "Register"
3. Upload your SaskPoly student ID
4. Watch the AI OCR magic! 🤖
5. Create account!

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** Vue.js 3 (Composition API)
- **UI Library:** Bootstrap 5 + Bootstrap-Vue-Next
- **Router:** Vue Router 4
- **HTTP Client:** Axios
- **Build Tool:** Vite
- **AI Features:** Tesseract.js (OCR)

### Backend
- **Runtime:** Node.js v24.3.0
- **Framework:** Express.js
- **ORM:** TypeORM (EntitySchema)
- **Database:** MySQL 8.0
- **Auth:** JWT + bcrypt
- **File Upload:** Multer
- **CORS:** Enabled

---

## ✨ Features Implemented

### ✅ Completed Pages
1. **Homepage** - Wireframe design with categories
2. **Login** - JWT authentication
3. **Register** - AI-powered OCR student ID validation
4. **Browse Listings** - Filter by category, condition, price

### 🚧 To Build (6 pages)
1. Listing Detail Page
2. Create Listing Page
3. My Listings Page
4. User Profile Page
5. Messages Page
6. Admin Dashboard

### 🎯 Core Features
- ✅ Student verification (@saskpolytech.ca email)
- ✅ AI-powered OCR for student ID validation
- ✅ Real-time form validation
- ✅ Drag & drop file upload
- ✅ JWT authentication
- ✅ Image upload with Multer
- ✅ Responsive design
- ✅ Sticky footer layout

---

## 🤖 AI Features (OCR Validation)

The registration page uses **Tesseract.js** to validate student IDs:

**What it checks:**
- ✅ Contains "Saskatchewan Polytechnic"
- ✅ Contains "Student" or "ID"
- ✅ Has 7+ digit student number
- ✅ Image quality (brightness, size)

**User sees:**
- Progress bar: "Scanning image with AI OCR... 0% → 100%"
- Success: "✅ Verification complete - Valid SaskPolytech Student ID"
- Fail: Descriptive error message

---

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Listings
- `GET /api/listings` - Get all listings (with filters)
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create listing (auth required)
- `PUT /api/listings/:id` - Update listing (auth required)
- `DELETE /api/listings/:id` - Delete listing (auth required)

### Categories
- `GET /api/categories` - Get all categories

### Admin
- `GET /api/admin/verifications/pending` - Get unverified users
- `POST /api/admin/verifications/:userId/verify` - Approve user
- `POST /api/admin/verifications/:userId/reject` - Reject user
- `GET /api/admin/dashboard/stats` - Get stats

---

## 🧪 Testing

### Create Test Account
1. Register at: http://localhost:5173/register
2. Use email: `test@saskpolytech.ca`
3. Upload student ID image
4. Password: `password123`

### Verify Account
1. Open: http://localhost/phpmyadmin
2. Database: `student_marketplace` → Table: `users`
3. Find your email
4. Change `isVerified` from `0` to `1`
5. Save and login!

---

## 📚 Dependencies

### Backend (`package.json` in root)
```json
{
  "express": "^4.18.2",
  "typeorm": "^0.3.17",
  "mysql2": "^3.6.5",
  "bcrypt": "^5.1.1",
  "jsonwebtoken": "^9.0.2",
  "multer": "^1.4.5-lts.1",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1"
}
```

### Frontend (`frontend/package.json`)
```json
{
  "vue": "^3.3.4",
  "vue-router": "^4.2.5",
  "axios": "^1.6.2",
  "bootstrap": "^5.3.2",
  "bootstrap-vue-next": "^0.14.10",
  "tesseract.js": "^5.0.4"
}
```

---

## 🐛 Troubleshooting

### Backend Issues
```bash
# MySQL not running
# → Start XAMPP MySQL

# Port 5000 in use
# → Change PORT in .env

# Database errors
# → Create database: student_marketplace
# → Check .env credentials
```

### Frontend Issues
```bash
# Dependencies not installed
cd frontend
rm -rf node_modules
npm install

# Port 5173 in use
# → Vite will auto-increment (5174, 5175, etc.)
```

### OCR Issues
```bash
# First upload is slow (downloads language data ~2MB)
# Subsequent uploads are faster

# Image validation fails
# → Ensure image is clear
# → Min 300x300 pixels
# → Check it's a real SaskPoly ID
```

---

## 📅 Development Timeline

### ✅ Week 1 (Nov 26 - Dec 2) - DONE!
- Homepage with wireframe design
- Login page with JWT auth
- Register with AI OCR validation
- Browse listings with filters
- Navbar with auth dropdown
- Sticky footer

### 🚧 Week 2 (Dec 3 - Dec 9) - TO DO
- Listing Detail Page
- Create Listing Page
- My Listings Page

### 🚧 Week 3 (Dec 10 - Dec 16) - TO DO
- User Profile Page
- Messages Page
- Admin Dashboard

### 🎯 Week 4 (Dec 17 - Dec 20) - POLISH
- Testing & bug fixes
- Documentation
- Final submission

---

## 💻 Development Workflow

### Terminal 1: Backend
```bash
npm start
# Runs on: http://localhost:5000
# Auto-restarts on file changes
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
# Runs on: http://localhost:5173
# Hot-reload on file changes
```

### Make Changes
- Edit Vue files in `frontend/src/`
- Browser auto-refreshes
- Backend auto-restarts

---

## 🎨 Vue.js vs React

This project uses **Vue.js 3 Composition API** (as required by proposal).

**Key Differences:**

| React | Vue.js |
|-------|--------|
| `useState()` | `ref()` / `reactive()` |
| `useEffect()` | `watch()` / `onMounted()` |
| `useContext()` | Composables |
| JSX | Template syntax |
| `className` | `class` or `:class` |
| `onClick` | `@click` |

**Example:**

**React:**
```jsx
const [email, setEmail] = useState('');
useEffect(() => {
  console.log('Mounted!');
}, []);
return <div className="container" onClick={handleClick}>
```

**Vue:**
```vue
<template>
  <div class="container" @click="handleClick">
</template>

<script setup>
const email = ref('');
onMounted(() => {
  console.log('Mounted!');
});
</script>
```

---

## 📖 Learning Resources

- **Vue.js Docs:** https://vuejs.org/
- **Composition API:** https://vuejs.org/guide/extras/composition-api-faq.html
- **Vue Router:** https://router.vuejs.org/
- **Bootstrap-Vue-Next:** https://bootstrap-vue-next.github.io/bootstrap-vue-next/
- **Axios:** https://axios-http.com/docs/intro

