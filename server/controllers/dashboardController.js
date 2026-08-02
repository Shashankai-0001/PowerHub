const WorkoutSession = require('../models/WorkoutSession');
const FoodScan = require('../models/FoodScan');
const DietLog = require('../models/DietLog');

// @desc    Get dashboard metrics
// @route   GET /api/v1/dashboard
// @access  Private
const getDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        // 1. Fetch Workout Sessions (Last 7 days)
        const workouts = await WorkoutSession.find({
            userId,
            date: { $gte: sevenDaysAgo }
        }).sort({ date: 1 });

        // Calculate Stats
        let caloriesBurnedToday = 0;
        let activeTimeToday = 0;
        let workoutsThisWeek = workouts.length;

        workouts.forEach(w => {
            if (new Date(w.date) >= today) {
                caloriesBurnedToday += w.caloriesBurned || 0;
                activeTimeToday += w.duration || 0;
            }
        });

        // 2. Fetch Food Scans (Today) for Diet Score and Macros
        const foodScansToday = await FoodScan.find({
            userId,
            createdAt: { $gte: today }
        });

        let totalHealthScore = 0;
        let validScores = 0;
        let protein = 0;
        let carbs = 0;
        let fats = 0;

        foodScansToday.forEach(scan => {
            if (scan.healthScore !== null && scan.healthScore !== undefined) {
                totalHealthScore += scan.healthScore;
                validScores++;
            }
            protein += scan.protein || 0;
            carbs += scan.carbs || 0;
            fats += scan.fat || 0;
        });

        const dietScore = validScores > 0 ? Math.round(totalHealthScore / validScores) : 0;

        // 3. Activity Chart Data (Last 7 Days)
        const activityChartMap = {};
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        // Initialize last 7 days with 0
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            activityChartMap[daysOfWeek[d.getDay()]] = { day: daysOfWeek[d.getDay()], minutes: 0, calories: 0 };
        }

        workouts.forEach(w => {
            const dayName = daysOfWeek[new Date(w.date).getDay()];
            if (activityChartMap[dayName]) {
                activityChartMap[dayName].minutes += w.duration || 0;
                activityChartMap[dayName].calories += w.caloriesBurned || 0;
            }
        });
        const activityChartData = Object.values(activityChartMap);

        // 4. Macro Chart Data
        const macroChartData = [
            { name: 'Protein', value: Math.round(protein), color: '#CCFF00' },
            { name: 'Carbs', value: Math.round(carbs), color: '#00F0FF' },
            { name: 'Fats', value: Math.round(fats), color: '#7000FF' },
        ];

        // 5. Recent Activity Feed (Mix of workouts and scans)
        const recentWorkouts = await WorkoutSession.find({ userId })
            .sort({ date: -1 })
            .limit(3);
            
        const recentScans = await FoodScan.find({ userId })
            .sort({ createdAt: -1 })
            .limit(3);

        let recentActivities = [];

        recentWorkouts.forEach(w => {
            recentActivities.push({
                id: `w-${w._id}`,
                type: 'workout',
                title: 'Completed Workout',
                time: w.date,
                value: `${w.duration} mins`,
                icon: 'Dumbbell', 
                color: 'text-primary', 
                bg: 'bg-primary/20'
            });
        });

        recentScans.forEach(s => {
            recentActivities.push({
                id: `s-${s._id}`,
                type: 'diet',
                title: `Scanned ${s.productName}`,
                time: s.createdAt,
                value: `${s.calories || 0} kcal`,
                icon: 'UtensilsCrossed', 
                color: 'text-orange-500', 
                bg: 'bg-orange-500/20'
            });
        });

        // Sort combined activities by time descending
        recentActivities.sort((a, b) => new Date(b.time) - new Date(a.time));
        // Calculate Current Streak
        const allWorkouts = await WorkoutSession.find({ userId }).sort({ date: -1 }).select('date');
        let currentStreak = 0;
        
        const todayZero = new Date();
        todayZero.setHours(0,0,0,0);
        const yesterdayZero = new Date(todayZero);
        yesterdayZero.setDate(yesterdayZero.getDate() - 1);

        if (allWorkouts.length > 0) {
            const uniqueDates = [...new Set(allWorkouts.map(w => {
                const d = new Date(w.date);
                d.setHours(0,0,0,0);
                return d.getTime();
            }))].sort((a,b) => b - a);

            if (uniqueDates[0] === todayZero.getTime() || uniqueDates[0] === yesterdayZero.getTime()) {
                currentStreak = 1;
                let lastDate = uniqueDates[0];
                
                for (let i = 1; i < uniqueDates.length; i++) {
                    const expectedDate = new Date(lastDate);
                    expectedDate.setDate(expectedDate.getDate() - 1);
                    
                    if (uniqueDates[i] === expectedDate.getTime()) {
                        currentStreak++;
                        lastDate = uniqueDates[i];
                    } else {
                        break;
                    }
                }
            }
        }
        
        // Fetch Yesterday's data for trends
        const yesterdayWorkouts = await WorkoutSession.find({
            userId,
            date: { $gte: yesterdayZero, $lt: todayZero }
        });

        let caloriesBurnedYesterday = 0;
        let activeTimeYesterday = 0;
        yesterdayWorkouts.forEach(w => {
            caloriesBurnedYesterday += w.caloriesBurned || 0;
            activeTimeYesterday += w.duration || 0;
        });

        const yesterdayScans = await FoodScan.find({
            userId,
            createdAt: { $gte: yesterdayZero, $lt: todayZero }
        });

        let yesterdayHealthScoreTotal = 0;
        let yesterdayValidScores = 0;
        yesterdayScans.forEach(scan => {
            if (scan.healthScore !== null && scan.healthScore !== undefined) {
                yesterdayHealthScoreTotal += scan.healthScore;
                yesterdayValidScores++;
            }
        });
        const dietScoreYesterday = yesterdayValidScores > 0 ? Math.round(yesterdayHealthScoreTotal / yesterdayValidScores) : 0;

        // Fetch last week's workouts for trend
        const fourteenDaysAgo = new Date(sevenDaysAgo);
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 7);
        const lastWeekWorkouts = await WorkoutSession.countDocuments({
            userId,
            date: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo }
        });

        // Trend Helper
        const calculateTrend = (current, previous) => {
            if (previous === 0 && current > 0) return '+100%';
            if (previous === 0 && current === 0) return '0%';
            const percentChange = Math.round(((current - previous) / previous) * 100);
            return percentChange > 0 ? `+${percentChange}%` : `${percentChange}%`;
        };
        
        res.status(200).json({
            stats: {
                caloriesBurned: caloriesBurnedToday,
                activeTime: activeTimeToday,
                workoutsThisWeek,
                dietScore,
                currentStreak,
                trends: {
                    calories: calculateTrend(caloriesBurnedToday, caloriesBurnedYesterday),
                    activeTime: calculateTrend(activeTimeToday, activeTimeYesterday),
                    dietScore: calculateTrend(dietScore, dietScoreYesterday),
                    workouts: calculateTrend(workoutsThisWeek, lastWeekWorkouts)
                }
            },
            activityChartData,
            macroChartData,
            recentActivities
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error generating dashboard data' });
    }
};

module.exports = { getDashboardData };
