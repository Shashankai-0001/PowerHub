# ⚡ PowerHub — Modern Fitness & Health Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-26.5.1-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/License-ISC-blue?style=for-the-badge" alt="License" />
</p>

<p align="center">
  <b>PowerHub</b> is a full-stack, production-ready fitness and health web application featuring an extensive exercise library, interactive workout trackers, real-time barcode nutrition scanner, AI-driven diet recommendations, and custom weekly planning.
</p>

---

## 🌟 Key Features

### 🏋️ 1. Workout & Exercise Management
- **Exercise Library**: Browse a rich catalog of exercises filtered by target muscle groups (*Chest, Back, Arms, Core, Legs, Shoulders*), equipment, and difficulty levels.
- **Custom Routine Generator**: Create personalized routines or auto-generate workouts tailored to your fitness goals.
- **Active Workout Session Tracker**: Track set reps, weights, duration, and estimated calories burned in real time.
- **Progress Dashboards**: Visualize fitness progress and workout frequency using dynamic interactive charts (`Recharts` & `Chart.js`).

### 🥗 2. Barcode Nutrition Scanner & Food Analysis
- **Live Camera Barcode Scanner**: Scan food product barcodes directly via web camera using **QuaggaJS**.
- **Instant Nutritional Analysis**: Fetch real-time food composition data powered by **OpenFoodFacts API**.
- **Automated Health Score**: Calculates an intuitive product health score based on sugar, sodium, protein, and calorie ratios.
- **Scan History**: Keep a history of all previously scanned items for quick macro review.

### 🤖 3. AI-Based Diet Recommendation & Meal Planner
- **Personalized Macro Calculations**: Computes Daily Energy Expenditure (TDEE), target calorie intake, and macronutrient splits (Proteins, Carbs, Fats) derived from user metrics (*weight, height, activity level*).
- **Diet Planner Dashboard**: Visual progress bars for daily caloric goals and macronutrient breakdown.

### 📅 4. Weekly Planner & Tasks
- **Weekly Workout Scheduling**: Map out workouts day-by-day for structured training.
- **Interactive Notes & Reminders**: Dedicated task manager for workout notes, hydration reminders, and supplement checklists.

### 🔐 5. Secure Authentication & User Profiles
- **JWT-Based Authentication**: Secure registration and login with encrypted passwords (`bcryptjs`).
- **User Profile Management**: Customize fitness goals, body metrics, and target preferences.

---

## 🛠️ Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite 7 | High-performance SPA frontend |
| **Styling** | Tailwind CSS v4, Lucide Icons | Modern glassmorphism dark/light design |
| **Charts & Motion** | Recharts, Chart.js, Motion | Dynamic data visualization & smooth UI animations |
| **Scanner** | QuaggaJS | Live camera barcode detection & decoding |
| **Backend** | Node.js, Express.js | RESTful API backend microservice architecture |
| **Database** | MongoDB Atlas, Mongoose | NoSQL Cloud Database with ODM validation |
| **Auth** | JSON Web Tokens (JWT), bcryptjs | Secure stateless authentication |

---

## 📁 Repository Structure

```gss
PowerHub/
├── client/                   # Frontend SPA (Vite + React)
│   ├── public/               # Static public assets
│   ├── src/
│   │   ├── assets/           # Images & vector graphics
│   │   ├── components/       # Reusable UI elements (Navbar, Cards, Modals)
│   │   ├── context/          # React Context (AuthContext)
│   │   ├── pages/            # View pages (ExerciseLibrary, DietDashboard, etc.)
│   │   ├── services/         # API service integration (authService, etc.)
│   │   ├── api.js            # Axios client configuration & interceptors
│   │   ├── App.jsx           # Main App routes
│   │   └── main.jsx          # React entrypoint
│   ├── package.json
│   └── vite.config.js        # Vite dev server & proxy settings
│
└── server/                   # Backend REST API (Node + Express)
    ├── config/               # Database connection setup
    ├── controllers/          # Request handlers & logic
    ├── middleware/           # Auth & validation middleware
    ├── models/               # Mongoose schemas (User, Exercise, Routine, Scan)
    ├── routes/               # API endpoint definitions
    ├── seedWorkouts.js       # Database seeder scripts
    ├── server.js             # Express app entrypoint
    ├── .env                  # Environment config
    └── package.json
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **MongoDB Atlas** database connection string

---

### 1. Clone the Repository
```bash
git clone https://github.com/Shashankai-0001/PowerHub.git
cd PowerHub
```

### 2. Configure Environment Variables

Create `server/.env`:
```env
PORT=5001
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
FOOD_API_BASE=https://world.openfoodfacts.org
```

---

### 3. Install & Start Backend

```bash
cd server
npm install
npm run dev
```
> Backend API will start running at `http://localhost:5001`

---

### 4. Install & Start Frontend

In a new terminal window:
```bash
cd client
npm install
npm run dev
```
> Frontend client will start running at `http://localhost:5173`

---

## 📡 API Reference

### 🔐 Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/v1/auth/register` | Register new user account | ❌ |
| `POST` | `/api/v1/auth/login` | Authenticate user & get JWT token | ❌ |

### 🏋️ Workouts & Exercises (`/api/v1/workouts`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/workouts/exercises` | Fetch all exercises (supports filtering) | ✅ |
| `GET` | `/api/v1/workouts/profile` | Get user fitness profile | ✅ |
| `POST` | `/api/v1/workouts/profile` | Update user body metrics & goals | ✅ |
| `GET` | `/api/v1/workouts/sessions` | Fetch user workout session history | ✅ |
| `POST` | `/api/v1/workouts/sessions` | Log completed workout session | ✅ |
| `GET` | `/api/v1/workouts/weekly-plan` | Get weekly workout schedule | ✅ |
| `POST` | `/api/v1/workouts/weekly-plan` | Update weekly workout schedule | ✅ |

### 🔍 Barcode & Scan (`/api/v1/scan`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/v1/scan` | Analyze barcode product data | ✅ |
| `GET` | `/api/v1/scan/history` | Retrieve user scan history | ✅ |

### 🥗 Diet AI (`/api/diet`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/diet/summary` | Get AI macro & calorie recommendations | ✅ |

---

## ☁️ Deployment

- **Backend (Render / Railway / Heroku)**:
  - Root directory: `server`
  - Build command: `npm install`
  - Start command: `node server.js`

- **Frontend (Vercel / Netlify / Cloudflare Pages)**:
  - Root directory: `client`
  - Build command: `npm run build`
  - Output folder: `dist`

---

<p align="center">
  Made with ❤️ for Fitness Enthusiasts | <b>PowerHub</b>
</p>
