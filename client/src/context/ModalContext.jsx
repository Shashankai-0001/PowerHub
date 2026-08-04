import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modalState, setModalState] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info', // 'success' | 'error' | 'info'
        onConfirm: null
    });

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

    // Override native window.alert to automatically use our themed center modal
    useEffect(() => {
        const originalAlert = window.alert;

        window.alert = (msg) => {
            const strMsg = String(msg || '');
            let type = 'info';
            let title = 'Notification';

            if (strMsg.toLowerCase().includes('success') || strMsg.toLowerCase().includes('saved') || strMsg.includes('✅') || strMsg.toLowerCase().includes('added')) {
                type = 'success';
                title = 'Success';
            } else if (strMsg.toLowerCase().includes('error') || strMsg.toLowerCase().includes('failed') || strMsg.toLowerCase().includes('invalid') || strMsg.toLowerCase().includes('not match')) {
                type = 'error';
                title = 'Notice';
            }

            showModal({
                title,
                message: strMsg.replace(/^✅\s*/, ''),
                type
            });
        };

        return () => {
            window.alert = originalAlert;
        };
    }, []);

    return (
        <ModalContext.Provider value={{ showModal, closeModal }}>
            {children}
            <AnimatePresence>
                {modalState.isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                            className="bg-card/95 backdrop-blur-2xl border border-border shadow-[0_25px_70px_rgba(0,0,0,0.7)] rounded-[2.5rem] p-8 max-w-md w-full text-center relative overflow-hidden"
                        >
                            {/* Decorative ambient background glow */}
                            <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none ${
                                modalState.type === 'success' ? 'bg-emerald-500' : modalState.type === 'error' ? 'bg-rose-500' : 'bg-primary'
                            }`} />

                            {/* Close icon button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-5 right-5 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Icon Container */}
                            <div className="flex justify-center mb-6 pt-2">
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center border shadow-lg ${
                                    modalState.type === 'success'
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
                                        : modalState.type === 'error'
                                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.2)]'
                                        : 'bg-primary/10 border-primary/30 text-primary shadow-[0_0_25px_rgba(0,163,255,0.2)]'
                                }`}>
                                    {modalState.type === 'success' && <CheckCircle2 className="w-10 h-10" />}
                                    {modalState.type === 'error' && <AlertTriangle className="w-10 h-10" />}
                                    {modalState.type === 'info' && <Info className="w-10 h-10" />}
                                </div>
                            </div>

                            {/* Content */}
                            <h3 className="text-2xl font-black text-foreground tracking-tight mb-3">
                                {modalState.title}
                            </h3>
                            <p className="text-muted-foreground font-medium leading-relaxed mb-8 whitespace-pre-line text-sm md:text-base">
                                {modalState.message}
                            </p>

                            {/* Action Button */}
                            <button
                                onClick={closeModal}
                                className={`w-full py-4 font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-xl ${
                                    modalState.type === 'success'
                                        ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                                        : modalState.type === 'error'
                                        ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                                        : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(0,163,255,0.3)]'
                                }`}
                            >
                                Got it
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </ModalContext.Provider>
    );
};

export const useModal = () => useContext(ModalContext);
