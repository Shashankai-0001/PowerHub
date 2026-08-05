import { useState } from 'react';
import { Phone, Mail, Check, Copy, ExternalLink, ShieldCheck, MessageCircle, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ContactSection = () => {
    const [copiedField, setCopiedField] = useState(null);
    const [activeModal, setActiveModal] = useState(null); // 'phone' | 'email' | null

    const phone = '8948475676';
    const formattedPhone = '+91 8948475676';
    const email = 'shashankdubey5676@gmail.com';

    const handleCopy = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2500);
    };

    const handlePhoneClick = (e) => {
        // Allow native link proceed while also opening modal
        setActiveModal('phone');
    };

    const handleEmailClick = (e) => {
        setActiveModal('email');
    };

    return (
        <section className="py-20 px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-xs font-black tracking-widest text-primary uppercase bg-primary/10 rounded-full border border-primary/20 shadow-sm">
                        <ShieldCheck className="w-4 h-4 text-primary" /> Verified Support & Leadership
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                        Executive <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-sky-400 to-indigo-500">Contact</span>
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground mt-3 max-w-xl mx-auto font-medium">
                        Direct connection to our founder for technical support, platform inquiries, and partnership opportunities.
                    </p>
                </div>

                {/* Executive Card */}
                <div className="relative bg-card/90 backdrop-blur-2xl border border-border/80 rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-300 hover:border-primary/40">
                    {/* Background glow effects */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                        {/* Profile Info */}
                        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left border-b lg:border-b-0 lg:border-r border-border/80 pb-8 lg:pb-0 lg:pr-8">
                            <div className="relative mb-6">
                                <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-primary via-sky-400 to-indigo-500 p-1 shadow-2xl overflow-hidden group">
                                    <img 
                                        src="/shashank-dubey.jpg" 
                                        alt="Shashank Dubey" 
                                        className="w-full h-full object-cover rounded-[1.3rem] group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-1.5 rounded-full shadow-lg border-2 border-card">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                            </div>

                            <h3 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
                                Shashank Dubey
                            </h3>
                            <p className="text-xs font-black text-primary tracking-widest uppercase mt-1 bg-primary/10 px-3 py-1 rounded-md border border-primary/20">
                                Founder & Lead Engineer
                            </p>
                            <p className="text-xs leading-relaxed text-muted-foreground mt-4 font-medium">
                                Architect of PowerHub platform. Available 24/7 for support, custom integrations, and developer feedback.
                            </p>
                        </div>

                        {/* Interactive Contact Actions */}
                        <div className="lg:col-span-7 space-y-4">
                            {/* Phone Interactive Box */}
                            <div className="group relative bg-background border border-border/80 hover:border-primary/60 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <a 
                                        href={`tel:${phone}`} 
                                        onClick={handlePhoneClick}
                                        className="flex items-center gap-4 flex-1"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shrink-0 shadow-md">
                                            <Phone className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground block">
                                                Direct Phone / Mobile
                                            </span>
                                            <span className="text-lg md:text-xl font-black text-foreground group-hover:text-primary transition-colors tracking-wide">
                                                {formattedPhone}
                                            </span>
                                        </div>
                                    </a>

                                    <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-border/60">
                                        <a
                                            href={`tel:${phone}`}
                                            className="px-4 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-md"
                                        >
                                            Call <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                        <button
                                            onClick={() => handleCopy(phone, 'phone')}
                                            className="p-2.5 border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground rounded-xl transition-all"
                                            title="Copy Phone Number"
                                        >
                                            {copiedField === 'phone' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Email Interactive Box */}
                            <div className="group relative bg-background border border-border/80 hover:border-primary/60 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <a 
                                        href={`mailto:${email}`}
                                        onClick={handleEmailClick}
                                        className="flex items-center gap-4 flex-1 min-w-0"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 shrink-0 shadow-md">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground block">
                                                Official Email Address
                                            </span>
                                            <span className="text-sm sm:text-base md:text-lg font-black text-foreground group-hover:text-indigo-500 transition-colors tracking-tight block truncate">
                                                {email}
                                            </span>
                                        </div>
                                    </a>

                                    <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-border/60">
                                        <a
                                            href={`mailto:${email}`}
                                            className="px-4 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-md"
                                        >
                                            Email <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                        <button
                                            onClick={() => handleCopy(email, 'email')}
                                            className="p-2.5 border border-border hover:border-indigo-500/50 text-muted-foreground hover:text-foreground rounded-xl transition-all"
                                            title="Copy Email Address"
                                        >
                                            {copiedField === 'email' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copied Feedback Toast */}
                <AnimatePresence>
                    {copiedField && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mt-4 text-center"
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 font-bold text-xs rounded-xl shadow-lg">
                                <Check className="w-4 h-4" /> Copied {copiedField === 'phone' ? 'Phone Number' : 'Email Address'} to clipboard!
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Interactive Action Modal */}
            <AnimatePresence>
                {activeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActiveModal(null)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 15 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-card/95 backdrop-blur-2xl border border-border/90 rounded-[2.5rem] p-8 max-w-md w-full shadow-[0_25px_70px_rgba(0,0,0,0.6)] relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl p-0.5 bg-gradient-to-tr from-primary to-indigo-500 shadow-md shrink-0 overflow-hidden">
                                        <img src="/shashank-dubey.jpg" alt="Shashank Dubey" className="w-full h-full object-cover rounded-[0.9rem]" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-foreground tracking-tight">
                                            {activeModal === 'phone' ? 'Connect via Phone' : 'Connect via Email'}
                                        </h4>
                                        <p className="text-xs text-muted-foreground font-medium">Shashank Dubey (Lead Engineer)</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setActiveModal(null)}
                                    className="p-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                    title="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-sm text-muted-foreground mb-6 font-medium">
                                Choose how you would like to proceed:
                            </p>

                            <div className="space-y-3">
                                {activeModal === 'phone' ? (
                                    <>
                                        <a
                                            href={`tel:${phone}`}
                                            className="w-full py-4 px-6 bg-primary text-primary-foreground font-bold text-sm rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:bg-primary/90 transition-all"
                                        >
                                            <Phone className="w-5 h-5" /> Call Directly ({formattedPhone})
                                        </a>
                                        <a
                                            href={`https://wa.me/91${phone}?text=Hi%20Shashank,%20I'm%20contacting%20you%20from%20PowerHub.`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-4 px-6 bg-emerald-600 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:bg-emerald-700 transition-all"
                                        >
                                            <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
                                        </a>
                                        <button
                                            onClick={() => {
                                                handleCopy(phone, 'phone');
                                                setActiveModal(null);
                                            }}
                                            className="w-full py-3.5 px-6 border border-border text-foreground font-bold text-sm rounded-2xl flex items-center justify-center gap-2 hover:bg-muted transition-all"
                                        >
                                            <Copy className="w-4 h-4" /> Copy Number
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <a
                                            href={`mailto:${email}`}
                                            className="w-full py-4 px-6 bg-indigo-600 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:bg-indigo-700 transition-all"
                                        >
                                            <Mail className="w-5 h-5" /> Open Email Application
                                        </a>
                                        <button
                                            onClick={() => {
                                                handleCopy(email, 'email');
                                                setActiveModal(null);
                                            }}
                                            className="w-full py-3.5 px-6 border border-border text-foreground font-bold text-sm rounded-2xl flex items-center justify-center gap-2 hover:bg-muted transition-all"
                                        >
                                            <Copy className="w-4 h-4" /> Copy Email Address
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};
