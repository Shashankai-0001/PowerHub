// Controller for Managing Workout Sessions and Routines
// Manages creation, updating, and history of workout routines
const mongoose = require('mongoose');
const UserWorkoutProfile = require('../models/UserWorkoutProfile');
const Exercise = require('../models/Exercise');
const WorkoutRoutine = require('../models/WorkoutRoutine');
const WorkoutSession = require('../models/WorkoutSession');
const WeeklyPlan = require('../models/WeeklyPlan');
const ProgressLog = require('../models/ProgressLog');
const Note = require('../models/Note');
const Task = require('../models/Task');
const Reminder = require('../models/Reminder');

const cleanNumber = (val) => {
    if (val === '' || val === null || val === undefined || isNaN(Number(val))) return undefined;
    return Number(val);
};

// --- Profile ---
exports.createOrUpdateProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User session expired or user not found. Please log in again.' });
        }
        const { age, gender, fitnessGoal, experienceLevel, equipment, dailyDuration, weight, height, activityLevel, goal } = req.body;
        const userId = req.user._id || req.user.id;

        const updateData = {
            userId,
            gender: gender || 'male',
            fitnessGoal: fitnessGoal || 'general_fitness',
            experienceLevel: experienceLevel || 'beginner',
            equipment: equipment || 'none',
            dailyDuration: cleanNumber(dailyDuration) || 30,
            age: cleanNumber(age) || 25,
            weight: cleanNumber(weight),
            height: cleanNumber(height),
            activityLevel: activityLevel || 'moderate',
            goal: goal || 'maintenance'
        };

        const profile = await UserWorkoutProfile.findOneAndUpdate(
            { userId },
            { $set: updateData },
            { new: true, upsert: true, runValidators: true }
        );
        res.json(profile);
    } catch (err) {
        console.error('Error in createOrUpdateProfile:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const profile = await UserWorkoutProfile.findOne({ userId: req.user.id });
        if (!profile) return res.status(404).json({ message: 'Profile not found' });
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const defaultExercisesList = [
    {
        name: 'Push-ups',
        category: 'strength',
        targetMuscles: ['chest', 'triceps', 'shoulders'],
        equipment: 'none',
        difficulty: 'beginner',
        instructions: ['Start in a plank position.', 'Lower your body until your chest almost touches the floor.', 'Push back up to the starting position.'],
        recommendedSets: 3,
        recommendedReps: '10-12',
        gifUrl: 'https://media.giphy.com/media/wwNv7s3k4qWJO/giphy.gif'
    },
    {
        name: 'Bodyweight Squats',
        category: 'strength',
        targetMuscles: ['quadriceps', 'glutes', 'hamstrings'],
        equipment: 'none',
        difficulty: 'beginner',
        instructions: ['Stand with feet shoulder-width apart.', 'Lower your hips back and down as if sitting in a chair.', 'Return to standing position.'],
        recommendedSets: 3,
        recommendedReps: '12-15',
        gifUrl: 'https://media.giphy.com/media/12h4xwPxNCAxxe/giphy.gif'
    },
    {
        name: 'Pull-ups',
        category: 'strength',
        targetMuscles: ['back', 'lats', 'biceps'],
        equipment: 'gym',
        difficulty: 'intermediate',
        instructions: ['Grab the pull-up bar with an overhand grip.', 'Pull yourself up until your chin clears the bar.', 'Lower yourself down with control.'],
        recommendedSets: 3,
        recommendedReps: '8-10'
    },
    {
        name: 'Dumbbell Bench Press',
        category: 'strength',
        targetMuscles: ['chest', 'triceps', 'shoulders'],
        equipment: 'dumbbells',
        difficulty: 'beginner',
        instructions: ['Lie back on a flat bench holding dumbbells at chest height.', 'Press weights upward until arms are extended.', 'Lower back down slowly.'],
        recommendedSets: 3,
        recommendedReps: '10-12',
        gifUrl: 'https://media.giphy.com/media/61T05t2sSQfFC/giphy.gif'
    },
    {
        name: 'Barbell Deadlift',
        category: 'strength',
        targetMuscles: ['legs', 'back', 'glutes', 'hamstrings'],
        equipment: 'gym',
        difficulty: 'advanced',
        instructions: ['Stand with feet hip-width apart under a barbell.', 'Bend at hips and knees to grip the bar.', 'Drive through heels to stand up straight.'],
        recommendedSets: 4,
        recommendedReps: '6-8'
    },
    {
        name: 'Overhead Press',
        category: 'strength',
        targetMuscles: ['shoulders', 'triceps'],
        equipment: 'dumbbells',
        difficulty: 'intermediate',
        instructions: ['Hold dumbbells at shoulder height with palms facing forward.', 'Press weights straight overhead.', 'Lower back to shoulders.'],
        recommendedSets: 3,
        recommendedReps: '10-12',
        gifUrl: 'https://media.giphy.com/media/wM0IbbcNmwOR2/giphy.gif'
    },
    {
        name: 'Plank',
        category: 'core',
        targetMuscles: ['core', 'abdominals'],
        equipment: 'none',
        difficulty: 'beginner',
        instructions: ['Place forearms on the ground with elbows aligned under shoulders.', 'Keep body in a straight line from head to heels.', 'Hold position while breathing steadily.'],
        recommendedSets: 3,
        recommendedReps: '30s',
        gifUrl: 'https://media.giphy.com/media/p8yq7b2tNn4vm/giphy.gif'
    },
    {
        name: 'Lunges',
        category: 'strength',
        targetMuscles: ['legs', 'quadriceps', 'glutes'],
        equipment: 'none',
        difficulty: 'beginner',
        instructions: ['Step forward with one leg and lower hips until both knees are at 90 degrees.', 'Push back up to starting position.', 'Switch legs and repeat.'],
        recommendedSets: 3,
        recommendedReps: '10-12 per leg',
        gifUrl: 'https://media.giphy.com/media/l3q2Q3sUEkEyDvfTZC/giphy.gif'
    },
    {
        name: 'Bicep Curls',
        category: 'strength',
        targetMuscles: ['arms', 'biceps'],
        equipment: 'dumbbells',
        difficulty: 'beginner',
        instructions: ['Hold dumbbells at sides with palms facing forward.', 'Curl weights toward shoulders while keeping elbows stationary.', 'Lower back down slowly.'],
        recommendedSets: 3,
        recommendedReps: '12-15',
        gifUrl: 'https://media.giphy.com/media/wKwTcfz10bLwc/giphy.gif'
    },
    {
        name: 'Tricep Dips',
        category: 'strength',
        targetMuscles: ['arms', 'triceps'],
        equipment: 'none',
        difficulty: 'intermediate',
        instructions: ['Position hands on a stable bench behind you.', 'Lower body by bending elbows to 90 degrees.', 'Push back up to start.'],
        recommendedSets: 3,
        recommendedReps: '10-12',
        gifUrl: 'https://media.giphy.com/media/3o7qE5866bLg4PcnRw/giphy.gif'
    },
    {
        name: 'Russian Twists',
        category: 'core',
        targetMuscles: ['core', 'abdominals'],
        equipment: 'none',
        difficulty: 'intermediate',
        instructions: ['Sit on floor with knees bent and feet slightly elevated.', 'Lean back slightly and twist torso side to side.', 'Maintain core engagement.'],
        recommendedSets: 3,
        recommendedReps: '20 total'
    },
    {
        name: 'Burpees',
        category: 'cardio',
        targetMuscles: ['full body', 'quadriceps', 'chest'],
        equipment: 'none',
        difficulty: 'advanced',
        instructions: ['From standing position, drop into a squat and place hands on floor.', 'Kick feet back into plank.', 'Return to squat and explode upwards into a jump.'],
        recommendedSets: 3,
        recommendedReps: '10-12',
        gifUrl: 'https://media.giphy.com/media/23hPPmr8PnmjwRfS/giphy.gif'
    },
    {
        name: 'Incline Dumbbell Press',
        category: 'strength',
        targetMuscles: ['chest', 'shoulders', 'triceps'],
        equipment: 'dumbbells',
        difficulty: 'intermediate',
        instructions: ['Set bench to 30-45 degree incline.', 'Press dumbbells upward until arms are straight.', 'Lower slowly back to chest level.'],
        recommendedSets: 3,
        recommendedReps: '10-12'
    },
    {
        name: 'Barbell Back Squat',
        category: 'strength',
        targetMuscles: ['quadriceps', 'glutes', 'hamstrings', 'legs'],
        equipment: 'gym',
        difficulty: 'intermediate',
        instructions: ['Rest barbell across upper back.', 'Squat down by hinging hips and bending knees.', 'Drive back up to standing.'],
        recommendedSets: 4,
        recommendedReps: '8-10'
    },
    {
        name: 'Lat Pulldown',
        category: 'strength',
        targetMuscles: ['back', 'lats', 'biceps'],
        equipment: 'gym',
        difficulty: 'beginner',
        instructions: ['Grip pulldown bar wider than shoulder width.', 'Pull bar down toward upper chest while squeezing shoulder blades.', 'Return bar smoothly up.'],
        recommendedSets: 3,
        recommendedReps: '10-12'
    },
    {
        name: 'Hammer Curls',
        category: 'strength',
        targetMuscles: ['arms', 'biceps', 'forearms'],
        equipment: 'dumbbells',
        difficulty: 'beginner',
        instructions: ['Hold dumbbells with palms facing each other (neutral grip).', 'Curl weights toward shoulders.', 'Lower back down with control.'],
        recommendedSets: 3,
        recommendedReps: '12-15'
    },
    {
        name: 'Skull Crushers',
        category: 'strength',
        targetMuscles: ['arms', 'triceps'],
        equipment: 'dumbbells',
        difficulty: 'intermediate',
        instructions: ['Lie back on bench holding dumbbells overhead.', 'Bend elbows to lower weights toward forehead.', 'Extend arms back to start.'],
        recommendedSets: 3,
        recommendedReps: '10-12'
    },
    {
        name: 'Leg Press',
        category: 'strength',
        targetMuscles: ['quadriceps', 'glutes', 'legs'],
        equipment: 'gym',
        difficulty: 'beginner',
        instructions: ['Sit in leg press machine with feet shoulder-width on sled.', 'Unlatch handles and lower sled until knees form 90 degrees.', 'Press sled back up.'],
        recommendedSets: 3,
        recommendedReps: '12-15'
    },
    {
        name: 'Calf Raises',
        category: 'strength',
        targetMuscles: ['calves', 'legs'],
        equipment: 'none',
        difficulty: 'beginner',
        instructions: ['Stand with feet hip-width apart.', 'Raise up onto toes as high as possible.', 'Pause and lower heels slowly.'],
        recommendedSets: 4,
        recommendedReps: '15-20'
    },
    {
        name: 'Mountain Climbers',
        category: 'cardio',
        targetMuscles: ['core', 'abdominals', 'quadriceps'],
        equipment: 'none',
        difficulty: 'beginner',
        instructions: ['Start in high plank position.', 'Drive right knee toward chest, then quickly switch legs.', 'Continue at rapid pace.'],
        recommendedSets: 3,
        recommendedReps: '40s',
        gifUrl: 'https://media.giphy.com/media/13t2OTCFzCqJbO/giphy.gif'
    },
    {
        name: 'Side Plank',
        category: 'core',
        targetMuscles: ['core', 'abdominals'],
        equipment: 'none',
        difficulty: 'intermediate',
        instructions: ['Lie on side resting on forearm with feet stacked.', 'Lift hips off ground until body forms straight line.', 'Hold position.'],
        recommendedSets: 3,
        recommendedReps: '30s per side'
    },
    {
        name: 'Cable Face Pulls',
        category: 'strength',
        targetMuscles: ['shoulders', 'traps', 'back'],
        equipment: 'gym',
        difficulty: 'intermediate',
        instructions: ['Attach rope to upper cable pulley.', 'Pull handles toward face while flaring elbows outwards.', 'Squeeze upper back and return.'],
        recommendedSets: 3,
        recommendedReps: '12-15'
    }
];

// --- Exercises ---
exports.getExercises = async (req, res) => {
    try {
        // Ensure default exercises are seeded in DB without broken Giphy links
        await Exercise.updateMany({ gifUrl: { $regex: 'giphy' } }, { $unset: { gifUrl: "" } });
        for (const exData of defaultExercisesList) {
            const { gifUrl, ...cleanEx } = exData;
            await Exercise.updateOne({ name: exData.name }, { $set: cleanEx, $unset: { gifUrl: "" } }, { upsert: true });
        }

        const { muscle, equipment, difficulty, search } = req.query;
        let query = {};

        if (muscle && muscle.trim()) {
            const muscleMap = {
                chest: ['chest'],
                back: ['lats', 'middle back', 'lower back', 'traps', 'neck'],
                legs: ['quadriceps', 'hamstrings', 'calves', 'glutes', 'abductors', 'adductors'],
                shoulders: ['shoulders'],
                arms: ['biceps', 'triceps', 'forearms'],
                core: ['abdominals', 'core']
            };

            const targetMuscles = muscleMap[muscle.trim().toLowerCase()];
            if (targetMuscles) {
                query.targetMuscles = { $in: targetMuscles };
            } else {
                query.targetMuscles = muscle.trim(); // Fallback for direct matches
            }
        }

        if (equipment && equipment.trim()) query.equipment = equipment.trim();
        if (difficulty && difficulty.trim()) query.difficulty = difficulty.trim();
        if (search && search.trim()) query.name = { $regex: search.trim(), $options: 'i' };

        const exercises = await Exercise.find(query);
        res.json(exercises);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getExerciseById = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        if (!exercise) return res.status(404).json({ message: 'Exercise not found' });
        res.json(exercise);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- Routines ---
exports.generateRoutine = async (req, res) => {
    try {
        let profile = await UserWorkoutProfile.findOne({ userId: req.user.id });
        
        let goal = profile ? profile.fitnessGoal : 'general_fitness';
        let level = profile ? profile.experienceLevel : 'beginner';

        // 1. Try exact match
        let routines = await WorkoutRoutine.find({ goal, level }).populate('exercises.exercise');

        // 2. Fallback: Match goal only
        if (routines.length === 0) {
            routines = await WorkoutRoutine.find({ goal }).populate('exercises.exercise');
        }

        // 3. Fallback: Match level only
        if (routines.length === 0) {
            routines = await WorkoutRoutine.find({ level }).populate('exercises.exercise');
        }

        // 4. Ultimate Fallback: Return ANY routine
        if (routines.length === 0) {
            routines = await WorkoutRoutine.find().populate('exercises.exercise');
        }

        // 5. If literally NO routines exist in the DB, create one on the fly!
        if (routines.length === 0) {
            // Check for exercises
            let exerciseCount = await Exercise.countDocuments();
            let defaultExercise;
            
            if (exerciseCount === 0) {
                // Seed a couple of default exercises
                defaultExercise = new Exercise({
                    name: 'Push-ups',
                    category: 'strength',
                    targetMuscles: ['chest', 'triceps', 'shoulders'],
                    equipment: 'none',
                    difficulty: 'beginner',
                    instructions: ['Start in a plank position.', 'Lower your body.', 'Push back up.'],
                });
                await defaultExercise.save();
                
                await new Exercise({
                    name: 'Bodyweight Squats',
                    category: 'strength',
                    targetMuscles: ['quadriceps', 'glutes', 'hamstrings'],
                    equipment: 'none',
                    difficulty: 'beginner',
                    instructions: ['Stand with feet shoulder-width apart.', 'Lower hips back.', 'Return to standing.'],
                }).save();
            } else {
                defaultExercise = await Exercise.findOne();
            }

            // Create a default routine
            const newRoutine = new WorkoutRoutine({
                name: 'Full Body Starter',
                goal: 'general_fitness',
                level: 'beginner',
                equipment: 'none',
                duration: 20,
                exercises: [{
                    exercise: defaultExercise._id,
                    sets: 3,
                    reps: '10',
                    order: 1,
                    section: 'main'
                }]
            });
            await newRoutine.save();
            
            const populatedRoutine = await WorkoutRoutine.findById(newRoutine._id).populate('exercises.exercise');
            routines = [populatedRoutine];
        }

        // Clean null exercise references
        const cleanedRoutines = routines.map(r => {
            const obj = r.toObject ? r.toObject() : { ...r };
            if (obj.exercises) {
                obj.exercises = obj.exercises.filter(ex => ex && ex.exercise);
            }
            return obj;
        }).filter(r => r.exercises && r.exercises.length > 0);

        res.json(cleanedRoutines);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

exports.getRoutines = async (req, res) => {
    try {
        const routines = await WorkoutRoutine.find();
        res.json(routines);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getRoutineById = async (req, res) => {
    try {
        const routine = await WorkoutRoutine.findById(req.params.id).populate('exercises.exercise');
        if (!routine) return res.status(404).json({ message: 'Routine not found' });
        res.json(routine);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- Sessions ---
exports.createRoutine = async (req, res) => {
    try {
        const { name, exercises, goal, level } = req.body;
        // Basic validation
        if (!exercises || exercises.length === 0) {
            return res.status(400).json({ message: 'Exercises are required' });
        }

        const routine = new WorkoutRoutine({
            name: name || `Custom Routine - ${new Date().toLocaleDateString()}`,
            goal: 'general_fitness', // Default enum value
            level: 'intermediate',   // Default enum value
            equipment: 'gym',        // Default enum value (required)
            duration: 45,            // Default estimate
            exercises: exercises.map(ex => ({
                exercise: ex._id,
                sets: 3, // Default
                reps: "12", // Default
                rest: 60 // Default
            }))
        });

        await routine.save();

        // Populate for immediate use
        const populatedRoutine = await WorkoutRoutine.findById(routine._id).populate('exercises.exercise');

        res.status(201).json(populatedRoutine);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.logSession = async (req, res) => {
    try {
        const { routineId, duration, caloriesBurned, exercisesCompleted, notes } = req.body;

        const validRoutineId = (routineId && mongoose.Types.ObjectId.isValid(routineId)) ? routineId : null;

        const sanitizedExercises = (exercisesCompleted || []).map(ex => {
            const exId = (typeof ex.exercise === 'object' && ex.exercise !== null) ? ex.exercise._id : ex.exercise;
            return {
                exercise: (exId && mongoose.Types.ObjectId.isValid(exId)) ? exId : null,
                sets: ex.sets || []
            };
        }).filter(ex => ex.exercise !== null);

        const session = new WorkoutSession({
            userId: req.user.id,
            routineId: validRoutineId,
            duration: Number(duration) || 1,
            caloriesBurned: Number(caloriesBurned) || 0,
            exercisesCompleted: sanitizedExercises,
            notes
        });
        await session.save();

        // Update Progress Logs
        for (const ex of sanitizedExercises) {
            if (!ex.exercise) continue;

            let maxWeight = 0;
            let totalReps = 0;
            let totalVolume = 0;

            (ex.sets || []).forEach(set => {
                if (set.completed) {
                    const weight = Number(set.weight) || 0;
                    const reps = Number(set.reps) || 0;
                    if (weight > maxWeight) maxWeight = weight;
                    totalReps += reps;
                    totalVolume += (reps * weight);
                }
            });

            const log = new ProgressLog({
                userId: req.user.id,
                exerciseId: ex.exercise,
                maxWeight,
                totalReps,
                totalVolume
            });
            await log.save();
        }

        res.status(201).json(session);
    } catch (err) {
        console.error('Error in logSession:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.getSessions = async (req, res) => {
    try {
        const sessions = await WorkoutSession.find({ userId: req.user.id }).sort({ date: -1 }).populate('routineId');
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- Weekly Plan ---
exports.getWeeklyPlan = async (req, res) => {
    try {
        // Get plan for current week or specific date
        // For simplicity, let's just get the latest plan or by weekStartDate
        const plan = await WeeklyPlan.findOne({ userId: req.user.id }).sort({ weekStartDate: -1 }).populate('days.routineId');
        res.json(plan);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.saveWeeklyPlan = async (req, res) => {
    try {
        const { weekStartDate, days } = req.body;
        let plan = await WeeklyPlan.findOne({ userId: req.user.id, weekStartDate });

        if (plan) {
            plan.days = days;
            await plan.save();
        } else {
            plan = new WeeklyPlan({
                userId: req.user.id,
                weekStartDate,
                days
            });
            await plan.save();
        }
        res.json(plan);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- Progress ---
exports.getProgress = async (req, res) => {
    try {
        const { exerciseId } = req.query;
        const query = { userId: req.user.id };
        if (exerciseId) query.exerciseId = exerciseId;

        const logs = await ProgressLog.find(query).sort({ date: 1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- Notes/Tasks/Reminders ---
exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createNote = async (req, res) => {
    try {
        const note = new Note({ ...req.body, userId: req.user.id });
        await note.save();
        res.json(note);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createTask = async (req, res) => {
    try {
        const task = new Task({ ...req.body, userId: req.user.id });
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getReminders = async (req, res) => {
    try {
        const reminders = await Reminder.find({ userId: req.user.id }).sort({ datetime: 1 });
        res.json(reminders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createReminder = async (req, res) => {
    try {
        const reminder = new Reminder({ ...req.body, userId: req.user.id });
        await reminder.save();
        res.json(reminder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
