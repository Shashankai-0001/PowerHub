import React from 'react';
import { Link } from 'react-router-dom';

const Workouts = () => {
    const modules = [
        {
            title: 'Start Workout',
            description: 'Begin your daily workout session with guided exercises and timers.',
            icon: '🏋️‍♂️',
            link: '/workouts/session',
            color: 'bg-blue-500'
        },
        {
            title: 'My Profile',
            description: 'Update your fitness goals, experience level, and available equipment.',
            icon: '👤',
            link: '/workouts/profile',
            color: 'bg-green-500'
        },
        {
            title: 'Exercise Library',
            description: 'Browse hundreds of exercises with instructions and tips.',
            icon: '📚',
            link: '/workouts/exercises',
            color: 'bg-purple-500'
        },
        {
            title: 'Weekly Planner',
            description: 'Plan your workouts for the week and manage rest days.',
            icon: '📅',
            link: '/workouts/planner',
            color: 'bg-yellow-500'
        },
        {
            title: 'Progress Dashboard',
            description: 'Track your consistency, calories burned, and strength progress.',
            icon: '📈',
            link: '/workouts/dashboard',
            color: 'bg-red-500'
        },
        {
            title: 'Notes & Reminders',
            description: 'Keep track of your thoughts, tasks, and workout reminders.',
            icon: '📝',
            link: '/workouts/notes',
            color: 'bg-indigo-500'
        }
    ];

    return (
        <div className="container mx-auto p-6">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Workout Management</h1>
                <p className="text-gray-600">Your all-in-one hub for fitness tracking and planning.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((mod, index) => (
                    <Link
                        key={index}
                        to={mod.link}
                        className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 overflow-hidden group"
                    >
                        <div className={`h-2 ${mod.color}`}></div>
                        <div className="p-6">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition duration-300 inline-block">
                                {mod.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{mod.title}</h3>
                            <p className="text-gray-600 text-sm">{mod.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Workouts;
