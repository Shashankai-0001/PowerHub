import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeeklyPlanner = () => {
    const [plan, setPlan] = useState(null);
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user ? user.token : null;
            const [planRes, routinesRes] = await Promise.all([
                axios.get('http://localhost:5000/api/v1/workouts/weekly-plan', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:5000/api/v1/workouts/routines', { headers: { Authorization: `Bearer ${token}` } })
            ]);

            setPlan(planRes.data || { days: daysOfWeek.map(day => ({ dayOfWeek: day, routineId: '', isRestDay: false })) });
            setRoutines(routinesRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDayChange = (index, field, value) => {
        const newDays = [...plan.days];
        newDays[index] = { ...newDays[index], [field]: value };
        setPlan({ ...plan, days: newDays });
    };

    const savePlan = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user ? user.token : null;
            await axios.post('http://localhost:5000/api/v1/workouts/weekly-plan', {
                weekStartDate: new Date(), // Should be start of current week
                days: plan.days
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Plan Saved!');
        } catch (err) {
            console.error(err);
            alert('Error saving plan');
        }
    };

    if (loading) return <div className="p-6">Loading planner...</div>;

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Weekly Workout Planner</h2>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-6 text-left font-bold text-gray-600">Day</th>
                            <th className="py-3 px-6 text-left font-bold text-gray-600">Activity / Routine</th>
                            <th className="py-3 px-6 text-center font-bold text-gray-600">Rest Day</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {plan.days.map((day, index) => (
                            <tr key={day.dayOfWeek} className={day.isRestDay ? 'bg-gray-50' : ''}>
                                <td className="py-4 px-6 font-medium text-gray-800">{day.dayOfWeek}</td>
                                <td className="py-4 px-6">
                                    <select
                                        disabled={day.isRestDay}
                                        value={day.routineId?._id || day.routineId || ''}
                                        onChange={(e) => handleDayChange(index, 'routineId', e.target.value)}
                                        className="w-full p-2 border rounded disabled:opacity-50"
                                    >
                                        <option value="">Select Routine</option>
                                        {routines.map(r => (
                                            <option key={r._id} value={r._id}>{r.name}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <input
                                        type="checkbox"
                                        checked={day.isRestDay}
                                        onChange={(e) => handleDayChange(index, 'isRestDay', e.target.checked)}
                                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    onClick={savePlan}
                    className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 transition duration-300"
                >
                    Save Weekly Plan
                </button>
            </div>
        </div>
    );
};

export default WeeklyPlanner;
