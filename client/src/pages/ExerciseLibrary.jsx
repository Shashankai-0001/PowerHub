import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user ? user.token : null;
            const params = new URLSearchParams(filters).toString();
            const res = await axios.get(`http://localhost:5000/api/v1/workouts/exercises?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExercises(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Exercise Library</h2>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search exercises..."
                        value={filters.search}
                        onChange={handleFilterChange}
                        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
                    />
                    <button
                        onClick={fetchExercises}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Search
                    </button>
                </div>
                <select name="muscle" value={filters.muscle} onChange={handleFilterChange} className="p-2 border rounded">
                    <option value="">All Muscles</option>
                    <option value="chest">Chest</option>
                    <option value="back">Back</option>
                    <option value="legs">Legs</option>
                    <option value="shoulders">Shoulders</option>
                    <option value="arms">Arms</option>
                    <option value="core">Core</option>
                </select>
                <select name="equipment" value={filters.equipment} onChange={handleFilterChange} className="p-2 border rounded">
                    <option value="">All Equipment</option>
                    <option value="none">None</option>
                    <option value="dumbbells">Dumbbells</option>
                    <option value="gym">Gym</option>
                </select>
                <select name="difficulty" value={filters.difficulty} onChange={handleFilterChange} className="p-2 border rounded">
                    <option value="">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>
            </div>

            {/* Grid */}
            {loading ? (
                <p className="text-center text-gray-600">Loading exercises...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exercises.map(ex => (
                        <ExerciseCard key={ex._id} exercise={ex} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExerciseLibrary;
