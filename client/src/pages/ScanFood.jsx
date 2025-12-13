import { useState } from 'react';
import BarcodeScanner from '../components/BarcodeScanner';
import scanService from '../services/scanService';

const ScanFood = () => {
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const startScan = () => {
        setScanning(true);
        setResult(null);
        setError(null);
    };

    const handleDetected = async (barcode) => {
        setScanning(false);
        setLoading(true);
        try {
            const data = await scanService.scanBarcode(barcode);
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch product data');
        } finally {
            setLoading(false);
        }
    };

    const manualSearch = async (e) => {
        e.preventDefault();
        const barcode = e.target.barcode.value;
        if (barcode) {
            await handleDetected(barcode);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Scan Food
                </h1>

                {/* Controls */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    {!scanning && !loading && !result && (
                        <div className="text-center">
                            <button
                                onClick={startScan}
                                className="bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-700 transition duration-300 w-full md:w-auto mb-4"
                            >
                                Scan Barcode
                            </button>
                            <div className="relative flex py-5 items-center">
                                <div className="flex-grow border-t border-gray-300"></div>
                                <span className="flex-shrink mx-4 text-gray-400">OR</span>
                                <div className="flex-grow border-t border-gray-300"></div>
                            </div>
                            <form onSubmit={manualSearch} className="flex gap-2">
                                <input
                                    type="text"
                                    name="barcode"
                                    placeholder="Enter barcode manually"
                                    className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <button
                                    type="submit"
                                    className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
                                >
                                    Go
                                </button>
                            </form>
                        </div>
                    )}

                    {scanning && (
                        <BarcodeScanner onDetected={handleDetected} />
                    )}

                    {loading && (
                        <div className="text-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">Analyzing Nutrition...</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center">
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                                {error}
                            </div>
                            <button
                                onClick={() => { setError(null); setResult(null); }}
                                className="text-green-600 underline"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>

                {/* Results */}
                {result && (
                    <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Product Info */}
                            <div className="md:w-1/3">
                                {result.imageUrl ? (
                                    <img src={result.imageUrl} alt={result.productName} className="w-full h-auto rounded-lg shadow-sm" />
                                ) : (
                                    <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">No Image</div>
                                )}
                            </div>

                            {/* Analysis */}
                            <div className="md:w-2/3">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">{result.productName}</h2>
                                <p className="text-sm text-gray-500 mb-4">Barcode: {result.barcode}</p>

                                {/* Health Score */}
                                {result.nutritionAvailable ? (
                                    <div className="flex items-center mb-6">
                                        <div className={`
                                        w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-md mr-4
                                        ${result.healthScore >= 70 ? 'bg-green-500' : result.healthScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'}
                                    `}>
                                            {result.healthScore}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-700">Health Score</p>
                                            <p className="text-sm text-gray-500">
                                                {result.healthScore >= 70 ? 'Excellent Choice' : result.healthScore >= 40 ? 'Moderate' : 'Unhealthy'}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center mb-6">
                                        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-md mr-4 bg-gray-400">
                                            N/A
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-700">Health Score</p>
                                            <p className="text-sm text-gray-500">Insufficient Data</p>
                                        </div>
                                    </div>
                                )}

                                {/* Warnings */}
                                {result.warnings.length > 0 && (
                                    <div className="mb-6">
                                        {result.warnings.map((warning, index) => (
                                            <span key={index} className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-semibold tracking-wide mr-2 mb-2">
                                                ⚠️ {warning}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Nutrition Facts */}
                                {result.nutritionAvailable ? (
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="bg-gray-50 p-2 rounded">
                                            <span className="block text-gray-500">Calories</span>
                                            <span className="font-bold">{result.calories} kcal</span>
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded">
                                            <span className="block text-gray-500">Protein</span>
                                            <span className="font-bold">{result.protein}g</span>
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded">
                                            <span className="block text-gray-500">Sugar</span>
                                            <span className="font-bold">{result.sugar}g</span>
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded">
                                            <span className="block text-gray-500">Fat</span>
                                            <span className="font-bold">{result.fat}g</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 p-4 rounded text-center text-gray-500 text-sm">
                                        Nutrition data currently unavailable for this product.
                                    </div>
                                )}

                                <button
                                    onClick={() => setResult(null)}
                                    className="mt-6 w-full bg-gray-800 text-white font-bold py-2 px-4 rounded hover:bg-gray-700 transition duration-300"
                                >
                                    Scan Another
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScanFood;
