import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ProgressDashboard = () => {
    const [sessions, setSessions] = useState([]);
    const [logs, setLogs] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
            if (!token) return;

            const [sessionsRes, logsRes, exercisesRes] = await Promise.all([
                axios.get('http://localhost:5000/api/v1/workouts/sessions', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:5000/api/v1/workouts/progress', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:5000/api/v1/workouts/exercises', { headers: { Authorization: `Bearer ${token}` } })
            ]);

            setSessions(sessionsRes.data);
            setLogs(logsRes.data);
            setExercises(exercisesRes.data);

            // Set default selected exercise if logs exist
            if (logsRes.data.length > 0) {
                setSelectedExercise(logsRes.data[0].exerciseId);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // 1. Workout Frequency (Sessions per Week)
    const processFrequencyData = () => {
        const weeks = {};
        sessions.forEach(session => {
            const date = new Date(session.date);
            const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
            const weekLabel = weekStart.toLocaleDateString();
            weeks[weekLabel] = (weeks[weekLabel] || 0) + 1;
        });

        // Sort by date
        const sortedLabels = Object.keys(weeks).sort((a, b) => new Date(a) - new Date(b));

        return {
            labels: sortedLabels,
            datasets: [
                {
                    label: 'Workouts Completed',
                    data: sortedLabels.map(label => weeks[label]),
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    tension: 0.3
                },
            ],
        };
    };

    // 2. Strength Progress (Max Weight or Volume over time for selected exercise)
    const processStrengthData = () => {
        if (!selectedExercise) return { labels: [], datasets: [] };

        const exerciseLogs = logs
            .filter(log => log.exerciseId === selectedExercise)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        return {
            labels: exerciseLogs.map(log => new Date(log.date).toLocaleDateString()),
            datasets: [
                {
                    label: 'Max Weight (kg)',
                    data: exerciseLogs.map(log => log.maxWeight),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    yAxisID: 'y',
                },
                {
                    label: 'Total Volume (kg)',
                    data: exerciseLogs.map(log => log.totalVolume),
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    yAxisID: 'y1',
                }
            ],
        };
    };

    const caloriesData = {
        labels: sessions.slice().reverse().map(s => new Date(s.date).toLocaleDateString()), // Show oldest to newest
        datasets: [
            {
                label: 'Calories Burned',
                data: sessions.slice().reverse().map(s => s.caloriesBurned),
                backgroundColor: 'rgba(255, 159, 64, 0.5)',
            },
        ],
    };

    if (loading) return <div className="p-6 text-center text-gray-600">Loading dashboard...</div>;

    // Get unique exercises that have logs for the dropdown
    const loggedExerciseIds = [...new Set(logs.map(log => log.exerciseId))];
    const loggedExercises = exercises.filter(ex => loggedExerciseIds.includes(ex._id));

    return (
        <div className="container mx-auto p-6 space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">Progress Dashboard</h2>

            {/* Top Row: Frequency & Calories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-4 text-gray-700">Workout Frequency</h3>
                    <Line options={{ responsive: true }} data={processFrequencyData()} />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-4 text-gray-700">Calories Burned</h3>
                    <Bar options={{ responsive: true }} data={caloriesData} />
                </div>
            </div>

            {/* Middle Row: Strength Progress */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-700">Strength Progress</h3>
                    <select
                        value={selectedExercise}
                        onChange={(e) => setSelectedExercise(e.target.value)}
                        className="p-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {loggedExercises.map(ex => (
                            <option key={ex._id} value={ex._id}>{ex.name}</option>
                        ))}
                    </select>
                </div>
                <div className="h-80">
                    <Line
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            interaction: {
                                mode: 'index',
                                intersect: false,
                            },
                            scales: {
                                y: {
                                    type: 'linear',
                                    display: true,
                                    position: 'left',
                                    title: { display: true, text: 'Max Weight (kg)' }
                                },
                                y1: {
                                    type: 'linear',
                                    display: true,
                                    position: 'right',
                                    grid: { drawOnChartArea: false },
                                    title: { display: true, text: 'Volume (kg)' }
                                },
                            }
                        }}
                        data={processStrengthData()}
                    />
                </div>
            </div>

            {/* Bottom Row: Recent Activity Table */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-gray-700">Recent Activity</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 text-left font-semibold text-gray-600">Date</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-600">Routine</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-600">Duration</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-600">Calories</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-600">Exercises</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map(session => (
                                <tr key={session._id} className="border-t hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4">{new Date(session.date).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 font-medium text-blue-600">{session.routineId?.name || 'Custom Workout'}</td>
                                    <td className="py-3 px-4">{session.duration} min</td>
                                    <td className="py-3 px-4">{session.caloriesBurned} kcal</td>
                                    <td className="py-3 px-4 text-sm text-gray-500">
                                        {session.exercisesCompleted.length} exercises
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProgressDashboard;
