import { useEffect, useState } from 'react';
import scanService from '../services/scanService';
import axios from 'axios';

const History = () => {
    const [activeTab, setActiveTab] = useState('scans'); // 'scans', 'diet', 'workouts'
    const [scanHistory, setScanHistory] = useState([]);
    const [dietHistory, setDietHistory] = useState([]);
    const [workoutHistory, setWorkoutHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const token = user ? user.token : null;
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const [scansRes, dietRes, workoutsRes] = await Promise.all([
                    scanService.getHistory(),
                    axios.get('/api/diet/history', config).catch(() => ({ data: [] })),
                    axios.get('/api/v1/workouts/sessions', config).catch(() => ({ data: [] }))
                ]);

                setScanHistory(scansRes);
                setDietHistory(dietRes.data);
                setWorkoutHistory(workoutsRes.data);
            } catch (err) {
                setError('Failed to load history');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="text-center py-10">Loading history...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">My History</h1>

                <div className="flex justify-center mb-8">
                    <div className="bg-white p-1 rounded-lg shadow-sm border border-gray-200 flex flex-wrap gap-1 justify-center">
                        <button
                            className={`px-6 py-2 rounded-md font-medium transition ${activeTab === 'scans' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
                            onClick={() => setActiveTab('scans')}
                        >
                            Food Scans
                        </button>
                        <button
                            className={`px-6 py-2 rounded-md font-medium transition ${activeTab === 'diet' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
                            onClick={() => setActiveTab('diet')}
                        >
                            Diet Plans
                        </button>
                        <button
                            className={`px-6 py-2 rounded-md font-medium transition ${activeTab === 'workouts' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
                            onClick={() => setActiveTab('workouts')}
                        >
                            Workouts
                        </button>
                    </div>
                </div>

                {activeTab === 'scans' && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {scanHistory.length === 0 ? <p className="text-center col-span-full text-gray-500">No scans yet.</p> : scanHistory.map((scan) => (
                            <div key={scan._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs text-gray-400">{new Date(scan.createdAt).toLocaleDateString()}</span>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full text-white ${scan.healthScore === null ? 'bg-gray-400' :
                                        scan.healthScore >= 70 ? 'bg-green-500' : scan.healthScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}>
                                        Score: {scan.healthScore !== null ? scan.healthScore : 'N/A'}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2 truncate" title={scan.productName}>
                                    {scan.productName}
                                </h3>

                                {scan.imageUrl && (
                                    <div className="h-32 bg-gray-100 rounded mb-4 overflow-hidden flex items-center justify-center">
                                        <img src={scan.imageUrl} alt={scan.productName} className="object-contain h-full" />
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                    <div>Cal: {scan.calories}</div>
                                    <div>Protein: {scan.protein}g</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'diet' && (
                    <div className="space-y-4">
                        {dietHistory.length === 0 ? <p className="text-center text-gray-500">No saved diet plans yet.</p> : dietHistory.map((log) => (
                            <div key={log._id} className="bg-white rounded-xl shadow p-6 border-l-4 border-indigo-500 flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">{new Date(log.date).toLocaleDateString()} at {new Date(log.date).toLocaleTimeString()}</p>
                                    <h3 className="text-xl font-bold text-gray-800">Diet Plan Snapshot</h3>
                                    <p className="text-gray-600 mt-1">Target: <span className="font-semibold text-indigo-600">{log.calories} kcal</span></p>
                                </div>
                                <div className="text-right text-sm space-y-1">
                                    <p>🥩 <span className="font-semibold">{log.macros.protein.grams}g</span> Protein</p>
                                    <p>🍞 <span className="font-semibold">{log.macros.carbs.grams}g</span> Carbs</p>
                                    <p>🥑 <span className="font-semibold">{log.macros.fats.grams}g</span> Fats</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'workouts' && (
                    <div className="space-y-4">
                        {workoutHistory.length === 0 ? <p className="text-center text-gray-500">No workout sessions logged yet.</p> : workoutHistory.map((session) => (
                            <div key={session._id} className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">{new Date(session.date).toLocaleDateString()} at {new Date(session.date).toLocaleTimeString()}</p>
                                        <h3 className="text-xl font-bold text-gray-800">{session.routineId?.name || 'Custom Workout'}</h3>
                                    </div>
                                    <div className="text-right">
                                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                            {session.duration} mins
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                                    <div className="bg-gray-50 p-2 rounded">
                                        <span className="block text-xs text-gray-500">Calories Burned</span>
                                        <span className="font-semibold">{session.caloriesBurned} kcal</span>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded">
                                        <span className="block text-xs text-gray-500">Exercises</span>
                                        <span className="font-semibold">{session.exercisesCompleted?.length || 0}</span>
                                    </div>
                                </div>

                                {session.notes && (
                                    <div className="text-sm text-gray-500 italic border-t pt-2">
                                        "{session.notes}"
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
