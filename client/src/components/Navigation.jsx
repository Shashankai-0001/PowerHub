// Sidebar and Primary App Navigation Bar
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Dumbbell, ScanLine, UtensilsCrossed, TrendingUp, LogOut, User, Maximize, Minimize } from 'lucide-react';
import { motion } from 'motion/react';
import { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';

import { ThemeToggle } from './ThemeToggle';

const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/workouts', label: 'Workouts', icon: Dumbbell },
    { path: '/scan', label: 'Scan Food', icon: ScanLine },
    { path: '/diet/dashboard', label: 'Diet Planner', icon: UtensilsCrossed },
    { path: '/workouts/dashboard', label: 'Progress', icon: TrendingUp },
];

export function Navigation() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => console.error(err));
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) {
        return (
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border supports-[backdrop-filter]:bg-background/40">
                <div className="max-w-[1800px] w-full mx-auto px-4 sm:px-6 lg:px-10">
                    <div className="flex items-center justify-between h-20">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="relative w-10 h-10 flex items-center justify-center">
                                <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300" />
                                <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center border border-border group-hover:scale-110 transition-transform duration-300">
                                    <Dumbbell className="w-5 h-5 text-primary-foreground" />
                                </div>
                            </div>
                            <span className="text-2xl font-bold text-foreground tracking-tight">
                                Power<span className="text-primary">Hub</span>
                            </span>
                        </Link>
                        <div className="flex items-center space-x-3 sm:space-x-4">
                            <button
                                onClick={toggleFullscreen}
                                className="p-2.5 rounded-xl border border-border bg-card/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all shadow-sm"
                                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
                            >
                                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                            </button>
                            <ThemeToggle />
                            <Link to="/login" className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
                                Log In
                            </Link>
                            <Link to="/register" className="bg-primary text-primary-foreground px-3.5 py-2 rounded-lg font-bold text-xs sm:text-sm hover:bg-primary/90 transition-colors shadow-md">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <>
            {/* Top Navigation Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border supports-[backdrop-filter]:bg-background/40">
                <div className="max-w-[1800px] w-full mx-auto px-4 sm:px-6 lg:px-10">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-3 group shrink-0">
                            <div className="relative w-10 h-10 flex items-center justify-center">
                                <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300" />
                                <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center border border-border group-hover:scale-110 transition-transform duration-300">
                                    <Dumbbell className="w-5 h-5 text-primary-foreground" />
                                </div>
                            </div>
                            <span className="text-2xl font-bold text-foreground tracking-tight">
                                Power<span className="text-primary">Hub</span>
                            </span>
                        </Link>

                        {/* Full Menu (Visible on Desktop width >= 1280px) */}
                        <div className="hidden xl:flex items-center space-x-1 lg:space-x-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;

                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className="relative px-3.5 py-2 group"
                                    >
                                        <div className={`absolute inset-0 bg-muted rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive ? 'opacity-100 bg-muted' : ''}`} />

                                        <div className="relative flex items-center space-x-2">
                                            <Icon className={`w-4 h-4 transition-colors duration-300 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                                            <span className={`text-sm font-medium transition-colors duration-300 ${isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                                {item.label}
                                            </span>
                                        </div>

                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute -bottom-[26px] left-0 right-0 h-[2px] bg-primary shadow-[0_0_10px_rgba(0,163,255,0.5)]"
                                                initial={false}
                                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* User Profile (Full layout >= 1280px) */}
                        <div className="hidden xl:flex items-center space-x-3 pl-6 border-l border-border">
                            <button
                                onClick={toggleFullscreen}
                                className="p-2.5 rounded-xl border border-border bg-card/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all shadow-sm flex items-center gap-2 text-xs font-bold"
                                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
                            >
                                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                            </button>
                            <ThemeToggle />
                            <div className="text-right ml-1">
                                <p className="text-sm font-bold text-foreground leading-none mb-1">{user.name}</p>
                                <p className="text-xs text-primary font-medium tracking-wide">MEMBER</p>
                            </div>
                            <div className="relative cursor-pointer group">
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300" />
                                <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-muted to-muted/80 border border-border flex items-center justify-center text-foreground font-bold group-hover:border-primary/50 transition-colors">
                                    <User className="w-5 h-5" />
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Mobile & Tablet Compact Top Controls (< 1280px width) */}
                        <div className="xl:hidden flex items-center space-x-2 sm:space-x-3">
                            <button
                                onClick={toggleFullscreen}
                                className="p-2 rounded-xl border border-border bg-card/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all shadow-sm"
                                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
                            >
                                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                            </button>
                            <ThemeToggle />
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/60 border border-border rounded-full">
                                <User className="w-4 h-4 text-primary" />
                                <span className="text-xs font-bold text-foreground max-w-[100px] truncate">{user.name}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-xl bg-muted/60 border border-border text-muted-foreground hover:text-foreground transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile & Tablet Bottom Navigation (< 1280px width) */}
            <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-border pb-safe shadow-2xl">
                <div className="flex items-center justify-around py-2.5 px-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="relative flex flex-col items-center p-2 min-w-[56px]"
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="mobileActive"
                                        className="absolute inset-0 bg-muted/80 border border-primary/20 rounded-xl"
                                        initial={false}
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                )}
                                <Icon className={`w-5 h-5 mb-1 relative z-10 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                                <span className={`text-[10px] font-bold relative z-10 transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
