import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X, ShieldAlert } from 'lucide-react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    // Toast notifications state
    const [toasts, setToasts] = useState([]);

    // Modal state for full center dialogs
    const [modalState, setModalState] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info', // 'success' | 'error' | 'info'
        onConfirm: null
    });

    const addToast = useCallback(({ title, message, type = 'info' }) => {
        const id = Date.now() + Math.random().toString(36).substring(2, 9);
        const cleanMsg = String(message || '').replace(/^✅\s*/, '');
        
        let derivedTitle = title;
        if (!derivedTitle) {
            derivedTitle = type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Notice';
        }

        setToasts(prev => [...prev, { id, title: derivedTitle, message: cleanMsg, type }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showModal = ({ title, message, type = 'info', onConfirm = null }) => {
        setModalState({
            isOpen: true,
            title: title || (type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Notification'),
            message: message || '',
            type,
            onConfirm
        });
    };

    const closeModal = () => {
        if (modalState.onConfirm) {
            modalState.onConfirm();
        }
        setModalState(prev => ({ ...prev, isOpen: false }));
    };

    // Global override for native window.alert to use sleek non-blocking toasts
    useEffect(() => {
        const originalAlert = window.alert;

        window.alert = (msg) => {
            const strMsg = String(msg || '');
            let type = 'info';
            let title = 'Notice';

            if (strMsg.toLowerCase().includes('success') || strMsg.toLowerCase().includes('saved') || strMsg.includes('✅') || strMsg.toLowerCase().includes('added')) {
                type = 'success';
                title = 'Success';
            } else if (strMsg.toLowerCase().includes('error') || strMsg.toLowerCase().includes('failed') || strMsg.toLowerCase().includes('invalid') || strMsg.toLowerCase().includes('not match')) {
                type = 'error';
                title = 'Notice';
            }

            addToast({
                title,
                message: strMsg,
                type
            });
        };

        return () => {
            window.alert = originalAlert;
        };
    }, [addToast]);

    return (
        <ModalContext.Provider value={{ showModal, closeModal, addToast, removeToast }}>
            {children}

            {/* Top-Center Floating Executive Toast Container */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] space-y-3 pointer-events-none max-w-md w-[92vw] sm:w-[420px] flex flex-col items-center">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: -25, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -15, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                            className="pointer-events-auto w-full bg-card/95 backdrop-blur-2xl border border-border/90 shadow-[0_15px_40px_rgba(0,0,0,0.35)] rounded-2xl p-4 flex items-start gap-3.5 relative overflow-hidden group"
                        >
                            {/* Accent indicator line */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                                toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-rose-500' : 'bg-primary'
                            }`} />

                            {/* Icon badge */}
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border mt-0.5 ${
                                toast.type === 'success'
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                                    : toast.type === 'error'
                                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                                    : 'bg-primary/10 border-primary/30 text-primary'
                            }`}>
                                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                                {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
                                {toast.type === 'info' && <Info className="w-5 h-5" />}
                            </div>

                            {/* Message text */}
                            <div className="flex-1 min-w-0 pr-4">
                                <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-0.5">
                                    {toast.title}
                                </h4>
                                <p className="text-sm font-semibold text-foreground leading-snug">
                                    {toast.message}
                                </p>
                            </div>

                            {/* Dismiss button */}
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                                title="Close"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Executive Full Center Modal */}
            <AnimatePresence>
                {modalState.isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-card/95 backdrop-blur-2xl border border-border shadow-[0_25px_70px_rgba(0,0,0,0.6)] rounded-[2.5rem] p-8 max-w-md w-full text-center relative overflow-hidden"
                        >
                            {/* Decorative ambient background glow */}
                            <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl opacity-25 pointer-events-none ${
                                modalState.type === 'success' ? 'bg-emerald-500' : modalState.type === 'error' ? 'bg-rose-500' : 'bg-primary'
                            }`} />

                            {/* Close icon button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-5 right-5 p-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Icon Container */}
                            <div className="flex justify-center mb-6 pt-2">
                                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border shadow-xl ${
                                    modalState.type === 'success'
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                                        : modalState.type === 'error'
                                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.2)]'
                                        : 'bg-primary/10 border-primary/30 text-primary shadow-[0_0_30px_rgba(0,163,255,0.2)]'
                                }`}>
                                    {modalState.type === 'success' && <CheckCircle2 className="w-10 h-10" />}
                                    {modalState.type === 'error' && <ShieldAlert className="w-10 h-10" />}
                                    {modalState.type === 'info' && <Info className="w-10 h-10" />}
                                </div>
                            </div>

                            {/* Content */}
                            <h3 className="text-2xl font-black text-foreground tracking-tight mb-2">
                                {modalState.title}
                            </h3>
                            <p className="text-muted-foreground font-medium leading-relaxed mb-8 whitespace-pre-line text-sm md:text-base">
                                {modalState.message}
                            </p>

                            {/* Action Button */}
                            <button
                                onClick={closeModal}
                                className={`w-full py-4 font-bold text-base md:text-lg rounded-2xl transition-all duration-300 transform hover:scale-[1.01] shadow-xl ${
                                    modalState.type === 'success'
                                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                                        : modalState.type === 'error'
                                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                                        : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(0,163,255,0.3)]'
                                }`}
                            >
                                Continue
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </ModalContext.Provider>
    );
};

export const useModal = () => useContext(ModalContext);
