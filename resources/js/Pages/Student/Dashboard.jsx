import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Award, BookOpen, Clock, Flame, PlayCircle, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export default function StudentDashboard({ enrollments, campaigns, exploreCourses, upcomingCbts, cbtResults, stats }) {
    const enrollForm = useForm({});

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-serif font-semibold text-white leading-tight flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-[#F4A623]" />
                    Student Workspace Dashboard
                </h2>
            }
        >
            <Head title="Student Dashboard" />

            <div className="py-12 bg-[#0D1B2A] min-h-screen text-white">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Welcome Streak & Points Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-b from-[#1A3C5E]/20 to-[#0D1B2A] border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-md flex items-center space-x-4 hover:border-white/10 transition">
                            <div className="p-3 bg-[#F4A623]/10 text-[#F4A623] rounded-xl">
                                <Flame className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-400">Daily Streak</p>
                                <p className="text-2xl font-bold text-white mt-0.5">{stats.streak_days} Days</p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-b from-[#1A3C5E]/20 to-[#0D1B2A] border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-md flex items-center space-x-4 hover:border-white/10 transition">
                            <div className="p-3 bg-[#2ECC8C]/10 text-[#2ECC8C] rounded-xl">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-400">Total Points</p>
                                <p className="text-2xl font-bold text-white mt-0.5">{stats.points} XP</p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-b from-[#1A3C5E]/20 to-[#0D1B2A] border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-md flex items-center space-x-4 hover:border-white/10 transition">
                            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                                <BookOpen className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-400">Enrolled Subjects</p>
                                <p className="text-2xl font-bold text-white mt-0.5">{stats.enrolled_courses}</p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-b from-[#1A3C5E]/20 to-[#0D1B2A] border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-md flex items-center space-x-4 hover:border-white/10 transition">
                            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-400">Completed Courses</p>
                                <p className="text-2xl font-bold text-white mt-0.5">{stats.completed_courses}</p>
                            </div>
                        </div>
                    </div>

                    {/* Promoted Campaigns Banner Slider (The Dynamic Ad Engine) */}
                    {campaigns && campaigns.length > 0 && (
                        <div className="bg-gradient-to-r from-[#1A3C5E]/50 to-[#F4A623]/10 border border-[#F4A623]/20 rounded-2xl p-6 relative overflow-hidden shadow-lg">
                            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_right,rgba(244,166,35,0.15)_0%,transparent_70%)] pointer-events-none" />
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                                <div className="space-y-2">
                                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F4A623]/10 text-[#F4A623] text-xs font-semibold">
                                        <Sparkles className="h-3.5 w-3.5" />
                                        <span>PROMOTED CAMPAIGN</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white leading-tight">{campaigns[0].title}</h3>
                                    <p className="text-xs text-gray-300">Enrollment is now live! Secure your learning spot and boost your test score with professional tutors.</p>
                                </div>
                                <a
                                    href={campaigns[0].link || '#'}
                                    className="px-6 py-3 bg-gradient-to-r from-[#F4A623] to-[#FFB74D] hover:from-[#F4A623]/95 hover:to-[#FFB74D]/95 text-[#07111f] font-black rounded-xl text-xs uppercase tracking-wider transition duration-200 shadow-md shadow-[#F4A623]/15 shrink-0"
                                >
                                    Claim Offer Now
                                </a>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Enrolled Courses & Progress */}
                        <div className="lg:col-span-2 space-y-6">
                            <h3 className="text-2xl font-serif font-semibold text-white">My Active Enrollments</h3>
                            
                            {enrollments.length === 0 ? (
                                <div className="bg-[#1A3C5E]/10 border border-white/5 rounded-2xl p-8 text-center text-gray-400 space-y-4">
                                    <AlertCircle className="w-8 h-8 text-gray-500 mx-auto" />
                                    <p className="text-sm">You are not currently enrolled in any courses.</p>
                                    <p className="text-xs font-light max-w-sm mx-auto">Choose from the available science catalogs below to self-enroll and start earning XP points!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {enrollments.map((enr) => (
                                        <div key={enr.id} className="bg-[#1A3C5E]/15 border border-white/5 rounded-2xl p-6 space-y-4 hover:border-white/10 hover:shadow-lg transition duration-300 flex flex-col justify-between">
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-start">
                                                    <span className="px-2.5 py-1 rounded-lg bg-[#1A3C5E] text-[10px] font-bold text-white uppercase tracking-wider">
                                                        {enr.course.subject.name}
                                                    </span>
                                                    <span className="text-xs text-[#F4A623] font-black">
                                                        {enr.course.type}
                                                    </span>
                                                </div>

                                                <h4 className="font-bold text-base text-white leading-snug">{enr.course.title}</h4>
                                                
                                                {/* Progress Bar */}
                                                <div className="space-y-2 pt-2">
                                                    <div className="flex justify-between text-xs text-gray-400">
                                                        <span>Learning Progress</span>
                                                        <span>{enr.progress_percent}%</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-gradient-to-r from-[#2ECC8C] to-emerald-400 rounded-full transition-all duration-300"
                                                            style={{ width: `${enr.progress_percent}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                                                <span className="text-xs text-gray-400 flex items-center font-light">
                                                    <Clock className="w-3.5 h-3.5 mr-1" />
                                                    Self-study mode
                                                </span>
                                                <button className="px-4 py-2 bg-gradient-to-r from-[#2ECC8C] to-emerald-500 hover:from-[#2ECC8C]/95 hover:to-emerald-500/95 text-[#07111f] font-bold rounded-xl text-xs transition duration-200 shadow-sm">
                                                    Start Study
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Explore and Discover New Courses */}
                            <div className="space-y-6 pt-6">
                                <h3 className="text-2xl font-serif font-semibold text-white">Explore Available Courses</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {exploreCourses.map((course) => (
                                        <div key={course.id} className="bg-gradient-to-b from-[#1A3C5E]/5 to-[#0D1B2A] border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-white/10 transition">
                                            <div>
                                                <div className="flex justify-between items-start mb-4">
                                                    <span className="px-2 py-0.5 rounded bg-[#2ECC8C]/15 text-[#2ECC8C] text-xs font-semibold">
                                                        {course.subject.name}
                                                    </span>
                                                    <span className="text-[#F4A623] font-bold text-sm">
                                                        &#8358;{parseFloat(course.price).toLocaleString()}
                                                    </span>
                                                </div>
                                                <h4 className="font-bold text-base text-white mb-2 leading-snug">{course.title}</h4>
                                                <p className="text-xs text-gray-400 line-clamp-2 mb-4 font-light leading-relaxed">{course.description}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if (confirm(`Are you sure you want to self-enroll in ${course.title}?`)) {
                                                        enrollForm.post(route('student.course.enroll', course.id));
                                                    }
                                                }}
                                                disabled={enrollForm.processing}
                                                className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-[#F4A623]/25 hover:border-[#F4A623]/35 rounded-xl text-xs font-bold text-white transition disabled:opacity-40 w-full mt-4"
                                            >
                                                Self Enroll
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* CBT preparation module and historical grades */}
                        <div className="space-y-8">
                            {/* Dynamic Timed CBT Mocks */}
                            <div className="space-y-4">
                                <h3 className="text-2xl font-serif font-semibold text-white">CBT Exam Prep</h3>
                                {upcomingCbts.length === 0 ? (
                                    <div className="bg-[#1A3C5E]/10 border border-white/5 rounded-2xl p-6 text-center text-gray-400 text-xs">
                                        No active mock exams are currently scheduled.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {upcomingCbts.map((cbt) => (
                                            <div key={cbt.id} className="bg-[#1A3C5E]/15 border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-white/10 transition">
                                                <div className="space-y-1">
                                                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#F4A623]">{cbt.course.type} prep</span>
                                                    <h4 className="font-bold text-sm text-white">{cbt.title}</h4>
                                                    <p className="text-xs text-gray-400">{cbt.duration_minutes} Mins | {cbt.total_marks} Marks</p>
                                                </div>
                                                <Link
                                                    href={route('cbt.take', cbt.id)}
                                                    className="px-4 py-2 bg-[#F4A623] hover:bg-[#F4A623]/95 text-black font-bold rounded-xl text-xs transition duration-200 shadow-sm shrink-0"
                                                >
                                                    Start CBT
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Historical CBT grades & results logs */}
                            <div className="space-y-4">
                                <h3 className="text-2xl font-serif font-semibold text-white">CBT Performance Log</h3>
                                {cbtResults.length === 0 ? (
                                    <div className="bg-[#1A3C5E]/10 border border-white/5 rounded-2xl p-6 text-center text-gray-400 text-xs">
                                        Your submitted mock exam results will show here.
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                        {cbtResults.map((res) => (
                                            <div key={res.id} className="bg-[#1A3C5E]/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:border-white/10 transition">
                                                <div>
                                                    <h5 className="font-bold text-xs text-white leading-tight">{res.cbt_exam.title}</h5>
                                                    <p className="text-[10px] text-gray-400 mt-1">
                                                        Duration: {(res.time_spent_seconds / 60).toFixed(1)} mins
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <div className="text-right">
                                                        <span className={`text-base font-bold ${res.score >= 50 ? 'text-[#2ECC8C]' : 'text-rose-400'}`}>
                                                            {res.score}%
                                                        </span>
                                                        <p className="text-[9px] text-gray-500 uppercase mt-0.5">Score</p>
                                                    </div>
                                                    <a 
                                                        href={route('cbt.result.pdf', res.id)} 
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-2.5 py-1.5 bg-[#F4A623]/10 border border-[#F4A623]/20 hover:bg-[#F4A623]/25 hover:border-[#F4A623]/35 rounded-lg text-[10px] font-bold text-[#F4A623] transition flex items-center justify-center"
                                                        title="Download Certificate"
                                                    >
                                                        PDF
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
