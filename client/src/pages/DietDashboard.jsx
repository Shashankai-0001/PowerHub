// Diet Dashboard Page Component
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
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { Activity, Utensils, Zap, Flame, Droplet, RefreshCw } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' or 'planner'
  
  const [diet, setDiet] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem('user'));
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

  const generateMealPlan = async () => {
    setGenerating(true);
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      const token = user ? user.token : null;
      const res = await axios.get("/api/diet/plan/generate", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMealPlan(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to generate meal plan.");
    } finally {
      setGenerating(false);
    }
  };

  const saveToHistory = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      await axios.post("/api/diet/save", diet, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert("Diet Log saved to History!");
    } catch (err) {
      console.error(err);
      alert("Failed to save diet plan.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary shadow-[0_0_20px_rgba(0,163,255,0.5)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-red-500/10 border border-red-500/50 rounded-3xl text-center">
        <h3 className="text-2xl font-black text-red-500 mb-2">Oops! Something went wrong</h3>
        <p className="text-red-400 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // --- CHART CONFIGURATIONS ---

  // --- CHART CONFIGURATIONS ---

  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#e5e7eb', font: { weight: 'bold' } } },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
      }
    },
    scales: {
      x: { ticks: { color: '#94a3b8', font: { weight: '600' } }, grid: { display: false } },
      y: { ticks: { color: '#94a3b8', font: { weight: '600' } }, grid: { color: 'rgba(255,255,255,0.06)' } }
    }
  };

  const calorieChartOptions = {
    ...commonChartOptions,
    plugins: {
      ...commonChartOptions.plugins,
      tooltip: {
        ...commonChartOptions.plugins.tooltip,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw.toLocaleString()} kcal`
        }
      }
    }
  };

  const macroChartOptions = {
    ...commonChartOptions,
    plugins: {
      ...commonChartOptions.plugins,
      tooltip: {
        ...commonChartOptions.plugins.tooltip,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}g`
        }
      }
    },
    scales: {
      x: { stacked: true, ticks: { color: '#94a3b8' }, grid: { display: false } },
      y: { stacked: true, ticks: { color: '#94a3b8', callback: (v) => `${v}g` }, grid: { color: 'rgba(255,255,255,0.06)' } }
    }
  };

  const healthChartOptions = {
    ...commonChartOptions,
    plugins: {
      ...commonChartOptions.plugins,
      tooltip: {
        ...commonChartOptions.plugins.tooltip,
        callbacks: {
          label: (context) => `Health Score: ${context.raw} / 100`
        }
      }
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
      y: { min: 0, max: 100, ticks: { color: '#94a3b8', callback: (v) => `${v}/100` }, grid: { color: 'rgba(255,255,255,0.06)' } }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: { labels: { color: '#e5e7eb', font: { weight: 'bold' } } },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.label}: ${context.raw} logged items`
        }
      }
    }
  };

  // 1. Calorie Trend (Line Chart)
  const calorieTrendData = {
    labels: analytics.dailyTrend.labels,
    datasets: [
      {
        label: 'Calories Consumed',
        data: analytics.dailyTrend.calorieData,
        borderColor: '#00A3FF',
        pointBackgroundColor: '#00A3FF',
        pointBorderColor: '#ffffff',
        pointHoverRadius: 7,
        pointRadius: 4,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(0, 163, 255, 0.4)');
          gradient.addColorStop(1, 'rgba(0, 163, 255, 0.0)');
          return gradient;
        },
        tension: 0.4,
        fill: true
      },
      {
        label: 'Daily Target Goal',
        data: analytics.dailyTrend.labels.map(() => diet.calories),
        borderColor: '#10B981',
        borderDash: [6, 6],
        borderWidth: 2,
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
        backgroundColor: '#10B981',
        borderRadius: 4,
      },
      {
        label: 'Carbs',
        data: analytics.weeklyMacros.map(m => m.carbs),
        backgroundColor: '#00A3FF',
        borderRadius: 4,
      },
      {
        label: 'Fats',
        data: analytics.weeklyMacros.map(m => m.fats),
        backgroundColor: '#8B5CF6',
        borderRadius: 4,
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
        borderColor: '#10B981',
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#ffffff',
        pointHoverRadius: 7,
        pointRadius: 4,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
          return gradient;
        },
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
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
      borderWidth: 0
    }]
  };

  return (
    <div className="max-w-[1800px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen pb-24">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sm:mb-10 bg-card/60 backdrop-blur-2xl border border-border p-6 rounded-3xl sm:rounded-[2.5rem] shadow-2xl relative overflow-hidden gap-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight mb-2 flex items-center gap-3">
            <Utensils className="w-7 h-7 sm:w-8 sm:h-8 text-primary" /> Nutrition Center
          </h1>
          <p className="text-xs sm:text-base text-muted-foreground font-medium">Your personalized hub for diet analytics and meal planning.</p>
        </div>
        
        <div className="w-full md:w-auto flex p-1 bg-background/50 backdrop-blur-xl border border-border rounded-full shadow-inner">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 md:flex-none px-4 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-base transition-all duration-300 ${activeTab === 'analytics' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('planner')}
            className={`flex-1 md:flex-none px-4 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-base transition-all duration-300 ${activeTab === 'planner' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Meal Planner
          </button>
        </div>
      </div>

      {/* --- ANALYTICS TAB --- */}
      {activeTab === 'analytics' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Insights Panel */}
          {analytics.insights.length > 0 && (
            <div className="grid gap-4 mb-8">
              {analytics.insights.map((insight, idx) => (
                <div key={idx} className={`p-5 rounded-2xl border-l-4 flex items-center shadow-xl bg-card/50 border border-white/5 backdrop-blur-xl ${insight.type === 'success' ? 'border-l-primary text-foreground' : 'border-l-amber-500 text-foreground'}`}>
                  <p className="font-bold text-lg">{insight.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* ROW 1: Trend & Macros */}
            <div className="lg:col-span-2 min-w-0 bg-card/50 backdrop-blur-2xl p-5 sm:p-8 rounded-3xl sm:rounded-[2rem] shadow-2xl border border-border">
              <h3 className="text-base sm:text-xl font-black text-foreground mb-6 flex items-center gap-3 uppercase tracking-widest">
                <Flame className="w-5 h-5 text-orange-500" /> Calorie Trend
              </h3>
              <div className="h-64 sm:h-72">
                <Line data={calorieTrendData} options={calorieChartOptions} />
              </div>
            </div>

            <div className="min-w-0 bg-card/50 backdrop-blur-2xl p-5 sm:p-8 rounded-3xl sm:rounded-[2rem] shadow-2xl border border-border">
              <h3 className="text-base sm:text-xl font-black text-foreground mb-6 flex items-center gap-3 uppercase tracking-widest">
                <Activity className="w-5 h-5 text-primary" /> Food Quality
              </h3>
              <div className="h-56 sm:h-64 flex justify-center relative">
                <Doughnut data={qualityData} options={doughnutOptions} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col mt-4">
                  <span className="text-2xl sm:text-3xl font-black text-foreground">{analytics.foodQuality.healthy}</span>
                  <span className="text-xs font-bold text-muted-foreground uppercase">Healthy</span>
                </div>
              </div>
            </div>

            {/* ROW 2: Macro Stack & Health Score */}
            <div className="min-w-0 bg-card/50 backdrop-blur-2xl p-5 sm:p-8 rounded-3xl sm:rounded-[2rem] shadow-2xl border border-border">
              <h3 className="text-base sm:text-xl font-black text-foreground mb-6 flex items-center gap-3 uppercase tracking-widest">
                <Zap className="w-5 h-5 text-secondary" /> Weekly Macros
              </h3>
              <div className="h-64 sm:h-72">
                <Bar data={macroStackData} options={macroChartOptions} />
              </div>
            </div>

            <div className="lg:col-span-2 min-w-0 bg-card/50 backdrop-blur-2xl p-5 sm:p-8 rounded-3xl sm:rounded-[2rem] shadow-2xl border border-border">
              <h3 className="text-base sm:text-xl font-black text-foreground mb-6 flex items-center gap-3 uppercase tracking-widest">
                <Activity className="w-5 h-5 text-cyan-400" /> Health Score History
              </h3>
              <div className="h-64 sm:h-72">
                <Line data={healthTrendData} options={healthChartOptions} />
              </div>
            </div>

            {/* ROW 3: Target Overview */}
            <div className="lg:col-span-3 min-w-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-border p-6 sm:p-10 rounded-3xl sm:rounded-[3rem] shadow-2xl backdrop-blur-2xl relative overflow-hidden">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 sm:mb-10 relative z-10">
                <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Today's Target Overview</h3>
                <button
                  onClick={saveToHistory}
                  className="self-start sm:self-auto bg-card text-foreground border border-border px-6 py-3 rounded-full font-bold hover:bg-muted transition-colors shadow-lg flex items-center gap-2 text-sm sm:text-base"
                >
                  Save Log
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative z-10">
                <div className="min-w-0 bg-card/80 backdrop-blur-md border border-border p-6 sm:p-8 rounded-3xl hover:bg-card transition-colors shadow-xl">
                  <p className="text-primary font-black mb-3 uppercase tracking-widest text-xs sm:text-sm flex items-center gap-2">Protein</p>
                  <p className="text-4xl sm:text-6xl font-black text-foreground tracking-tighter">{diet.macros.protein.grams}<span className="text-xl sm:text-2xl text-muted-foreground ml-1">g</span></p>
                </div>
                <div className="min-w-0 bg-card/80 backdrop-blur-md border border-border p-6 sm:p-8 rounded-3xl hover:bg-card transition-colors shadow-xl">
                  <p className="text-foreground font-black mb-3 uppercase tracking-widest text-xs sm:text-sm flex items-center gap-2">Carbs</p>
                  <p className="text-4xl sm:text-6xl font-black text-foreground tracking-tighter">{diet.macros.carbs.grams}<span className="text-xl sm:text-2xl text-muted-foreground ml-1">g</span></p>
                </div>
                <div className="min-w-0 bg-card/80 backdrop-blur-md border border-border p-6 sm:p-8 rounded-3xl hover:bg-card transition-colors shadow-xl">
                  <p className="text-secondary font-black mb-3 uppercase tracking-widest text-xs sm:text-sm flex items-center gap-2"><Droplet className="w-4 h-4"/> Fats</p>
                  <p className="text-4xl sm:text-6xl font-black text-foreground tracking-tighter">{diet.macros.fats.grams}<span className="text-xl sm:text-2xl text-muted-foreground ml-1">g</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PLANNER TAB --- */}
      {activeTab === 'planner' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {!mealPlan ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] bg-card/30 backdrop-blur-xl border border-border rounded-[3rem] p-12 text-center">
              <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20" />
                <Utensils className="w-16 h-16 text-primary" />
              </div>
              <h2 className="text-4xl font-black text-foreground mb-4 tracking-tight">Generate Your Meal Plan</h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-lg mx-auto">We'll create a full day of eating perfectly tailored to hit your {diet.calories} kcal target.</p>
              
              <button
                onClick={generateMealPlan}
                disabled={generating}
                className="bg-primary text-primary-foreground px-10 py-5 rounded-full font-black text-xl hover:bg-primary/90 transition-all shadow-[0_0_40px_rgba(0,163,255,0.4)] hover:scale-105 flex items-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
              >
                {generating ? (
                  <><RefreshCw className="w-6 h-6 animate-spin" /> Calculating Macros...</>
                ) : (
                  <>Generate Plan <Zap className="w-6 h-6" /></>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Plan Overview */}
              <div className="bg-gradient-to-r from-card/80 to-card/40 backdrop-blur-2xl border border-border p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 relative z-10">
                  <div>
                    <h2 className="text-3xl font-black text-foreground tracking-tight mb-2">Today's Protocol</h2>
                    <p className="text-muted-foreground font-medium text-lg">Hitting exactly {mealPlan.actual.calories} / {mealPlan.target.calories} kcal</p>
                  </div>
                  <button
                    onClick={generateMealPlan}
                    className="mt-6 md:mt-0 bg-muted text-foreground px-6 py-3 rounded-full font-bold hover:bg-muted/80 transition flex items-center gap-2 border border-border"
                  >
                    <RefreshCw className="w-4 h-4" /> Regenerate
                  </button>
                </div>

                {/* Macro Progress Bars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                  {/* Protein */}
                  <div>
                    <div className="flex justify-between items-end mb-3">
                      <span className="font-black uppercase tracking-widest text-primary text-sm">Protein</span>
                      <span className="font-bold text-foreground text-lg">{mealPlan.actual.protein}g <span className="text-muted-foreground text-sm font-medium">/ {mealPlan.target.protein}g</span></span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden border border-border/50">
                      <div className="h-full bg-primary transition-all duration-1000 shadow-[0_0_10px_var(--primary)]" style={{ width: `${Math.min(100, (mealPlan.actual.protein / mealPlan.target.protein) * 100)}%` }} />
                    </div>
                  </div>

                  {/* Carbs */}
                  <div>
                    <div className="flex justify-between items-end mb-3">
                      <span className="font-black uppercase tracking-widest text-foreground text-sm">Carbs</span>
                      <span className="font-bold text-foreground text-lg">{mealPlan.actual.carbs}g <span className="text-muted-foreground text-sm font-medium">/ {mealPlan.target.carbs}g</span></span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden border border-border/50">
                      <div className="h-full bg-white transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: `${Math.min(100, (mealPlan.actual.carbs / mealPlan.target.carbs) * 100)}%` }} />
                    </div>
                  </div>

                  {/* Fats */}
                  <div>
                    <div className="flex justify-between items-end mb-3">
                      <span className="font-black uppercase tracking-widest text-secondary text-sm">Fats</span>
                      <span className="font-bold text-foreground text-lg">{mealPlan.actual.fats}g <span className="text-muted-foreground text-sm font-medium">/ {mealPlan.target.fats}g</span></span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden border border-border/50">
                      <div className="h-full bg-secondary transition-all duration-1000 shadow-[0_0_10px_var(--secondary)]" style={{ width: `${Math.min(100, (mealPlan.actual.fats / mealPlan.target.fats) * 100)}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Meals List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mealPlan.meals.map((meal, idx) => (
                  <div key={idx} className="bg-card/60 backdrop-blur-xl border border-border p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] group-hover:bg-primary/10 transition-colors" />
                    
                    <div className="flex items-start justify-between mb-6 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-border">
                          {meal.image}
                        </div>
                        <div>
                          <span className="text-xs font-black uppercase tracking-widest text-primary mb-1 block">{meal.type}</span>
                          <h3 className="text-xl font-bold text-foreground leading-tight">{meal.name}</h3>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-foreground">{meal.calories}</span>
                        <span className="text-xs font-bold text-muted-foreground block uppercase">kcal</span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-8 relative z-10 leading-relaxed font-medium">{meal.description}</p>
                    
                    <div className="flex gap-4 relative z-10">
                      <div className="flex-1 bg-primary/10 border border-primary/20 rounded-2xl p-4 text-center">
                        <span className="block text-xl font-black text-primary">{meal.protein}g</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Protein</span>
                      </div>
                      <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                        <span className="block text-xl font-black text-foreground">{meal.carbs}g</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Carbs</span>
                      </div>
                      <div className="flex-1 bg-secondary/10 border border-secondary/20 rounded-2xl p-4 text-center">
                        <span className="block text-xl font-black text-secondary">{meal.fats}g</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-secondary/70">Fats</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
