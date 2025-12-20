import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Timer from '../components/Timer';
import Stopwatch from '../components/Stopwatch';
import { useNavigate } from 'react-router-dom';

const WorkoutSession = () => {
    const navigate = useNavigate();
    const [routine, setRoutine] = useState(null);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [completedSets, setCompletedSets] = useState({}); // Map of exerciseIndex-setIndex -> boolean

    useEffect(() => {
        fetchRoutine();
    }, []);

    const fetchRoutine = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user ? user.token : null;
            // For demo, fetching the first available routine or generating one
            const res = await axios.get('http://localhost:5000/api/v1/workouts/routines/generate', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data && res.data.length > 0) {
                // Fetch full details of the first routine
                const routineId = res.data[0]._id;
                const fullRoutineRes = await axios.get(`http://localhost:5000/api/v1/workouts/routines/${routineId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRoutine(fullRoutineRes.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSetToggle = (exerciseIndex, setIndex) => {
        const key = `${exerciseIndex}-${setIndex}`;
        setCompletedSets(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleFinishWorkout = async () => {
        if (!routine) return;
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user ? user.token : null;

            // Construct payload
            const exercisesCompleted = routine.exercises.map((ex, idx) => ({
                exercise: ex.exercise._id,
                sets: Array(ex.sets).fill(0).map((_, setIdx) => ({
                    reps: parseInt(ex.reps) || 0, // Simplified
                    weight: 0, // Should be from input
                    completed: !!completedSets[`${idx}-${setIdx}`]
                }))
            }));

            await axios.post('http://localhost:5000/api/v1/workouts/sessions', {
                routineId: routine._id,
                duration: 45, // Should be calculated from start/end time
                caloriesBurned: 300, // Dummy value
                exercisesCompleted,
                notes: "Great workout!"
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Workout Saved!');
            navigate('/workouts/dashboard');
        } catch (err) {
            console.error(err);
            alert('Error saving workout');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
        </div>
    );

    if (!routine) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">No Routine Found</h2>
                <p className="text-gray-600 mb-6">We couldn't generate a routine for you. Please update your profile to help us create the perfect plan.</p>
                <button
                    onClick={() => navigate('/workouts/profile')}
                    className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition duration-300 shadow-md"
                >
                    Setup Profile
                </button>
            </div>
        </div>
    );

    const currentExercise = routine.exercises[currentExerciseIndex];
    const progress = ((currentExerciseIndex + 1) / routine.exercises.length) * 100;

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            {/* Header / Progress Bar */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">{routine.name}</h1>
                        <p className="text-sm text-gray-500">Exercise {currentExerciseIndex + 1} of {routine.exercises.length}</p>
                    </div>
                    <button
                        onClick={handleFinishWorkout}
                        className="bg-red-500 text-white px-6 py-2 rounded-full font-bold hover:bg-red-600 transition duration-300 shadow-sm text-sm"
                    >
                        Finish
                    </button>
                </div>
                <div className="h-1 bg-gray-200 w-full">
                    <div className="h-1 bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Exercise Card */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                            <div className="relative h-64 md:h-80 bg-gray-100 flex items-center justify-center">
                                {currentExercise.exercise.gifUrl ? (
                                    <img
                                        src={currentExercise.exercise.gifUrl}
                                        alt={currentExercise.exercise.name}
                                        className="w-full h-full object-contain p-4"
                                    />
                                ) : (
                                    <span className="text-gray-400 text-lg">No Animation Available</span>
                                )}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm">
                                    {currentExercise.exercise.category.toUpperCase()}
                                </div>
                            </div>

                            <div className="p-6 md:p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-3xl font-bold text-gray-800">{currentExercise.exercise.name}</h2>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-600">{currentExercise.sets}</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">Sets</div>
                                    </div>
                                </div>

                                <p className="text-gray-600 mb-6 leading-relaxed bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                                    {currentExercise.exercise.instructions[0]}
                                </p>

                                {/* Sets Tracker */}
                                <div className="space-y-3">
                                    <h3 className="font-bold text-gray-700 mb-2">Track Sets</h3>
                                    {Array.from({ length: currentExercise.sets }).map((_, idx) => {
                                        const isCompleted = !!completedSets[`${currentExerciseIndex}-${idx}`];
                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => handleSetToggle(currentExerciseIndex, idx)}
                                                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${isCompleted
                                                        ? 'bg-green-50 border-green-500 shadow-sm'
                                                        : 'bg-white border-gray-100 hover:border-blue-200'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                                                        }`}>
                                                        {idx + 1}
                                                    </div>
                                                    <span className={`font-medium ${isCompleted ? 'text-green-800' : 'text-gray-700'}`}>
                                                        {currentExercise.reps} Reps
                                                    </span>
                                                </div>
                                                <div className={`text-2xl transition-transform duration-300 ${isCompleted ? 'scale-110' : 'scale-100'}`}>
                                                    {isCompleted ? '✅' : '⬜'}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex justify-between gap-4">
                            <button
                                disabled={currentExerciseIndex === 0}
                                onClick={() => setCurrentExerciseIndex(prev => prev - 1)}
                                className="flex-1 py-4 bg-white text-gray-700 rounded-xl font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none transition-all"
                            >
                                ← Previous
                            </button>
                            <button
                                disabled={currentExerciseIndex === routine.exercises.length - 1}
                                onClick={() => setCurrentExerciseIndex(prev => prev + 1)}
                                className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 disabled:shadow-none transition-all"
                            >
                                Next Exercise →
                            </button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span>⏱️</span> Session Timer
                            </h4>
                            <Stopwatch />
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span>⏳</span> Rest Timer
                            </h4>
                            <Timer duration={60} />
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                            <h4 className="font-bold text-gray-800 mb-4">Workout Plan</h4>
                            <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                {routine.exercises.map((ex, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setCurrentExerciseIndex(idx)}
                                        className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center gap-3 ${idx === currentExerciseIndex
                                                ? 'bg-blue-50 border border-blue-200'
                                                : 'hover:bg-gray-50 border border-transparent'
                                            }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === currentExerciseIndex ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                                            }`}>
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm font-medium ${idx === currentExerciseIndex ? 'text-blue-800' : 'text-gray-700'}`}>
                                                {ex.exercise.name}
                                            </p>
                                            <p className="text-xs text-gray-500">{ex.sets} sets × {ex.reps}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkoutSession;
