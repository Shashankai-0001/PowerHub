const UserWorkoutProfile = require("../models/UserWorkoutProfile");
const ProgressLog = require("../models/ProgressLog");
const { calculateBMR, calculateTDEE, calculateMacros } = require("../services/dietEngine");

exports.getDietSummary = async (req, res) => {
  try {
    const profile = await UserWorkoutProfile.findOne({ userId: req.user.id });

    // if (!profile) {
    //   return res.status(404).json({ message: "Profile not found" });
    // }
    const defaultProfile = { weight: 70, height: 170, age: 30, gender: 'male', fitnessGoal: 'maintenance', activityLevel: 'moderate' };
    const safeProfile = profile || defaultProfile;

    // Use profile values or defaults for calculation
    const weight = safeProfile.weight || 70;
    const height = safeProfile.height || 170;
    const age = safeProfile.age || 30;
    const gender = safeProfile.gender || 'male';

    // Map existing fitnessGoal to diet goal if necessary
    let goal = 'maintenance';
    const pGoal = safeProfile.fitnessGoal;
    if (pGoal === 'weight_gain' || pGoal === 'strength') {
      goal = 'muscle_gain';
    } else if (pGoal === 'weight_loss') {
      goal = 'weight_loss';
    } else if (safeProfile.goal) {
      goal = safeProfile.goal;
    } else if (pGoal) {
      if (pGoal.includes('loss')) goal = 'weight_loss';
      if (pGoal.includes('gain')) goal = 'muscle_gain';
    }

    const activityLevel = safeProfile.activityLevel || inferActivityLevelFromDuration(safeProfile.dailyDuration);

    const bmr = calculateBMR({ weight, height, age, gender });
    const tdee = calculateTDEE(bmr, activityLevel);
    const standardMacros = calculateMacros(tdee, goal);

    // --- Override Protein Calculation (Weight Based) ---
    // User Requirement: 2g of protein per kg of body weight
    const proteinGrams = Math.round(weight * 2.0);
    const proteinKcal = proteinGrams * 4;

    // Remaining calories for Carbs and Fats
    const remainingKcal = tdee - proteinKcal;

    // Re-distribute remaining calories based on the original ratio between Carbs and Fats
    // Example: If original was 45% Carb, 20% Fat -> Ratio is 45:20
    const totalRatio = standardMacros.carbs + standardMacros.fats;
    const carbsShare = standardMacros.carbs / totalRatio;
    const fatsShare = standardMacros.fats / totalRatio;

    const carbsKcal = Math.round(remainingKcal * carbsShare);
    const fatsKcal = Math.round(remainingKcal * fatsShare);

    const carbsGrams = Math.round(carbsKcal / 4);
    const fatsGrams = Math.round(fatsKcal / 9);

    res.json({
      calories: Math.round(tdee),
      macros: {
        protein: { kcal: proteinKcal, grams: proteinGrams },
        carbs: { kcal: carbsKcal, grams: carbsGrams },
        fats: { kcal: fatsKcal, grams: fatsGrams }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const DietLog = require("../models/DietLog");

exports.saveDietLog = async (req, res) => {
  try {
    const { calories, macros } = req.body;

    const log = await DietLog.create({
      userId: req.user.id,
      calories,
      macros
    });

    res.status(201).json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save diet log" });
  }
};

exports.getDietHistory = async (req, res) => {
  try {
    const logs = await DietLog.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch diet history" });
  }
};

function inferActivityLevelFromDuration(durationMinutes = 30) {
  if (durationMinutes >= 60) return 'active';
  if (durationMinutes >= 30) return 'moderate';
  return 'sedentary';
}

const DietHistory = require("../models/DietHistory");
const FoodScan = require("../models/FoodScan");

exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    // 1. Fetch Real User History from DietHistory & DietLog & FoodScan
    const historyLogs = await DietHistory.find({
      userId,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: 1 });

    const dietLogs = await DietLog.find({
      userId,
      date: { $gte: sevenDaysAgo }
    });

    const foodScans = await FoodScan.find({
      userId,
      createdAt: { $gte: sevenDaysAgo }
    });

    // Aggregate real daily totals for each of the last 7 days
    const daysMap = {};
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateKey = d.toDateString();
      const dayName = daysOfWeek[d.getDay()];

      daysMap[dateKey] = {
        day: dayName,
        date: d,
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        healthScores: []
      };
    }

    // Accumulate real DietLog entries
    dietLogs.forEach(log => {
      const dateKey = new Date(log.date).toDateString();
      if (daysMap[dateKey]) {
        daysMap[dateKey].calories += log.calories || 0;
        if (log.macros) {
          daysMap[dateKey].protein += log.macros.protein?.grams || 0;
          daysMap[dateKey].carbs += log.macros.carbs?.grams || 0;
          daysMap[dateKey].fats += log.macros.fats?.grams || 0;
        }
      }
    });

    // Accumulate real DietHistory entries
    historyLogs.forEach(h => {
      const dateKey = new Date(h.date).toDateString();
      if (daysMap[dateKey]) {
        daysMap[dateKey].calories = Math.max(daysMap[dateKey].calories, h.totalCalories || 0);
        daysMap[dateKey].protein = Math.max(daysMap[dateKey].protein, h.totalProtein || 0);
        daysMap[dateKey].carbs = Math.max(daysMap[dateKey].carbs, h.totalCarbs || 0);
        daysMap[dateKey].fats = Math.max(daysMap[dateKey].fats, h.totalFats || 0);
        if (h.avgHealthScore) daysMap[dateKey].healthScores.push(h.avgHealthScore);
      }
    });

    // Accumulate real FoodScan entries
    foodScans.forEach(scan => {
      const dateKey = new Date(scan.createdAt).toDateString();
      if (daysMap[dateKey]) {
        daysMap[dateKey].calories += scan.calories || 0;
        daysMap[dateKey].protein += scan.protein || 0;
        daysMap[dateKey].carbs += scan.carbs || 0;
        daysMap[dateKey].fats += scan.fat || 0;
        if (scan.healthScore !== null && scan.healthScore !== undefined) {
          daysMap[dateKey].healthScores.push(scan.healthScore);
        }
      }
    });

    const labels = [];
    const calorieData = [];
    const healthScoreData = [];
    const weeklyMacros = [];

    Object.values(daysMap).forEach(dayObj => {
      labels.push(dayObj.day);
      calorieData.push(Math.round(dayObj.calories));
      const avgHealth = dayObj.healthScores.length > 0 
        ? Math.round(dayObj.healthScores.reduce((a, b) => a + b, 0) / dayObj.healthScores.length)
        : 0;
      healthScoreData.push(avgHealth);
      weeklyMacros.push({
        day: dayObj.day,
        protein: Math.round(dayObj.protein),
        carbs: Math.round(dayObj.carbs),
        fats: Math.round(dayObj.fats)
      });
    });

    // 2. Real Food Quality Breakdown (Last 30 Days)
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const recentScans = await FoodScan.find({
      userId,
      createdAt: { $gte: thirtyDaysAgo }
    });

    let healthy = 0, moderate = 0, unhealthy = 0;
    recentScans.forEach(scan => {
      if (scan.healthScore === null || scan.healthScore === undefined) return;
      if (scan.healthScore >= 60) healthy++;
      else if (scan.healthScore >= 40) moderate++;
      else unhealthy++;
    });

    // 3. Real Insights
    const insights = [];
    const profile = await UserWorkoutProfile.findOne({ userId });
    const weight = profile ? (profile.weight || 70) : 70;
    const proteinTarget = weight * 2;

    const daysMetProtein = weeklyMacros.filter(m => m.protein >= proteinTarget).length;
    if (daysMetProtein > 0) {
      insights.push({ type: 'success', text: `Met your daily protein target (${proteinTarget}g) on ${daysMetProtein} day(s) this week!` });
    } else {
      insights.push({ type: 'warning', text: `Your daily protein target is ${proteinTarget}g based on body weight (${weight}kg). Log meals to track progress!` });
    }

    const scannedCount = recentScans.length;
    if (scannedCount > 0) {
      insights.push({ type: 'success', text: `You have scanned ${scannedCount} food product(s) in the last 30 days.` });
    } else {
      insights.push({ type: 'info', text: `Use the Scan Food tab to scan barcodes & food labels for instant nutrition tracking!` });
    }

    res.json({
      dailyTrend: { labels, calorieData, healthScoreData },
      weeklyMacros,
      foodQuality: { healthy, moderate, unhealthy },
      consistencyScore: daysMetProtein > 0 ? Math.round((daysMetProtein / 7) * 100) : 0,
      insights
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate analytics" });
  }
};

const { meals } = require("../services/mealDatabase");

exports.generateMealPlan = async (req, res) => {
  try {
    const profile = await UserWorkoutProfile.findOne({ userId: req.user.id });
    const defaultProfile = { weight: 70, height: 170, age: 30, gender: 'male', fitnessGoal: 'maintenance', activityLevel: 'moderate' };
    const safeProfile = profile || defaultProfile;

    const weight = safeProfile.weight || 70;
    const height = safeProfile.height || 170;
    const age = safeProfile.age || 30;
    const gender = safeProfile.gender || 'male';

    let goal = 'maintenance';
    const pGoal = safeProfile.fitnessGoal;
    if (pGoal === 'weight_gain' || pGoal === 'strength') goal = 'muscle_gain';
    else if (pGoal === 'weight_loss') goal = 'weight_loss';
    else if (safeProfile.goal) goal = safeProfile.goal;

    const activityLevel = safeProfile.activityLevel || inferActivityLevelFromDuration(safeProfile.dailyDuration);

    const bmr = calculateBMR({ weight, height, age, gender });
    const tdee = calculateTDEE(bmr, activityLevel);
    const standardMacros = calculateMacros(tdee, goal);

    const proteinGrams = Math.round(weight * 2.0);
    const proteinKcal = proteinGrams * 4;
    const remainingKcal = tdee - proteinKcal;
    const totalRatio = standardMacros.carbs + standardMacros.fats;
    const carbsShare = standardMacros.carbs / totalRatio;
    const fatsShare = standardMacros.fats / totalRatio;
    const carbsKcal = Math.round(remainingKcal * carbsShare);
    const fatsKcal = Math.round(remainingKcal * fatsShare);
    const carbsGrams = Math.round(carbsKcal / 4);
    const fatsGrams = Math.round(fatsKcal / 9);

    const targetCalories = Math.round(tdee);
    const targetProtein = proteinGrams;
    const targetCarbs = carbsGrams;
    const targetFats = fatsGrams;

    // Simple matching algorithm to select meals
    const breakfastOptions = meals.filter(m => m.type === 'breakfast');
    const lunchOptions = meals.filter(m => m.type === 'lunch');
    const dinnerOptions = meals.filter(m => m.type === 'dinner');
    const snackOptions = meals.filter(m => m.type === 'snack');

    // Pick random options for now, scale them to hit targets
    const breakfast = breakfastOptions[Math.floor(Math.random() * breakfastOptions.length)];
    const lunch = lunchOptions[Math.floor(Math.random() * lunchOptions.length)];
    const dinner = dinnerOptions[Math.floor(Math.random() * dinnerOptions.length)];
    const snack = snackOptions[Math.floor(Math.random() * snackOptions.length)];

    const selectedMeals = [breakfast, lunch, dinner, snack];
    
    let totalCals = selectedMeals.reduce((acc, m) => acc + m.calories, 0);
    
    // Scale factor to roughly match TDEE
    const scaleFactor = targetCalories / totalCals;

    const scaledMeals = selectedMeals.map(m => ({
        ...m,
        calories: Math.round(m.calories * scaleFactor),
        protein: Math.round(m.protein * scaleFactor),
        carbs: Math.round(m.carbs * scaleFactor),
        fats: Math.round(m.fats * scaleFactor),
    }));

    const finalCals = scaledMeals.reduce((acc, m) => acc + m.calories, 0);
    const finalProtein = scaledMeals.reduce((acc, m) => acc + m.protein, 0);
    const finalCarbs = scaledMeals.reduce((acc, m) => acc + m.carbs, 0);
    const finalFats = scaledMeals.reduce((acc, m) => acc + m.fats, 0);

    res.json({
      target: {
        calories: targetCalories,
        protein: targetProtein,
        carbs: targetCarbs,
        fats: targetFats
      },
      actual: {
        calories: finalCals,
        protein: finalProtein,
        carbs: finalCarbs,
        fats: finalFats
      },
      meals: scaledMeals
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate meal plan" });
  }
};
