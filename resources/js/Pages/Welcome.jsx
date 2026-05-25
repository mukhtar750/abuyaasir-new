import React, { useState, useEffect } from 'react';
import { Link, Head } from '@inertiajs/react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { BookOpen, Award, Sparkles, Compass, CheckCircle, Flame, Sun, ChevronRight, PlayCircle, Users, BarChart } from 'lucide-react';

export default function Welcome({ auth, campaigns }) {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const staggerContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariant = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="min-h-screen bg-[#070b14] text-white font-sans selection:bg-[#F4A623] selection:text-black overflow-x-hidden">
            <Head title="Premium LMS for Math, Physics, Chemistry, JAMB & WAEC - MyTutorPlus" />

            {/* Dynamic Ad Banner */}
            <AnimatePresence>
                {campaigns && campaigns.length > 0 && campaigns[0].is_active && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-gradient-to-r from-[#F4A623] to-[#FFB74D] text-[#070b14] relative z-50 overflow-hidden"
                    >
                        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-center sm:justify-between text-sm font-bold">
                            <div className="flex items-center space-x-2">
                                <Sparkles className="w-4 h-4 animate-pulse" />
                                <span>{campaigns[0].title}</span>
                            </div>
                            <a href={campaigns[0].link || '#'} className="mt-2 sm:mt-0 flex items-center hover:underline uppercase tracking-wider text-xs bg-black/10 px-3 py-1 rounded-full backdrop-blur-sm transition-all hover:bg-black/20">
                                Claim Offer <ChevronRight className="w-3 h-3 ml-1" />
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Premium Header */}
            <header className={`fixed w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-[#070b14]/80 backdrop-blur-xl border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center space-x-3"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F4A623] to-amber-500 flex items-center justify-center font-black text-lg text-[#07111f] shadow-[0_0_20px_rgba(244,166,35,0.4)]">
                            M+
                        </div>
                        <span className="font-black text-2xl tracking-tighter text-white drop-shadow-md">
                            MyTutor<span className="text-[#F4A623]">Plus</span>
                        </span>
                    </motion.div>

                    <motion.nav 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center space-x-6"
                    >
                        {auth.user ? (
                            <Link href={route('dashboard')} className="group relative px-6 py-2.5 font-bold text-white rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all overflow-hidden">
                                <span className="relative z-10 flex items-center">
                                    Enter Portal <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#2ECC8C]/20 to-[#1A3C5E]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="text-sm font-semibold text-gray-300 hover:text-white transition duration-200 hidden sm:block">
                                    Log In
                                </Link>
                                <Link href={route('register')} className="group relative px-6 py-2.5 font-bold text-[#070b14] rounded-full overflow-hidden shadow-[0_0_30px_rgba(244,166,35,0.3)] hover:shadow-[0_0_40px_rgba(244,166,35,0.5)] transition-all">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#F4A623] to-amber-300 group-hover:scale-105 transition-transform duration-300" />
                                    <span className="relative z-10">Get Started</span>
                                </Link>
                            </>
                        )}
                    </motion.nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-screen flex items-center">
                <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop" 
                        alt="Abstract Tech Background" 
                        className="w-full h-full object-cover opacity-[0.25] mix-blend-screen"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#070b14]/50 via-[#070b14]/80 to-[#070b14]" />
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#1A3C5E]/30 rounded-full blur-[120px]" />
                    <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#2ECC8C]/20 rounded-full blur-[100px]" />
                </motion.div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-8 max-w-5xl mx-auto flex flex-col items-center"
                    >
                        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
                            <span className="flex h-2 w-2 rounded-full bg-[#2ECC8C] animate-pulse"></span>
                            <span className="text-xs font-bold uppercase tracking-widest text-[#2ECC8C]">#1 Premium Science Platform</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[1.05]">
                            Master Science. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4A623] via-amber-200 to-[#F4A623] animate-gradient-x relative inline-block">
                                Conquer JAMB.
                                <motion.div 
                                    className="absolute -inset-4 bg-[#F4A623]/20 blur-3xl rounded-full -z-10"
                                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                />
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl font-light leading-relaxed">
                            A world-class Learning Management System delivering top-tier interactive prep in Mathematics, Physics, and Chemistry. 
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 pt-8 w-full sm:w-auto">
                            <Link href={route('register')} className="group relative px-10 py-5 font-bold text-[#070b14] rounded-full overflow-hidden shadow-[0_0_40px_rgba(244,166,35,0.4)]">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#F4A623] to-[#FFB74D] group-hover:scale-105 transition-transform duration-500" />
                                <span className="relative z-10 flex items-center justify-center text-xl">
                                    Start Learning Now <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Bento Grid Features */}
            <section id="bento" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[300px]"
                >
                    {/* Big Stats Box */}
                    <motion.div variants={itemVariant} className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 bg-gradient-to-br from-[#1A3C5E]/40 to-[#070b14] border border-white/10 rounded-3xl p-10 relative overflow-hidden group hover:border-[#1A3C5E]/60 transition-colors">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#1A3C5E]/20 blur-3xl rounded-full group-hover:bg-[#1A3C5E]/40 transition-colors" />
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md mb-4 border border-white/5">
                                <Users className="w-7 h-7 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-5xl font-black text-white mb-2">10,000+</h3>
                                <p className="text-gray-400 font-medium text-xl">Active Students Trust MyTutorPlus</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Feature 1 */}
                    <motion.div variants={itemVariant} className="col-span-1 lg:col-span-1 row-span-1 bg-white/5 border border-white/10 rounded-3xl p-10 hover:bg-white/10 transition-colors flex flex-col justify-between group">
                        <div className="w-14 h-14 bg-[#F4A623]/10 text-[#F4A623] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Flame className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">Gamified XP</h3>
                            <p className="text-base text-gray-400">Earn points and maintain daily learning streaks.</p>
                        </div>
                    </motion.div>

                    {/* Feature 2 */}
                    <motion.div variants={itemVariant} className="col-span-1 lg:col-span-1 row-span-1 bg-gradient-to-b from-[#2ECC8C]/20 to-transparent border border-[#2ECC8C]/20 rounded-3xl p-10 hover:border-[#2ECC8C]/40 transition-colors flex flex-col justify-between group relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(46,204,140,0.1)_0%,transparent_60%)]" />
                        <div className="w-14 h-14 bg-[#2ECC8C]/20 text-[#2ECC8C] rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                            <Award className="w-7 h-7" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-white mb-2">Real CBT Engine</h3>
                            <p className="text-base text-gray-400">Lockdown browser style interface mimicking exact JAMB layouts.</p>
                        </div>
                    </motion.div>

                    {/* Feature 3 (Wide) */}
                    <motion.div variants={itemVariant} className="col-span-1 md:col-span-3 lg:col-span-4 row-span-1 bg-gradient-to-r from-purple-900/30 via-[#070b14] to-blue-900/30 border border-white/10 rounded-3xl p-10 flex flex-col md:flex-row items-center gap-10 group overflow-hidden relative">
                        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                        <div className="flex-1 relative z-10 space-y-4">
                            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-sm font-bold border border-purple-500/30">
                                <Sun className="w-4 h-4" /> <span>Summer Bootcamp</span>
                            </div>
                            <h3 className="text-4xl font-black text-white">Accelerated Live Classes</h3>
                            <p className="text-gray-400 max-w-2xl text-xl">Get ahead before the school term starts with intensive live sessions hosted by certified WAEC examiners.</p>
                        </div>
                        <div className="w-full md:w-1/3 relative z-10 flex justify-center md:justify-end">
                            <div className="relative">
                                <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full" />
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:scale-110 transition-transform cursor-pointer border-4 border-[#070b14]">
                                    <PlayCircle className="w-14 h-14 text-white ml-1" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* High-end Premium CTA */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-32 border-t border-white/10 text-center">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-[3rem] p-16 md:p-32 relative overflow-hidden backdrop-blur-md shadow-2xl"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,166,35,0.15)_0%,transparent_60%)] pointer-events-none" />
                    <div className="relative z-10 max-w-3xl mx-auto space-y-10">
                        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">Start Your Path To An A1 Today</h2>
                        <p className="text-gray-400 text-xl md:text-2xl font-light">Join thousands of students clearing their exams and securing university admissions on their first try.</p>
                        <div className="pt-8">
                            <Link href={route('register')} className="group relative inline-flex px-14 py-6 font-bold text-[#070b14] rounded-full overflow-hidden shadow-[0_0_50px_rgba(244,166,35,0.3)]">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#F4A623] to-amber-300 group-hover:scale-105 transition-transform duration-500" />
                                <span className="relative z-10 text-2xl">Get Instant LMS Access</span>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>
            
            {/* Minimal Footer */}
            <footer className="border-t border-white/10 py-12 text-center text-gray-500 text-base font-medium">
                <p>&copy; {new Date().getFullYear()} MyTutorPlus LMS. All rights reserved.</p>
            </footer>
        </div>
    );
}
