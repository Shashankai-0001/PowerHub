import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="bg-green-600 text-white py-20 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Unleash Your Potential with PowerHub
                </h1>
                <p className="text-xl md:text-2xl mb-8">
                    All-in-one Fitness, Nutrition, and Health Solution
                </p>
                {!user && (
                    <Link
                        to="/register"
                        className="bg-white text-green-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300"
                    >
                        Get Started
                    </Link>
                )}
            </div>

            {/* Modules Grid */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Module 1: Workout */}
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            Workouts
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Track your exercises, sets, and reps with our comprehensive workout manager.
                        </p>
                        <Link
                            to="/workouts"
                            className="text-green-600 font-semibold hover:text-green-700"
                        >
                            Go to Workouts &rarr;
                        </Link>
                    </div>

                    {/* Module 2: Scan Food */}
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1 border-t-4 border-green-500">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            Scan Food
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Instantly analyze nutrition by scanning barcodes. Get health scores and insights!
                        </p>
                        <Link
                            to="/scan"
                            className="text-green-600 font-semibold hover:text-green-700"
                        >
                            Start Scanning &rarr;
                        </Link>
                    </div>

                    {/* Module 3: Diet AI */}
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            Diet AI
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Get personalized diet recommendations powered by advanced AI algorithms.
                        </p>
                        <Link
                            to="/diet/dashboard"
                            className="text-green-600 font-semibold hover:text-green-700"
                        >
                            Get Diet Plan &rarr;
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
