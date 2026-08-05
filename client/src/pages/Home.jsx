import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../api';
import { motion } from 'motion/react';
import { Flame, Target, TrendingUp, Zap, Award, Calendar, Dumbbell, UtensilsCrossed, Clock, CheckCircle2, Phone, Mail, ShieldCheck } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { ActivityChart } from '../components/ActivityChart';
import { MacroChart } from '../components/MacroChart';
import { ContactSection } from '../components/ContactSection';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const Home = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [dashboardData, setDashboardData] = useState(null);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (user) {
            api.get('/api/v1/dashboard')
                .then((res) => {
                    setDashboardData(res.data);
                    setLoadingData(false);
                })
                .catch((err) => {
                    console.error('Failed to fetch dashboard data:', err);
                    setLoadingData(false);
                });
        }
    }, [user]);

    if (authLoading || (user && loadingData)) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-transparent text-foreground">
                <div className="animate-pulse flex flex-col items-center">
                    <Dumbbell className="w-12 h-12 text-primary animate-bounce mb-4" />
                    <p className="text-xl font-bold tracking-widest text-muted-foreground uppercase">Loading</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="relative w-full overflow-hidden">
                {/* Background effects */}
                <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] animate-pulse -z-10" />
                <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] animate-blob animation-delay-2000 -z-10" />

                {/* Hero Section */}
                <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden">
                    <div className="max-w-[1800px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-left"
                        >
                            <div className="inline-flex items-center px-5 py-2.5 mb-8 space-x-3 border rounded-full bg-card/80 border-border backdrop-blur-xl shadow-xl hover:shadow-primary/20 transition-shadow cursor-default">
                                <span className="relative flex w-3 h-3">
                                    <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-primary"></span>
                                    <span className="relative inline-flex w-3 h-3 rounded-full bg-primary"></span>
                                </span>
                                <span className="text-sm font-black tracking-widest uppercase text-foreground">
                                    PowerHub v2.0 is Live
                                </span>
                            </div>

                            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-foreground mb-8 tracking-tighter leading-[1.05] drop-shadow-2xl">
                                Transform Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-sky-400 to-primary dark:from-primary dark:via-cyan-300 dark:to-primary">
                                    Fitness Journey
                                </span>
                            </h1>

                            <p className="max-w-2xl mb-10 text-base sm:text-xl md:text-2xl leading-relaxed text-muted-foreground font-medium drop-shadow-md">
                                The ultimate all-in-one ecosystem. We combine intelligent workout generation, precise macro tracking, and real-time biometric analytics into one beautiful platform.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                <Link
                                    to="/register"
                                    className="px-6 py-4 sm:px-10 sm:py-5 bg-primary text-primary-foreground font-black text-base sm:text-lg rounded-full hover:bg-primary/90 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(0,163,255,0.4)] flex items-center justify-center gap-3"
                                >
                                    Start Your Journey <Zap className="w-5 h-5" />
                                </Link>
                                <Link
                                    to="/login"
                                    className="px-6 py-4 sm:px-10 sm:py-5 text-base sm:text-lg font-bold transition-all duration-300 border bg-card text-foreground rounded-full border-border hover:bg-muted backdrop-blur-xl hover:-translate-y-1 shadow-xl flex items-center justify-center"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </motion.div>

                        {/* Right Content - Hero Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                            className="relative hidden lg:block"
                        >
                            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full z-0" />
                            <motion.img 
                                animate={{ y: [0, -20, 0] }}
                                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                                src="/hero-athlete.png" 
                                alt="Athlete Motivation" 
                                className="relative z-10 w-full h-[600px] object-cover rounded-[3rem] shadow-2xl border border-border"
                            />
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 px-4 bg-muted/30 border-y border-border backdrop-blur-sm relative z-10">
                    <div className="max-w-[1800px] w-full mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-6">Everything you need. <br/><span className="text-muted-foreground">Nothing you don't.</span></h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">Replace three different apps with one unified, intelligent platform.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-card border border-border p-10 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors duration-300">
                                    <Dumbbell className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                                </div>
                                <h3 className="text-2xl font-black text-foreground mb-4">Smart Workouts</h3>
                                <p className="text-muted-foreground leading-relaxed">Dynamic routines generated based on your goals, equipment, and past performance. Never do the same boring workout twice.</p>
                            </div>

                            <div className="bg-card border border-border p-10 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2">
                                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-secondary transition-colors duration-300">
                                    <UtensilsCrossed className="w-8 h-8 text-secondary group-hover:text-secondary-foreground transition-colors" />
                                </div>
                                <h3 className="text-2xl font-black text-foreground mb-4">Precision Diet</h3>
                                <p className="text-muted-foreground leading-relaxed">Calculate exact macros, scan foods instantly, and generate full daily meal plans that actually hit your targets mathematically.</p>
                            </div>

                            <div className="bg-card border border-border p-10 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2">
                                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent transition-colors duration-300">
                                    <TrendingUp className="w-8 h-8 text-accent group-hover:text-accent-foreground transition-colors" />
                                </div>
                                <h3 className="text-2xl font-black text-foreground mb-4">Deep Analytics</h3>
                                <p className="text-muted-foreground leading-relaxed">Track your volume, monitor calorie trends, and watch your consistency score rise with beautiful, interactive charts.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How it Works */}
                <section className="py-32 px-4 relative z-10">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight mb-8">How it works</h2>
                                <div className="space-y-12">
                                    <div className="flex gap-6">
                                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-black text-primary-foreground shrink-0 shadow-[0_0_20px_rgba(0,163,255,0.4)] hover:scale-110 transition-transform">1</div>
                                        <div>
                                            <h4 className="text-2xl font-bold text-foreground mb-2">Build Your Profile</h4>
                                            <p className="text-muted-foreground text-lg leading-relaxed">Input your metrics and goals. Our engine calculates your exact BMR, TDEE, and optimal macronutrient split.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-2xl font-black text-secondary-foreground shrink-0 shadow-[0_0_20px_rgba(0,163,255,0.2)] hover:scale-110 transition-transform">2</div>
                                        <div>
                                            <h4 className="text-2xl font-bold text-foreground mb-2">Follow the Protocol</h4>
                                            <p className="text-muted-foreground text-lg leading-relaxed">Use the Meal Planner to eat right, and the Workout Session interface to train hard. We guide you every step of the way.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center text-2xl font-black text-background shrink-0 hover:scale-110 transition-transform">3</div>
                                        <div>
                                            <h4 className="text-2xl font-bold text-foreground mb-2">See Real Results</h4>
                                            <p className="text-muted-foreground text-lg leading-relaxed">Watch your dashboard update in real-time. Hit your streaks, improve your Health Score, and transform your body.</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div 
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 blur-3xl rounded-[3rem]" />
                                <div className="relative bg-card border border-border rounded-[3rem] p-4 shadow-2xl flex flex-col items-center justify-center overflow-hidden group">
                                    <motion.img 
                                        animate={{ y: [-10, 10, -10] }}
                                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                        src="/app-mockup.png" 
                                        alt="App Interface Mockup" 
                                        className="w-full h-auto object-cover rounded-[2rem]"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Advanced Metrics / Under the Hood */}
                <section className="py-24 px-4 relative z-10 bg-card border-y border-border">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-16 items-center">
                            <div className="flex-1 order-2 md:order-1">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-background p-6 rounded-3xl border border-border">
                                        <div className="text-3xl font-black text-primary mb-2">BMR</div>
                                        <p className="text-sm text-muted-foreground font-medium">Mifflin-St Jeor engine calculates exact Basal Metabolic Rate.</p>
                                    </div>
                                    <div className="bg-background p-6 rounded-3xl border border-border mt-8">
                                        <div className="text-3xl font-black text-secondary mb-2">TDEE</div>
                                        <p className="text-sm text-muted-foreground font-medium">Total Daily Energy Expenditure scaled by active time.</p>
                                    </div>
                                    <div className="bg-background p-6 rounded-3xl border border-border">
                                        <div className="text-3xl font-black text-accent mb-2">Score</div>
                                        <p className="text-sm text-muted-foreground font-medium">Proprietary algorithm scores dietary compliance daily.</p>
                                    </div>
                                    <div className="bg-background p-6 rounded-3xl border border-border mt-8">
                                        <div className="text-3xl font-black text-foreground mb-2">Macros</div>
                                        <p className="text-sm text-muted-foreground font-medium">Exact macronutrient distribution for bulking or cutting.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 order-1 md:order-2">
                                <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-6">Engineered for <br/>Real Results.</h2>
                                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                                    We don't do generic advice. PowerHub runs on a sophisticated mathematical engine that scales every workout and meal specifically to your biometrics. Our algorithms calculate exactly what you need to eat down to the gram, and exactly how hard you need to train to force adaptation.
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-primary" />
                                        <span className="font-medium text-foreground">Real-time calorie scaling</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-secondary" />
                                        <span className="font-medium text-foreground">Dynamic workout volume adjustments</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-accent" />
                                        <span className="font-medium text-foreground">Comprehensive macro generation</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-24 px-4 relative z-10 bg-muted/30">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-black text-foreground mb-4">Trusted by athletes.</h2>
                            <p className="text-xl text-muted-foreground">Join thousands of users who have transformed their lives.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { name: "Alex Chen", handle: "@alexc_fit", text: "The meal generation algorithm is insane. I just hit a button and it gives me a perfectly scaled day of eating that hits my macros exactly. Lost 15lbs in 2 months." },
                                { name: "Sarah Jenkins", handle: "@sarahlifts", text: "Finally, an app that actually combines workout tracking and diet planning elegantly. The dark mode UI is beautiful, and the data tracking is unparalleled." },
                                { name: "Marcus Johnson", handle: "@marcus_j", text: "I've tried MyFitnessPal, Strong, and Carbon. PowerHub replaces all three. The dashboard gives me exactly what I need to see every morning to stay on track." }
                            ].map((t, i) => (
                                <div key={i} className="bg-card p-8 rounded-3xl border border-border shadow-lg">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                            {t.name[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-foreground">{t.name}</div>
                                            <div className="text-sm text-muted-foreground">{t.handle}</div>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed">"{t.text}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>


                
                {/* Executive Contact Us Section */}
                <ContactSection />

                {/* Footer */}
                <footer className="py-12 border-t border-border text-center text-muted-foreground font-medium relative z-10 bg-background">
                    <p>© {new Date().getFullYear()} PowerHub Platform. All rights reserved.</p>
                </footer>
            </div>
        );
    }

    const { stats, activityChartData, macroChartData, recentActivities } = dashboardData || {};

    return (
        <div className="relative px-4 py-8 pb-24 mx-auto max-w-[1800px] w-full sm:px-6 lg:px-8 md:pb-12">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 mb-12"
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="mb-2 text-4xl font-black tracking-tight md:text-5xl text-foreground">
                            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-sky-400 to-primary dark:from-primary dark:via-cyan-300 dark:to-primary">
                                {user.name || 'Athlete'}
                            </span>
                        </h1>
                        <p className="text-lg font-medium text-muted-foreground">Ready to crush your goals today?</p>
                    </div>
                    <div className="px-6 py-3 bg-card border border-border rounded-2xl backdrop-blur-xl flex items-center gap-3 shadow-xl">
                        <Flame className="w-6 h-6 text-orange-500" />
                        <div>
                            <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Current Streak</p>
                            <p className="text-2xl font-black text-foreground leading-none">{stats?.currentStreak || 0} {stats?.currentStreak === 1 ? 'Day' : 'Days'}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="relative z-10 grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 lg:grid-cols-4"
            >
                <StatCard icon={Flame} title="Calories Burned" value={stats?.caloriesBurned || 0} subtitle="kcal today" color="from-orange-500 to-red-600" trend={stats?.trends?.calories || "0%"} delay={0.1} />
                <StatCard icon={Target} title="Diet Score" value={stats?.dietScore || 0} subtitle="Average today" color="from-primary to-green-400" trend={stats?.trends?.dietScore || "0%"} delay={0.2} />
                <StatCard icon={Zap} title="Active Time" value={stats?.activeTime || 0} subtitle="minutes" color="from-secondary to-blue-500" trend={stats?.trends?.activeTime || "0%"} delay={0.3} />
                <StatCard icon={Award} title="Workouts" value={stats?.workoutsThisWeek || 0} subtitle="this week" color="from-accent to-purple-500" trend={stats?.trends?.workouts || "0%"} delay={0.4} />
            </motion.div>

            {/* Main Dashboard Grid */}
            <div className="relative z-10 grid grid-cols-1 gap-8 mb-12 xl:grid-cols-3">
                {/* Activity Chart & Macros (2/3 width on large screens) */}
                <div className="xl:col-span-2 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="relative group"
                    >
                        <div className="absolute inset-0 transition-all duration-500 opacity-20 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-xl group-hover:blur-2xl" />
                        <div className="relative p-8 border bg-card backdrop-blur-xl rounded-3xl border-border shadow-2xl">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="mb-1 text-2xl font-black text-foreground tracking-tight">Activity Overview</h2>
                                    <p className="text-sm font-medium text-muted-foreground">Weekly performance analytics</p>
                                </div>
                                <div className="p-3 border bg-muted rounded-xl border-border shadow-inner">
                                    <Calendar className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                            <ActivityChart data={activityChartData} />
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 }}
                            className="relative group h-full"
                        >
                            <div className="absolute inset-0 transition-all duration-500 opacity-20 bg-gradient-to-br from-accent/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl" />
                            <div className="relative h-full p-8 border bg-card backdrop-blur-xl rounded-3xl border-border shadow-2xl">
                                <div className="mb-8">
                                    <h2 className="mb-1 text-2xl font-black text-foreground tracking-tight">Biometrics</h2>
                                    <p className="text-sm font-medium text-muted-foreground">Daily nutrition breakdown</p>
                                </div>
                                <MacroChart data={macroChartData} />
                            </div>
                        </motion.div>
                        
                        {/* Quick Actions (Moved here for better layout) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7 }}
                            className="flex flex-col gap-4"
                        >
                            <Link to="/workouts" className="flex-1">
                                <QuickAction title="Start Training" description="Begin your daily session" color="from-primary to-green-400" icon={Dumbbell} delay={0} />
                            </Link>
                            <Link to="/scan" className="flex-1">
                                <QuickAction title="Log Nutrition" description="Scan food or enter macros" color="from-orange-500 to-red-500" icon={UtensilsCrossed} delay={0.1} />
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Recent Activity Feed (1/3 width on large screens) */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="relative group xl:col-span-1"
                >
                    <div className="absolute inset-0 transition-all duration-500 opacity-20 bg-gradient-to-b from-secondary/20 to-transparent rounded-3xl blur-xl group-hover:blur-2xl" />
                    <div className="relative h-full p-8 border bg-card backdrop-blur-xl rounded-3xl border-border shadow-2xl flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="mb-1 text-2xl font-black text-foreground tracking-tight">Recent Activity</h2>
                                <p className="text-sm font-medium text-muted-foreground">Your latest achievements</p>
                            </div>
                            <div className="p-3 border bg-muted rounded-xl border-border shadow-inner">
                                <Clock className="w-6 h-6 text-secondary" />
                            </div>
                        </div>

                        <div className="flex-1 space-y-6">
                            {(!recentActivities || recentActivities.length === 0) ? (
                                <div className="text-muted-foreground text-center py-8">No recent activity found.</div>
                            ) : recentActivities.map((activity, index) => {
                                // dynamically render icons since they are sent as strings
                                let ActIcon = Dumbbell;
                                if (activity.icon === 'UtensilsCrossed') ActIcon = UtensilsCrossed;
                                else if (activity.icon === 'Target') ActIcon = Target;
                                else if (activity.icon === 'Zap') ActIcon = Zap;

                                return (
                                <motion.div 
                                    key={activity.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9 + (index * 0.1) }}
                                    className="flex gap-4 items-start relative before:absolute before:left-[1.15rem] before:top-10 before:bottom-[-1.5rem] before:w-[2px] before:bg-border last:before:hidden"
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${activity.bg} ${activity.color} shadow-lg z-10`}>
                                        <ActIcon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 bg-muted/50 p-4 rounded-2xl border border-border/50 hover:bg-muted transition-colors">
                                        <h4 className="font-bold text-foreground text-sm mb-1">{activity.title}</h4>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-muted-foreground">{new Date(activity.time).toLocaleDateString()}</span>
                                            <span className={`text-xs font-black ${activity.color} bg-background px-2 py-1 rounded-md shadow-sm border border-border`}>{activity.value}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )})}
                        </div>
                        
                        <button className="mt-8 w-full py-4 rounded-xl border border-border text-sm font-bold text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2">
                            View All History
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

function QuickAction({ title, description, color, icon: Icon, delay }) {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative h-full p-6 overflow-hidden transition-all duration-300 border cursor-pointer group rounded-2xl bg-card border-border backdrop-blur-md hover:border-primary/30 shadow-lg"
        >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 rounded-full -mr-12 -mt-12`} />

            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg shadow-black/20`}>
                <Icon className="text-primary-foreground w-7 h-7" />
            </div>

            <h3 className="mb-2 text-xl font-black transition-colors text-foreground group-hover:text-primary tracking-tight">{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground font-medium">{description}</p>

            <div className="absolute transition-all duration-300 transform translate-x-4 opacity-0 bottom-6 right-6 group-hover:opacity-100 group-hover:translate-x-0">
                <div className={`p-2 rounded-full bg-gradient-to-br ${color} text-primary-foreground shadow-lg`}>
                    <TrendingUp className="w-5 h-5" />
                </div>
            </div>
        </motion.div>
    );
}

export default Home;
