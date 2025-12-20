import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Workouts from './pages/Workouts';
import DietPlan from './pages/DietPlan';
import ScanFood from './pages/ScanFood';
import History from './pages/History';
import ProtectedRoute from './components/ProtectedRoute';
import WorkoutProfile from './pages/WorkoutProfile';
import ExerciseLibrary from './pages/ExerciseLibrary';
import WorkoutSession from './pages/WorkoutSession';
import WeeklyPlanner from './pages/WeeklyPlanner';
import ProgressDashboard from './pages/ProgressDashboard';
import NotesReminders from './pages/NotesReminders';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 font-sans">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/diet-plan" element={<DietPlan />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/scan" element={<ScanFood />} />
              <Route path="/scan/history" element={<History />} />

              {/* Workout Module Routes */}
              <Route path="/workouts/profile" element={<WorkoutProfile />} />
              <Route path="/workouts/exercises" element={<ExerciseLibrary />} />
              <Route path="/workouts/session" element={<WorkoutSession />} />
              <Route path="/workouts/planner" element={<WeeklyPlanner />} />
              <Route path="/workouts/dashboard" element={<ProgressDashboard />} />
              <Route path="/workouts/notes" element={<NotesReminders />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
