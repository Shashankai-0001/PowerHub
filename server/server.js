// PowerHub Express Backend Server Entry Point
// Configures Express app, API routes, CORS, and static SPA serving
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "*", // allow frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const scanRoutes = require('./routes/scanRoutes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/scan', scanRoutes);
app.use('/api/v1/workouts', require('./routes/workoutRoutes'));
app.use('/api/v1/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/diet', require('./routes/dietRoutes'));

// Serve static assets from frontend build directory
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Fallback to React index.html for SPA client-side routing
app.use((req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

