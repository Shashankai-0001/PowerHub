import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errorMsg, setErrorMsg] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { email, password } = formData;
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const onChange = (e) => {
        setErrorMsg('');
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSubmitting(true);
        try {
            await login(formData);
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || 'Invalid email or password';
            setErrorMsg(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] opacity-30"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] opacity-30"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8 relative z-10"
            >
                <div className="bg-card backdrop-blur-xl p-8 rounded-3xl border border-border shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="mx-auto h-12 w-12 bg-muted rounded-xl flex items-center justify-center mb-4 border border-border">
                            <LogIn className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold text-foreground tracking-tight">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Enter your credentials to access your dashboard
                        </p>
                    </div>

                    {/* Inline Form Error Banner */}
                    <AnimatePresence>
                        {errorMsg && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                className="p-4 mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm font-semibold flex items-center gap-3 shadow-sm"
                            >
                                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                                <span>{errorMsg}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form className="space-y-6" onSubmit={onSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="sr-only">Email address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="appearance-none relative block w-full px-4 py-3 bg-muted border border-border placeholder-muted-foreground text-foreground rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:z-10 sm:text-sm transition-all duration-200"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={onChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="appearance-none relative block w-full px-4 py-3 bg-muted border border-border placeholder-muted-foreground text-foreground rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:z-10 sm:text-sm transition-all duration-200"
                                    placeholder="Password"
                                    value={password}
                                    onChange={onChange}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    {submitting ? (
                                        <Loader2 className="h-5 w-5 text-primary-foreground/50 animate-spin" />
                                    ) : (
                                        <ArrowRight className="h-5 w-5 text-primary-foreground/50 group-hover:text-primary-foreground transition-colors" />
                                    )}
                                </span>
                                {submitting ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
                                Sign up for free
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
