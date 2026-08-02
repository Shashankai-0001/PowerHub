import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, SkipForward, Square, Check, Flag, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

const WorkoutSession = () => {
    const navigate = useNavigate();
    const [routine, setRoutine] = useState(null);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [completedSets, setCompletedSets] = useState({});
    const [phase, setPhase] = useState('WORK');
    const [timeLeft, setTimeLeft] = useState(30);
    const [isPaused, setIsPaused] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [sessionStartTime, setSessionStartTime] = useState(null);

    useEffect(() => {
        fetchRoutine();
    }, []);

    useEffect(() => {
        let interval = null;
        if (!loading && routine && !isPaused && hasStarted) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev > 1) return prev - 1;
                    handlePhaseTransition();
                    return 0;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [loading, routine, isPaused, phase, currentExerciseIndex, hasStarted]);

    const handlePhaseTransition = () => {
        if (!routine) return;

        if (phase === 'WORK') {
            setPhase('REST');
            setTimeLeft(10);
        } else {
            if (currentExerciseIndex < routine.exercises.length - 1) {
                setCurrentExerciseIndex((prev) => prev + 1);
                setPhase('WORK');
                setTimeLeft(30);
            } else {
                setIsPaused(true);
                handleFinishWorkout();
            }
        }
    };

    const handleSkip = () => {
        handlePhaseTransition();
    };

    const handleTogglePause = () => {
        setIsPaused(!isPaused);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const fetchRoutine = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user ? user.token : null;

            let currentRoutine = null;
            const res = await axios.get('http://localhost:5001/api/v1/workouts/routines/generate', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data && res.data.length > 0) {
                const routineId = res.data[0]._id;
                const fullRoutineRes = await axios.get(`http://localhost:5001/api/v1/workouts/routines/${routineId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                currentRoutine = fullRoutineRes.data;
            }

            const customQueue = JSON.parse(localStorage.getItem('activeWorkoutQueue') || '[]');

            if (customQueue.length > 0) {
                const formattedCustomExercises = customQueue.map(ex => ({
                    exercise: ex,
                    sets: 3,
                    reps: '12',
                    _id: `custom-${Date.now()}-${Math.random()}`
                }));

                if (currentRoutine) {
                    currentRoutine.exercises = [...currentRoutine.exercises, ...formattedCustomExercises];
                } else {
                    currentRoutine = {
                        _id: 'custom-combined',
                        name: 'Custom Session',
                        exercises: formattedCustomExercises
                    };
                }
            }

            setRoutine(currentRoutine);
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

    const handleStartSession = () => {
        setHasStarted(true);
        setSessionStartTime(Date.now());
    };

    const handleFinishWorkout = async () => {
        if (!routine) return;
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user ? user.token : null;

            // Calculate accurate duration
            let actualDurationMinutes = 1; // Default minimum 1 minute
            if (sessionStartTime) {
                const diffMs = Date.now() - sessionStartTime;
                actualDurationMinutes = Math.max(1, Math.round(diffMs / 60000));
            }

            // Calculate dynamic calories based on duration and sets completed
            const setsCompletedCount = Object.values(completedSets).filter(Boolean).length;
            // Base calories + extra for completed sets (rough estimate)
            const calculatedCalories = Math.round((actualDurationMinutes * 6) + (setsCompletedCount * 5));

            const exercisesCompleted = routine.exercises.map((ex, idx) => ({
                exercise: ex.exercise._id,
                sets: Array(ex.sets).fill(0).map((_, setIdx) => ({
                    reps: parseInt(ex.reps) || 0,
                    weight: 0,
                    completed: !!completedSets[`${idx}-${setIdx}`]
                }))
            }));

            await axios.post('http://localhost:5001/api/v1/workouts/sessions', {
                routineId: routine._id,
                duration: actualDurationMinutes,
                caloriesBurned: calculatedCalories,
                exercisesCompleted,
                notes: "Great workout!"
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            localStorage.removeItem('activeWorkoutQueue');
            alert('Workout Saved!');
            navigate('/workouts/dashboard');
        } catch (err) {
            console.error(err);
            alert('Error saving workout');
        }
    };

    if (loading) return (
        <div className="min-h-[80vh] flex items-center justify-center bg-transparent">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary shadow-[0_0_20px_var(--primary)]"></div>
        </div>
    );

    if (!routine) return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <div className="bg-card/50 backdrop-blur-xl p-12 rounded-[3rem] shadow-2xl text-center max-w-lg border border-border">
                <div className="text-7xl mb-8 animate-bounce">🔍</div>
                <h2 className="text-4xl font-black mb-4 text-foreground tracking-tight">No Routine Found</h2>
                <p className="text-lg text-muted-foreground mb-10 leading-relaxed font-medium">We couldn't generate a routine. Please update your fitness profile to help us tailor the perfect plan.</p>
                <button
                    onClick={() => navigate('/workouts/profile')}
                    className="w-full bg-primary text-primary-foreground px-8 py-5 rounded-2xl font-black text-xl hover:bg-primary/90 transition-all duration-300 shadow-[0_0_30px_rgba(0,163,255,0.3)] hover:-translate-y-1"
                >
                    Setup Profile
                </button>
            </div>
        </div>
    );

    const currentExercise = routine.exercises[currentExerciseIndex];
    const progress = ((currentExerciseIndex + 1) / routine.exercises.length) * 100;

    return (
        <div className="relative min-h-[90vh] pb-32 pt-8 overflow-hidden">
            {/* Animated Background Glow */}
            <div className={`fixed inset-0 transition-colors duration-1000 opacity-[0.03] pointer-events-none blur-3xl ${phase === 'REST' ? 'bg-orange-500' : 'bg-primary'}`} />

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6"
                >
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-2">{routine.name}</h1>
                        <p className="text-muted-foreground font-bold tracking-wide uppercase text-sm">
                            Exercise {currentExerciseIndex + 1} of {routine.exercises.length} <span className="mx-3 text-border">•</span> {Math.round(progress)}% Complete
                        </p>
                    </div>
                    
                    <div className="w-full md:w-72">
                        <div className="h-2 bg-muted rounded-full overflow-hidden border border-border/50">
                            <div className="h-full bg-primary transition-all duration-700 ease-out shadow-[0_0_10px_var(--primary)]" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Main Stage */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* Active Exercise Card */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className={`relative overflow-hidden rounded-[3rem] bg-card/60 backdrop-blur-2xl border transition-all duration-700 shadow-2xl ${phase === 'REST' ? 'border-orange-500/30 shadow-[0_0_50px_rgba(249,115,22,0.1)]' : 'border-border'}`}
                        >
                            {/* Immersive Header inside Card */}
                            <div className={`px-8 py-16 md:px-12 md:py-24 relative overflow-hidden flex flex-col items-center text-center transition-all duration-700 ${!hasStarted ? 'py-32' : ''}`}>
                                 {/* subtle pulsing glow */}
                                 <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.15] pointer-events-none transition-colors duration-1000 ${phase === 'REST' ? 'bg-orange-500' : 'bg-primary'}`} />
                                 
                                 {!hasStarted ? (
                                    <motion.button 
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleStartSession}
                                        className="group relative flex flex-col items-center gap-8"
                                    >
                                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary/10 flex items-center justify-center relative shadow-[0_0_50px_rgba(0,163,255,0.2)]">
                                            <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-[spin_4s_linear_infinite]" />
                                            <div className="absolute inset-2 rounded-full border border-primary/20 animate-[spin_3s_linear_infinite_reverse]" />
                                            <Play className="w-12 h-12 md:w-16 md:h-16 fill-primary text-primary ml-2 group-hover:scale-110 transition-transform duration-300" />
                                        </div>
                                        <span className="text-3xl md:text-4xl font-black text-foreground tracking-widest uppercase">Start Session</span>
                                    </motion.button>
                                 ) : (
                                     <>
                                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tighter mb-8 relative z-10 leading-tight">
                                            {currentExercise.exercise.name}
                                        </h2>
                                        
                                        {/* Sleek Timer */}
                                        <div className="relative z-10 w-full">
                                            <div className={`text-[6rem] md:text-[8rem] lg:text-[10rem] font-black font-mono tracking-tighter leading-none transition-colors duration-500 ${phase === 'REST' ? 'text-orange-500 drop-shadow-[0_0_40px_rgba(249,115,22,0.3)]' : 'text-primary drop-shadow-[0_0_40px_rgba(0,163,255,0.3)]'}`}>
                                                {formatTime(timeLeft)}
                                            </div>
                                            <motion.div 
                                                key={phase}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-6 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-background/50 border border-border backdrop-blur-md shadow-xl"
                                            >
                                                <div className={`w-3 h-3 rounded-full animate-pulse ${phase === 'REST' ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,1)]' : 'bg-primary shadow-[0_0_10px_rgba(0,163,255,1)]'}`} />
                                                <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                                                    {phase === 'REST' ? 'Rest Phase' : 'Active Interval'}
                                                </span>
                                            </motion.div>
                                        </div>
                                     </>
                                 )}
                            </div>

                            {/* Instruction / Sets Section */}
                            {hasStarted && (
                            <div className="p-8 md:p-12 border-t border-border/50 bg-muted/10 relative z-10">
                                
                                <div className="mb-10">
                                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed italic border-l-4 border-primary pl-6 font-medium">
                                        "{currentExercise.exercise.instructions[0]}"
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-end mb-8">
                                        <h3 className="text-3xl font-black text-foreground tracking-tight">Track Sets</h3>
                                        <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{currentExercise.sets} Total Sets</span>
                                    </div>

                                    {/* Animated Set Pills */}
                                    <div className="space-y-4">
                                        {Array.from({ length: currentExercise.sets }).map((_, idx) => {
                                            const isCompleted = !!completedSets[`${currentExerciseIndex}-${idx}`];
                                            return (
                                                <motion.div
                                                    key={idx}
                                                    onClick={() => handleSetToggle(currentExerciseIndex, idx)}
                                                    whileHover={{ scale: 1.01 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    className={`group flex items-center justify-between p-6 rounded-[2rem] cursor-pointer transition-all duration-300 border-2 ${
                                                        isCompleted 
                                                        ? 'bg-primary/5 border-primary/50 shadow-[inset_0_0_30px_rgba(0,163,255,0.05)]' 
                                                        : 'bg-card border-border hover:border-muted-foreground/30 shadow-lg'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl transition-colors duration-300 ${
                                                            isCompleted ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,163,255,0.5)]' : 'bg-muted text-muted-foreground group-hover:text-foreground'
                                                        }`}>
                                                            {idx + 1}
                                                        </div>
                                                        <div>
                                                            <span className={`block text-2xl font-black transition-colors ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                                {currentExercise.reps} Reps
                                                            </span>
                                                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1 block">Target</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                                        isCompleted ? 'border-primary bg-primary' : 'border-muted-foreground/30 bg-transparent'
                                                    }`}>
                                                        <motion.div 
                                                            initial={false} 
                                                            animate={{ scale: isCompleted ? 1 : 0, opacity: isCompleted ? 1 : 0 }}
                                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                        >
                                                            <Check className="w-6 h-6 text-primary-foreground" strokeWidth={4} />
                                                        </motion.div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        
                        {/* Up Next Card */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-card/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-border shadow-2xl relative overflow-hidden group"
                        >
                            {routine.exercises[currentExerciseIndex + 1] ? (
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                    <h4 className="font-bold text-muted-foreground mb-6 uppercase tracking-widest text-xs flex items-center gap-3">
                                        <Clock className="w-4 h-4 text-secondary" /> Up Next
                                    </h4>
                                    <p className="text-3xl font-black text-foreground leading-tight mb-3 tracking-tight">{routine.exercises[currentExerciseIndex + 1].exercise.name}</p>
                                    <p className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary font-bold text-sm tracking-wide border border-secondary/20">
                                        {routine.exercises[currentExerciseIndex + 1].sets} sets × {routine.exercises[currentExerciseIndex + 1].reps}
                                    </p>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center py-4">
                                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6 relative">
                                        <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping opacity-20" />
                                        <Flag className="w-10 h-10 text-green-500" />
                                    </div>
                                    <p className="text-green-400 font-black text-3xl tracking-tight mb-2">Final Exercise!</p>
                                    <p className="text-muted-foreground font-medium text-sm uppercase tracking-widest">Finish strong</p>
                                </div>
                            )}
                        </motion.div>

                        {/* Workout Plan List */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-card/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-border shadow-2xl flex flex-col h-[500px]"
                        >
                            <div className="flex justify-between items-center mb-8 shrink-0">
                                <h4 className="font-bold text-foreground uppercase tracking-widest text-sm">Session Overview</h4>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                                {routine.exercises.map((ex, idx) => {
                                    const isActive = idx === currentExerciseIndex;
                                    const isPast = idx < currentExerciseIndex;
                                    
                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => setCurrentExerciseIndex(idx)}
                                            className={`p-5 rounded-2xl flex items-center gap-4 transition-all cursor-pointer ${
                                                isActive 
                                                ? 'bg-primary/10 border border-primary/30 shadow-lg scale-[1.02]' 
                                                : 'bg-muted/30 border border-transparent hover:bg-muted'
                                            }`}
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${
                                                isActive ? 'bg-primary text-primary-foreground shadow-[0_0_10px_rgba(0,163,255,0.5)]' : isPast ? 'bg-muted-foreground/20 text-muted-foreground' : 'bg-muted text-muted-foreground'
                                            }`}>
                                                {isPast ? <Check className="w-5 h-5" strokeWidth={3} /> : idx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`font-bold truncate text-lg ${
                                                    isActive ? 'text-primary' : isPast ? 'text-muted-foreground line-through opacity-50' : 'text-foreground'
                                                }`}>
                                                    {ex.exercise.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">{ex.sets} sets × {ex.reps}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Floating Control Bar */}
            {hasStarted && (
                <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
                >
                    <div className="bg-card/90 backdrop-blur-3xl border border-border rounded-[2.5rem] p-3 flex items-center justify-between shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
                        <button
                            disabled={currentExerciseIndex === 0}
                            onClick={() => {
                                setCurrentExerciseIndex(prev => prev - 1);
                                setPhase('WORK');
                                setTimeLeft(30);
                            }}
                            className="w-14 h-14 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                        >
                            <ChevronLeft className="w-7 h-7" />
                        </button>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleTogglePause}
                                className="w-20 h-20 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                            >
                                {isPaused ? <Play className="w-10 h-10 fill-current ml-2" /> : <Pause className="w-10 h-10 fill-current" />}
                            </button>
                            <button
                                onClick={handleSkip}
                                className="w-14 h-14 rounded-full bg-muted/80 text-foreground flex items-center justify-center hover:bg-muted transition-colors"
                            >
                                <SkipForward className="w-6 h-6 fill-current" />
                            </button>
                        </div>

                        {currentExerciseIndex === routine.exercises.length - 1 ? (
                            <button
                                onClick={handleFinishWorkout}
                                className="w-14 h-14 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-colors relative"
                                title="Finish Workout"
                            >
                                <Square className="w-6 h-6 fill-current" />
                                <div className="absolute inset-0 rounded-full border border-red-500/30 animate-ping opacity-50" />
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setCurrentExerciseIndex(prev => prev + 1);
                                    setPhase('WORK');
                                    setTimeLeft(30);
                                }}
                                className="w-14 h-14 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <ChevronRight className="w-7 h-7" />
                            </button>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default WorkoutSession;
