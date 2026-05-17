import React from 'react';
import { Link, Head } from '@inertiajs/react';
import { BookOpen, Award, Sparkles, Compass, CheckCircle, Flame, Sun } from 'lucide-react';

export default function Welcome({ auth, campaigns }) {
    return (
        <div className="min-h-screen bg-[#0D1B2A] text-white font-sans selection:bg-[#F4A623] selection:text-black">
            <Head title="Premium LMS for Math, Physics, Chemistry, JAMB & WAEC - MyTutorPlus" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(26,60,94,0.4)_0%,transparent_60%)] pointer-events-none" />

            {/* Premium Header */}
            <header className="relative z-10 border-b border-white/5 backdrop-blur-md bg-[#0D1B2A]/70 sticky top-0">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-lg bg-[#F4A623] flex items-center justify-center font-black text-lg text-[#07111f]">
                            M+
                        </div>
                        <span className="font-black text-xl tracking-wide text-white">
                            MyTutorPlus
                        </span>
                    </div>

                    <nav className="flex items-center space-x-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="btn-primary"
                            >
                                Enter Portal
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="px-5 py-2.5 text-gray-300 hover:text-white transition duration-200"
                                >
                                    Log In
                                </Link>
                            <Link href={route('register')} className="btn-secondary">
                                Get Started
                            </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            {/* Dynamic Seasonal Ad/Campaign Banners (The Promoted Campaigns / Ad Engine) */}
            {campaigns && campaigns.length > 0 && (
                <div className="relative z-10 max-w-7xl mx-auto px-6 mt-6">
                    <div className="surface rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-[#F4A623]/20 rounded-lg text-[#F4A623]">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-xs uppercase tracking-widest font-semibold text-[#F4A623]">Promoted Campaign</span>
                                <h3 className="text-xl font-bold text-white mt-1">{campaigns[0].title}</h3>
                                <p className="text-sm text-gray-300 mt-1">Enrollment is now live! Secure your learning spot today.</p>
                            </div>
                        </div>
                        <a
                            href={campaigns[0].link || '#explore'}
                            className="btn-primary w-full md:w-auto"
                        >
                            Claim Offer Now
                        </a>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#1A3C5E]/30 border border-white/10 text-sm text-[#2ECC8C]">
                        <Award className="w-4 h-4" />
                        <span>#1 Rated Mathematics & Science LMS</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                        Master Science. <br />
                        Conquer <span className="bg-gradient-to-r from-[#F4A623] to-amber-300 bg-clip-text text-transparent">JAMB & WAEC</span>.
                    </h1>

                    <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl">
                        A world-class Learning Management System delivering top-tier interactive prep in Mathematics, Physics, and Chemistry. Prepare, practice, and ace your exams with premium CBT mock tests.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link
                            href={route('register')}
                        className="btn-primary px-8 py-4 text-center text-base"
                        >
                            Create Student Account
                        </Link>
                        <a
                            href="#explore"
                            className="btn-secondary px-8 py-4 text-center text-base"
                        >
                            Explore Subjects
                        </a>
                    </div>
                </div>

                {/* Premium Glassmorphic Feature Card Grid */}
                <div className="grid grid-cols-2 gap-6 relative">
                    <div className="absolute inset-0 bg-[#2ECC8C]/10 blur-3xl rounded-full -z-10" />
                    
                    <div className="surface rounded-lg p-6">
                        <div className="w-12 h-12 rounded-lg bg-[#F4A623]/10 text-[#F4A623] flex items-center justify-center font-bold text-lg mb-4">
                            CBT
                        </div>
                        <h3 className="font-bold text-lg text-white mb-2">Real CBT Engine</h3>
                        <p className="text-xs text-gray-400">Lockdown browser style interface mimicking the exact JAMB mock layout.</p>
                    </div>

                    <div className="surface rounded-lg p-6 mt-8">
                        <div className="w-12 h-12 rounded-lg bg-[#2ECC8C]/10 text-[#2ECC8C] flex items-center justify-center font-bold text-lg mb-4">
                            3
                        </div>
                        <h3 className="font-bold text-lg text-white mb-2">Core Sciences</h3>
                        <p className="text-xs text-gray-400">Deep-dive curriculum built solely around Mathematics, Physics, and Chemistry.</p>
                    </div>

                    <div className="surface rounded-lg p-6 -mt-4">
                        <div className="w-12 h-12 rounded-lg bg-[#1A3C5E]/30 text-white flex items-center justify-center font-bold text-lg mb-4">
                            <Flame className="h-6 w-6 text-[#F4A623]" />
                        </div>
                        <h3 className="font-bold text-lg text-white mb-2">Daily Streaks</h3>
                        <p className="text-xs text-gray-400">Gamified learning paths. Complete lessons and gain points on the leaderboard.</p>
                    </div>

                    <div className="surface rounded-lg p-6 mt-4">
                        <div className="w-12 h-12 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-lg mb-4">
                            <Sun className="h-6 w-6 text-purple-300" />
                        </div>
                        <h3 className="font-bold text-lg text-white mb-2">Summer Classes</h3>
                        <p className="text-xs text-gray-400">Accelerated holiday bootcamps to get ahead before the school term starts.</p>
                    </div>
                </div>
            </section>

            {/* Core Subjects Section */}
            <section id="explore" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-black text-white">Our Specialized Subject Scope</h2>
                    <p className="text-gray-400 text-sm">We focus deep on the foundational sciences to ensure our students excel in JAMB, WAEC, and higher education entry tests.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: 'Mathematics', desc: 'From Algebra to Calculus. Master standard and complex formulas to clear your exams with ease.', icon: BookOpen, color: '#F4A623' },
                        { title: 'Physics', desc: 'Conquer Mechanics, Electromagnetism, and Optics with interactive concept breakdowns and simulations.', icon: Compass, color: '#2ECC8C' },
                        { title: 'Chemistry', desc: 'Demystify Organic structures, Stoichiometry, and Periodic trends through curated high-quality classes.', icon: Sparkles, color: '#a855f7' },
                    ].map((subject, idx) => {
                        const Icon = subject.icon;
                        return (
                            <div key={idx} className="surface rounded-lg p-8 transition duration-300 hover:border-white/20 flex flex-col justify-between">
                                <div>
                                    <div className="p-3 w-fit rounded-lg mb-6" style={{ backgroundColor: `${subject.color}15`, color: subject.color }}>
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-3">{subject.title}</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed mb-6">{subject.desc}</p>
                                </div>
                                <div className="space-y-3 pt-6 border-t border-white/5">
                                    <div className="flex items-center text-xs text-gray-300">
                                        <CheckCircle className="w-4 h-4 mr-2 text-[#2ECC8C]" />
                                        <span>Full JAMB & WAEC syllabus</span>
                                    </div>
                                    <div className="flex items-center text-xs text-gray-300">
                                        <CheckCircle className="w-4 h-4 mr-2 text-[#2ECC8C]" />
                                        <span>Timed Mock CBT Exams included</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* High-end Premium CTA */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/5 text-center">
                <div className="surface rounded-lg p-12 md:p-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,166,35,0.1)_0%,transparent_70%)] pointer-events-none" />
                    <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-white">Start Your Path To An A1 Today</h2>
                        <p className="text-gray-300 text-base md:text-lg">Join thousands of students clearing their exams and securing admissions on their first try.</p>
                        <div className="pt-6">
                            <Link
                                href={route('register')}
                                className="btn-primary inline-flex px-10 py-5 text-base"
                            >
                                Get Instant LMS Access
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
