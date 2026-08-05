// Controller for Fetching PowerHub User Dashboard Metrics
// Aggregates workout and diet metrics for user dashboard
const WorkoutSession = require('../models/WorkoutSession');
const FoodScan = require('../models/FoodScan');
const DietLog = require('../models/DietLog');

// @desc    Get dashboard metrics
// @route   GET /api/v1/dashboard
// @access  Private
const getDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // 1. Fetch Workout Sessions (Last 7 days)
        const workouts = await WorkoutSession.find({
            userId,
            date: { $gte: sevenDaysAgo }
        }).sort({ date: 1 });

        // Calculate Stats for Today
        let caloriesBurnedToday = 0;
        let activeTimeToday = 0;
        let workoutsThisWeek = workouts.length;

        workouts.forEach(w => {
            const wDate = new Date(w.date);
            if (wDate >= today) {
                caloriesBurnedToday += Number(w.caloriesBurned) || 0;
                activeTimeToday += Number(w.duration) || 0;
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

        // 3. Activity Chart Data (Last 7 Days - Exact Local Calendar Date Bucket)
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const last7Days = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);

            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const dateNum = String(d.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${dateNum}`;

            last7Days.push({
                dateStr,
                day: daysOfWeek[d.getDay()],
                minutes: 0,
                calories: 0
            });
        }

        workouts.forEach(w => {
            const wDate = new Date(w.date);

            const utcYear = wDate.getUTCFullYear();
            const utcMonth = String(wDate.getUTCMonth() + 1).padStart(2, '0');
            const utcDateNum = String(wDate.getUTCDate()).padStart(2, '0');
            const utcDateStr = `${utcYear}-${utcMonth}-${utcDateNum}`;

            const locYear = wDate.getFullYear();
            const locMonth = String(wDate.getMonth() + 1).padStart(2, '0');
            const locDateNum = String(wDate.getDate()).padStart(2, '0');
            const locDateStr = `${locYear}-${locMonth}-${locDateNum}`;

            let matchedDay = last7Days.find(d => d.dateStr === utcDateStr);
            if (!matchedDay) {
                matchedDay = last7Days.find(d => d.dateStr === locDateStr);
            }

            if (matchedDay) {
                matchedDay.minutes += Number(w.duration) || 0;
                matchedDay.calories += Number(w.caloriesBurned) || 0;
            }
        });

        const activityChartData = last7Days.map(d => ({
            day: d.day,
            minutes: d.minutes,
            calories: d.calories
        }));

        // 4. Macro Chart Data
        const macroChartData = [
            { name: 'Protein', value: Math.round(protein), color: '#CCFF00' },
            { name: 'Carbs', value: Math.round(carbs), color: '#00F0FF' },
            { name: 'Fats', value: Math.round(fats), color: '#7000FF' },
        ];

        // 5. Recent Activity Feed
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

        recentActivities.sort((a, b) => new Date(b.time) - new Date(a.time));

        // 6. Current Streak
        const allWorkouts = await WorkoutSession.find({ userId }).sort({ date: -1 }).select('date');
        let currentStreak = 0;

        if (allWorkouts.length > 0) {
            const uniqueDates = [...new Set(allWorkouts.map(w => {
                const d = new Date(w.date);
                return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
            }))].sort((a, b) => b - a);

            const todayTime = today.getTime();
            const yesterdayTime = yesterday.getTime();

            if (uniqueDates[0] === todayTime || uniqueDates[0] === yesterdayTime) {
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

        // 7. Yesterday's Trends
        const yesterdayWorkouts = await WorkoutSession.find({
            userId,
            date: { $gte: yesterday, $lt: today }
        });

        let caloriesBurnedYesterday = 0;
        let activeTimeYesterday = 0;
        yesterdayWorkouts.forEach(w => {
            caloriesBurnedYesterday += Number(w.caloriesBurned) || 0;
            activeTimeYesterday += Number(w.duration) || 0;
        });

        const yesterdayScans = await FoodScan.find({
            userId,
            createdAt: { $gte: yesterday, $lt: today }
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

        const fourteenDaysAgo = new Date(sevenDaysAgo);
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 7);
        const lastWeekWorkouts = await WorkoutSession.countDocuments({
            userId,
            date: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo }
        });

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
        console.error('Error generating dashboard data:', error);
        res.status(500).json({ message: 'Server error generating dashboard data' });
    }
};

module.exports = { getDashboardData };
