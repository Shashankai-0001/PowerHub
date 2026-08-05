const mongoose = require('mongoose');
const dns = require('dns');
const dotenv = require('dotenv');
const Exercise = require('./models/Exercise');

dotenv.config();

try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to DB');
        
        const newExercises = [
            {
                name: 'Pull-ups',
                category: 'strength',
                targetMuscles: ['back', 'lats', 'biceps'],
                equipment: 'gym',
                difficulty: 'intermediate',
                instructions: ['Grab the pull-up bar.', 'Pull yourself up until your chin is over the bar.', 'Lower yourself down slowly.'],
            },
            {
                name: 'Dumbbell Bench Press',
                category: 'strength',
                targetMuscles: ['chest', 'triceps', 'shoulders'],
                equipment: 'dumbbells',
                difficulty: 'beginner',
                instructions: ['Lie on a bench.', 'Press dumbbells straight up.', 'Lower them back to your chest.'],
            },
            {
                name: 'Barbell Deadlift',
                category: 'strength',
                targetMuscles: ['legs', 'back', 'glutes', 'hamstrings'],
                equipment: 'gym',
                difficulty: 'advanced',
                instructions: ['Stand with feet hip-width apart.', 'Hinge at the hips to grab the bar.', 'Stand up straight with the bar.'],
            },
            {
                name: 'Overhead Press',
                category: 'strength',
                targetMuscles: ['shoulders', 'triceps'],
                equipment: 'dumbbells',
                difficulty: 'intermediate',
                instructions: ['Sit or stand.', 'Press dumbbells overhead.', 'Lower them back to shoulder level.'],
            },
            {
                name: 'Plank',
                category: 'strength',
                targetMuscles: ['core', 'abdominals'],
                equipment: 'none',
                difficulty: 'beginner',
                instructions: ['Get into a push-up position.', 'Rest on your forearms.', 'Hold the position, keeping your body in a straight line.'],
            },
            {
                name: 'Lunges',
                category: 'strength',
                targetMuscles: ['legs', 'quadriceps', 'glutes'],
                equipment: 'none',
                difficulty: 'beginner',
                instructions: ['Stand straight.', 'Step forward with one leg.', 'Lower your hips until both knees are bent at a 90-degree angle.'],
            },
            {
                name: 'Bicep Curls',
                category: 'strength',
                targetMuscles: ['arms', 'biceps'],
                equipment: 'dumbbells',
                difficulty: 'beginner',
                instructions: ['Hold a dumbbell in each hand.', 'Curl the weights towards your shoulders.', 'Lower them back down slowly.'],
            },
            {
                name: 'Tricep Dips',
                category: 'strength',
                targetMuscles: ['arms', 'triceps'],
                equipment: 'none',
                difficulty: 'intermediate',
                instructions: ['Place hands on a bench behind you.', 'Lower your body by bending your elbows.', 'Push back up.'],
            },
            {
                name: 'Russian Twists',
                category: 'strength',
                targetMuscles: ['core', 'abdominals'],
                equipment: 'none',
                difficulty: 'intermediate',
                instructions: ['Sit on the floor, lean back slightly.', 'Twist your torso to the right, then to the left.', 'Keep your core engaged.'],
            },
            {
                name: 'Burpees',
                category: 'cardio',
                targetMuscles: ['full body'],
                equipment: 'none',
                difficulty: 'advanced',
                instructions: ['Start in a standing position.', 'Drop into a squat position.', 'Kick your feet back into a plank.', 'Return to squat and jump up.'],
            }
        ];

        try {
            await Exercise.insertMany(newExercises);
            console.log('Successfully inserted 10 exercises!');
        } catch (err) {
            console.error('Error inserting:', err);
        }
        
        process.exit(0);
    })
    .catch(err => {
        console.error('DB Connection Error:', err);
        process.exit(1);
    });
