import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { PlayCircle, BookOpen, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

const Workouts = () => {
    const location = useLocation();

    const tabs = [
        { name: 'Active Session', path: '/workouts/session', icon: PlayCircle },
        { name: 'Exercise Library', path: '/workouts/exercises', icon: BookOpen },
        { name: 'Weekly Planner', path: '/workouts/planner', icon: Calendar },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Unified Sub-Navigation Header */}
            <div className="bg-card/80 backdrop-blur-xl border-b border-border sticky top-20 z-30 pt-4 pb-2 px-4 sm:px-6 lg:px-8 shadow-md">
                <div className="max-w-[1800px] w-full mx-auto flex gap-6 overflow-x-auto custom-scrollbar">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = location.pathname === tab.path;

                        return (
                            <NavLink
                                key={tab.path}
                                to={tab.path}
                                className={`relative flex items-center gap-2 px-4 py-3 rounded-t-xl transition-colors font-bold whitespace-nowrap ${
                                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                {tab.name}
                                
                                {isActive && (
                                    <motion.div
                                        layoutId="workoutTabIndicator"
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_0_10px_var(--primary)]"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </NavLink>
                        );
                    })}
                </div>
            </div>

            {/* Child Routes Content */}
            <div className="max-w-[1800px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12 sm:pb-16">
                <Outlet />
            </div>
        </div>
    );
};

export default Workouts;
