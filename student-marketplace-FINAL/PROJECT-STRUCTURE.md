# 📁 PROJECT STRUCTURE GUIDE

## 🎯 One Folder, Everything Organized!

```
student-marketplace-FINAL/
│
├── 📂 frontend/                   ← Vue.js Frontend (Port 5173)
│   ├── 📂 src/
│   │   ├── 📂 views/              ← Your Pages
│   │   │   ├── Homepage.vue       ← ✅ DONE
│   │   │   ├── Login.vue          ← ✅ DONE
│   │   │   ├── Register.vue       ← ✅ DONE (with AI OCR!)
│   │   │   └── BrowseListings.vue ← ✅ DONE
│   │   │
│   │   ├── 📂 components/         ← Reusable Components
│   │   │   └── Navbar.vue         ← ✅ DONE
│   │   │
│   │   ├── 📂 composables/        ← Vue Composables (like React Hooks)
│   │   │   └── useAuth.js         ← Auth state management
│   │   │
│   │   ├── 📂 services/           ← API Calls
│   │   │   └── api.js             ← Axios setup + all API functions
│   │   │
│   │   ├── 📂 router/             ← Vue Router
│   │   │   └── index.js           ← Route definitions
│   │   │
│   │   ├── App.vue                ← Root component
│   │   └── main.js                ← Entry point
│   │
│   ├── index.html                 ← HTML template
│   ├── package.json               ← Frontend dependencies
│   └── vite.config.js             ← Vite config
│
├── 📂 src/                        ← Node.js Backend (Port 5000)
│   ├── 📂 controllers/            ← Business Logic
│   │   ├── authController.js      ← Login, Register, etc.
│   │   ├── listingController.js   ← Listing CRUD
│   │   ├── categoryController.js  ← Categories
│   │   ├── messageController.js   ← Messages
│   │   └── adminController.js     ← Admin functions
│   │
│   ├── 📂 entities/               ← TypeORM Database Models
│   │   ├── User.js                ← User table
│   │   ├── Listing.js             ← Listing table
│   │   ├── Category.js            ← Category table
│   │   ├── Message.js             ← Message table
│   │   └── CampusLocation.js      ← Campus locations
│   │
│   ├── 📂 routes/                 ← API Routes
│   │   ├── authRoutes.js          ← /api/auth/*
│   │   ├── listingRoutes.js       ← /api/listings/*
│   │   ├── categoryRoutes.js      ← /api/categories/*
│   │   ├── messageRoutes.js       ← /api/messages/*
│   │   └── adminRoutes.js         ← /api/admin/*
│   │
│   ├── 📂 middleware/             ← Express Middleware
│   │   ├── authMiddleware.js      ← JWT verification
│   │   └── uploadMiddleware.js    ← File upload (Multer)
│   │
│   └── index.js                   ← Server entry point
│
├── 📂 uploads/                    ← User Uploads
│   ├── 📂 student-ids/            ← Student ID images
│   ├── 📂 listings/               ← Listing images
│   └── 📂 profiles/               ← Profile pictures
│
├── 📄 package.json                ← Backend dependencies
├── 📄 .env.example                ← Environment variables template
├── 📄 .gitignore                  ← Git ignore rules
├── 📄 README.md                   ← Full documentation
├── 📄 QUICKSTART.md               ← 5-minute setup guide
└── 📄 PROJECT-STRUCTURE.md        ← This file!
```

---

## 🎯 How The Two Parts Work Together

```
┌─────────────────────────────────────────────────────────┐
│  Frontend (Vue.js)                                       │
│  http://localhost:5173                                   │
│                                                          │
│  User interacts with:                                    │
│  - Homepage.vue                                          │
│  - Register.vue                                          │
│  - Login.vue                                             │
│  - BrowseListings.vue                                    │
└──────────────┬──────────────────────────────────────────┘
               │
               │ HTTP Requests (Axios)
               │ POST /api/auth/login
               │ GET /api/listings
               ↓
┌─────────────────────────────────────────────────────────┐
│  Backend (Node.js)                                       │
│  http://localhost:5000                                   │
│                                                          │
│  Handles requests:                                       │
│  - Routes → Controllers                                  │
│  - Controllers → Database (TypeORM)                      │
│  - Returns JSON responses                                │
└──────────────┬──────────────────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────────────────┐
│  Database (MySQL)                                        │
│  student_marketplace                                     │
│                                                          │
│  Tables:                                                 │
│  - users                                                 │
│  - listings                                              │
│  - categories                                            │
│  - messages                                              │
│  - campus_locations                                      │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 Key Files To Know

### Backend Entry Point
```
src/index.js
```
- Starts Express server
- Connects to database
- Registers all routes
- **This is where the backend starts!**

### Frontend Entry Point
```
frontend/src/main.js
```
- Creates Vue app
- Registers Vue Router
- Mounts to #app
- **This is where the frontend starts!**

### API Service
```
frontend/src/services/api.js
```
- All API calls to backend
- Axios configuration
- JWT token handling
- **This is how frontend talks to backend!**

### Auth Management
```
frontend/src/composables/useAuth.js
```
- Login/logout functions
- User state management
- Token storage
- **This is your auth system!**

---

## 🚀 How To Add A New Page

### 1. Create Vue Component
```
frontend/src/views/MyNewPage.vue
```

### 2. Add Route
```javascript
// frontend/src/router/index.js
{
  path: '/my-page',
  name: 'MyPage',
  component: MyNewPage
}
```

### 3. Add Navigation
```vue
<!-- frontend/src/components/Navbar.vue -->
<router-link to="/my-page">My Page</router-link>
```

**Done!** Page is now accessible at: http://localhost:5173/my-page

---

## 🔧 How To Add A New API Endpoint

### 1. Add Controller Function
```javascript
// src/controllers/myController.js
export const myFunction = async (req, res) => {
  // Your logic here
};
```

### 2. Add Route
```javascript
// src/routes/myRoutes.js
router.get('/my-endpoint', myFunction);
```

### 3. Register Route
```javascript
// src/index.js
app.use('/api/my', myRoutes);
```

### 4. Call From Frontend
```javascript
// frontend/src/services/api.js
export const myAPI = {
  doSomething: () => api.get('/api/my/my-endpoint')
};
```

**Done!** Endpoint is now at: http://localhost:5000/api/my/my-endpoint

---

## 🎨 Where Everything Lives

| What | Where |
|------|-------|
| **Pages** | `frontend/src/views/` |
| **Components** | `frontend/src/components/` |
| **Routes** | `frontend/src/router/index.js` |
| **API Calls** | `frontend/src/services/api.js` |
| **Auth Logic** | `frontend/src/composables/useAuth.js` |
| **Backend Logic** | `src/controllers/` |
| **Database Models** | `src/entities/` |
| **API Endpoints** | `src/routes/` |
| **Uploads** | `uploads/` |
| **Config** | `.env` (create from `.env.example`) |

---

## 🎯 Quick Reference

### Start Backend
```bash
npm start
# Runs on: http://localhost:5000
```

### Start Frontend
```bash
cd frontend
npm run dev
# Runs on: http://localhost:5173
```

### Install Backend Dependencies
```bash
npm install
```

### Install Frontend Dependencies
```bash
cd frontend
npm install
```

### View Database
```
http://localhost/phpmyadmin
Database: student_marketplace
```

---

## 💡 Pro Tips

1. **Keep two terminals open:**
   - Terminal 1: Backend (`npm start`)
   - Terminal 2: Frontend (`cd frontend && npm run dev`)

2. **Backend changes = auto-restart**
   - Edit `src/controllers/authController.js`
   - Server restarts automatically

3. **Frontend changes = hot-reload**
   - Edit `frontend/src/views/Homepage.vue`
   - Browser updates instantly

4. **API calls in browser console:**
   ```javascript
   // In browser DevTools
   localStorage.getItem('token') // See JWT token
   ```

5. **Database changes:**
   - Tables auto-create from TypeORM entities
   - Edit `src/entities/User.js` to change schema

---

## 🎉 You're All Set!

- ✅ Backend in `src/`
- ✅ Frontend in `frontend/`
- ✅ Everything organized
- ✅ Easy to navigate
- ✅ Ready to build!

**Full setup guide:** `QUICKSTART.md`  
**Full documentation:** `README.md`

**Happy coding! 🚀**
