import { useEffect, useState } from 'react';
import scanService from '../services/scanService';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await scanService.getHistory();
                setHistory(data);
            } catch (err) {
                setError('Failed to load history');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) return <div className="text-center py-10">Loading history...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Scan History</h1>

                {history.length === 0 ? (
                    <p className="text-center text-gray-500">No scans yet. Go scan some food!</p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {history.map((scan) => (
                            <div key={scan._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs text-gray-400">{new Date(scan.createdAt).toLocaleDateString()}</span>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full text-white ${scan.healthScore >= 70 ? 'bg-green-500' : scan.healthScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}>
                                        Score: {scan.healthScore}
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
            </div>
        </div>
    );
};

export default History;
