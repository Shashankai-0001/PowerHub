# Fitness & Health Web Application

A production-ready microservice-friendly web application focusing on Nutrition Analysis via Barcode Scanning.

## Modules

1.  **Module-1: Workout & Exercise Management** (Placeholder - Integrated via Microservice)
2.  **Module-2: Barcode Scanner & Nutritional Analysis** (Fully Functional)
3.  **Module-3: AI-Based Diet Recommendation System** (Placeholder - Integrated via Microservice)

## Tech Stack

### Frontend
*   Vite + React
*   Tailwind CSS
*   Axios
*   React Router
*   QuaggaJS (Barcode Scanning)

### Backend
*   Node.js + Express
*   MongoDB Atlas
*   Mongoose
*   JWT Authentication

## Prerequisites

*   Node.js installed
*   MongoDB Atlas URI (or local MongoDB)

## Setup & Running

### 1. Clone & Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure Environment Variables

Create `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
FOOD_API_BASE=https://world.openfoodfacts.org
```

Create `client/.env` (optional, redundant with proxy but good practice):
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### 3. Run Application

Start Backend:
```bash
# From server/
npm run dev
```

Start Frontend:
```bash
# From client/
npm run dev
```

Visit `http://localhost:5173`

## Features Implemented

*   **Authentication**: Register/Login with JWT.
*   **Module-2 (Scanner)**:
    *   Scan product barcodes using camera.
    *   Fetch nutrition data from OpenFoodFacts.
    *   Calculate Health Score based on Sugar, Sodium, and Protein.
    *   View Scan History.
*   **Placeholders**: Separate pages for future microservice integrations.

## API Documentation

### Auth
*   `POST /api/v1/auth/register` - Register user
*   `POST /api/v1/auth/login` - Login user

### Scan
*   `POST /api/v1/scan` - Scan barcode (Requires Auth)
    *   Body: `{ "barcode": "123456" }`
*   `GET /api/v1/scan/history` - Get user scan history (Requires Auth)

## Deployment

Designed for easy deployment on Render/Vercel.
- **Backend**: Deploy `server` folder (Build Command: `npm install`, Start Command: `node server.js`).
- **Frontend**: Deploy `client` folder (Build Command: `npm run build`, Output Directory: `dist`).
