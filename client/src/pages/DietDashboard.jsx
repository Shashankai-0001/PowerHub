import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale
} from 'chart.js';
import { Doughnut, Line, Bar, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DietDashboard() {
  const [diet, setDiet] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user ? user.token : null;
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [dietRes, analyticsRes] = await Promise.all([
          axios.get("/api/diet/summary", config),
          axios.get("/api/diet/analytics", config)
        ]);

        setDiet(dietRes.data);
        setAnalytics(analyticsRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load dashboard data.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const saveToHistory = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.post("/api/diet/save", diet, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert("Diet Plan saved to History!");
    } catch (err) {
      console.error(err);
      alert("Failed to save diet plan.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <h3 className="text-xl font-bold text-red-700 mb-2">Oops! Something went wrong</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // --- CHART CONFIGURATIONS ---

  // 1. Calorie Trend (Line Chart)
  const calorieTrendData = {
    labels: analytics.dailyTrend.labels,
    datasets: [
      {
        label: 'Calories Consumed',
        data: analytics.dailyTrend.calorieData,
        borderColor: '#8b5cf6', // Violet
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Daily Goal',
        data: analytics.dailyTrend.labels.map(() => diet.calories),
        borderColor: '#9ca3af', // Gray
        borderDash: [5, 5],
        tension: 0,
        pointRadius: 0
      }
    ]
  };

  // 2. Weekly Macro Stack (Bar Chart)
  const macroStackData = {
    labels: analytics.weeklyMacros.map(m => m.day),
    datasets: [
      {
        label: 'Protein',
        data: analytics.weeklyMacros.map(m => m.protein),
        backgroundColor: '#6366f1',
      },
      {
        label: 'Carbs',
        data: analytics.weeklyMacros.map(m => m.carbs),
        backgroundColor: '#fbbf24',
      },
      {
        label: 'Fats',
        data: analytics.weeklyMacros.map(m => m.fats),
        backgroundColor: '#10b981',
      },
    ]
  };

  // 3. Health Score History (Line Chart)
  const healthTrendData = {
    labels: analytics.dailyTrend.labels,
    datasets: [
      {
        label: 'Health Score',
        data: analytics.dailyTrend.healthScoreData,
        borderColor: '#f59e0b', // Amber
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  // 4. Food Quality (Doughnut)
  const qualityData = {
    labels: ['Healthy', 'Moderate', 'Unhealthy'],
    datasets: [{
      data: [
        analytics.foodQuality.healthy,
        analytics.foodQuality.moderate,
        analytics.foodQuality.unhealthy
      ],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      borderWidth: 0
    }]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">AI & Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">Real-time insights tailored to your metabolism.</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <button
            onClick={saveToHistory}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center gap-2"
          >
            <span>💾</span> Save New Plan
          </button>
        </div>
      </div>

      {/* Insights Panel */}
      {analytics.insights.length > 0 && (
        <div className="grid gap-4 mb-8">
          {analytics.insights.map((insight, idx) => (
            <div key={idx} className={`p-4 rounded-xl border-l-4 flex items-center shadow-sm bg-white ${insight.type === 'success' ? 'border-green-500 text-green-700' : 'border-amber-500 text-amber-700'}`}>
              <span className="text-2xl mr-3">{insight.type === 'success' ? '🚀' : '💡'}</span>
              <p className="font-medium">{insight.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ROW 1: Trend & Macros */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-violet-100 text-violet-600 p-2 rounded-lg">🔥</span> Calorie Trend (Last 7 Days)
          </h3>
          <div className="h-64">
            <Line data={calorieTrendData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">🥗</span> Food Quality
          </h3>
          <div className="h-64 flex justify-center">
            <Doughnut data={qualityData} options={{ maintainAspectRatio: false, cutout: '70%' }} />
          </div>
          <div className="text-center mt-4">
            <p className="text-gray-500 text-sm">Based on your recent scans</p>
          </div>
        </div>

        {/* ROW 2: Macro Stack & Health Score */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">📊</span> Weekly Macros
          </h3>
          <div className="h-64">
            <Bar data={macroStackData} options={{ maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }} />
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-amber-100 text-amber-600 p-2 rounded-lg">❤️</span> Health Score History
          </h3>
          <div className="h-64">
            <Line data={healthTrendData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* ROW 3: Consistency & Targets */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Consistency Score</h3>
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
              <circle cx="64" cy="64" r="56" stroke="#4f46e5" strokeWidth="12" fill="none" strokeDasharray={`${(analytics.consistencyScore / 100) * 351} 351`} />
            </svg>
            <span className="absolute text-2xl font-bold text-indigo-600">{analytics.consistencyScore}%</span>
          </div>
          <p className="text-gray-500 text-sm mt-4">Keep logging to improve!</p>
        </div>

        <div className="lg:col-span-2 bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-3xl shadow-lg text-white">
          <h3 className="text-xl font-bold mb-4">Today's Target Overview</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/20 p-4 rounded-xl">
              <p className="text-indigo-100 text-sm">Protein</p>
              <p className="text-2xl font-bold">{diet.macros.protein.grams}g</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <p className="text-indigo-100 text-sm">Carbs</p>
              <p className="text-2xl font-bold">{diet.macros.carbs.grams}g</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <p className="text-indigo-100 text-sm">Fats</p>
              <p className="text-2xl font-bold">{diet.macros.fats.grams}g</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
} 
