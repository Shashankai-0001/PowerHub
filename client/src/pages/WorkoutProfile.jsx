import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const WorkoutProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        age: '',
        gender: 'male',
        fitnessGoal: 'general_fitness',
        experienceLevel: 'beginner',
        equipment: 'none',
        dailyDuration: 30
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user ? user.token : null;
            const res = await axios.get('http://localhost:5000/api/v1/workouts/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data) {
                setFormData(res.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user ? user.token : null;
            await axios.post('http://localhost:5000/api/v1/workouts/profile', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/workouts');
        } catch (err) {
            console.error(err);
            alert('Error saving profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Setup Your Workout Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Age</label>
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Gender</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Fitness Goal</label>
                    <select
                        name="fitnessGoal"
                        value={formData.fitnessGoal}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="weight_loss">Weight Loss</option>
                        <option value="weight_gain">Weight Gain</option>
                        <option value="strength">Strength Building</option>
                        <option value="general_fitness">General Fitness</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Experience Level</label>
                    <select
                        name="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Available Equipment</label>
                    <select
                        name="equipment"
                        value={formData.equipment}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="none">None (Bodyweight)</option>
                        <option value="dumbbells">Dumbbells</option>
                        <option value="resistance_bands">Resistance Bands</option>
                        <option value="gym">Full Gym</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Daily Workout Duration (minutes)</label>
                    <input
                        type="number"
                        name="dailyDuration"
                        value={formData.dailyDuration}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-300 font-bold"
                >
                    {loading ? 'Saving...' : 'Save Profile'}
                </button>
            </form>
        </div>
    );
};

export default WorkoutProfile;
