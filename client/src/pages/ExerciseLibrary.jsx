import React, { useState, useEffect } from 'react';
import api from '../api';
import ExerciseCard from '../components/ExerciseCard';

const ExerciseLibrary = () => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        muscle: '',
        equipment: '',
        difficulty: '',
        search: ''
    });

    useEffect(() => {
        fetchExercises();
    }, [filters]);

    const fetchExercises = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams(filters).toString();
            const res = await api.get(`/api/v1/workouts/exercises?${params}`);
            setExercises(res.data);
        } catch (err) {
            console.error('Error fetching exercises:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToWorkout = (exercise) => {
        try {
            const currentQueue = JSON.parse(localStorage.getItem('activeWorkoutQueue') || '[]');
            const newQueue = [...currentQueue, exercise];
            localStorage.setItem('activeWorkoutQueue', JSON.stringify(newQueue));
            alert(`✅ Added ${exercise.name} to your Custom Workout! \n(Total: ${newQueue.length})`);
        } catch (err) {
            console.error(err);
            alert('Failed to add exercise');
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="w-full pb-24 pt-2 sm:pt-4">
            <h2 className="text-4xl font-black mb-8 text-foreground tracking-tight">Exercise Library</h2>

            {/* Filters */}
            <div className="bg-card backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="search"
                            placeholder="Search exercises..."
                            value={filters.search}
                            onChange={handleFilterChange}
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent flex-grow"
                        />
                        <button
                            onClick={fetchExercises}
                            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all duration-300"
                        >
                            Search
                        </button>
                    </div>
                    <select name="muscle" value={filters.muscle} onChange={handleFilterChange} className="p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary [&>option]:bg-gray-900">
                        <option value="">All Muscles</option>
                        <option value="chest">Chest</option>
                        <option value="back">Back</option>
                        <option value="legs">Legs</option>
                        <option value="shoulders">Shoulders</option>
                        <option value="arms">Arms</option>
                        <option value="core">Core</option>
                    </select>
                    <select name="equipment" value={filters.equipment} onChange={handleFilterChange} className="p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary [&>option]:bg-gray-900">
                        <option value="">All Equipment</option>
                        <option value="none">None</option>
                        <option value="dumbbells">Dumbbells</option>
                        <option value="gym">Gym</option>
                    </select>
                    <select name="difficulty" value={filters.difficulty} onChange={handleFilterChange} className="p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary [&>option]:bg-gray-900">
                        <option value="">All Levels</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exercises.map(ex => (
                        <ExerciseCard key={ex._id} exercise={ex} onAdd={handleAddToWorkout} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExerciseLibrary;
