import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Award, BookOpen, Clock, Flame, PlayCircle, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export default function StudentDashboard({ enrollments, campaigns, exploreCourses, upcomingCbts, cbtResults, stats, flash, transactions, upcomingClasses = [] }) {
    const enrollForm = useForm({});
    const [selectedCourse, setSelectedCourse] = React.useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        course_id: '',
        amount: '',
        receipt: null,
    });

    const submitReceipt = (e) => {
        e.preventDefault();
        post(route('payment.upload-receipt'), {
            onSuccess: () => {
                setSelectedCourse(null);
                reset();
            },
        });
    };

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

                    {/* Timeline Widget: Next Upcoming Class */}
                    {upcomingClasses.length > 0 && (
                        <div className="bg-gradient-to-r from-blue-500/20 to-[#1A3C5E]/40 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden shadow-lg animate-pulse">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                                <div className="space-y-2">
                                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                                        <PlayCircle className="h-3.5 w-3.5" />
                                        <span>Next Live Session</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white leading-tight">{upcomingClasses[0].topic}</h3>
                                    <p className="text-sm text-gray-300">
                                        {new Date(upcomingClasses[0].scheduled_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                        {upcomingClasses[0].tutor && ` with ${upcomingClasses[0].tutor.name}`}
                                    </p>
                                </div>
                                <a
                                    href={upcomingClasses[0].meeting_link ? route('sessions.join', upcomingClasses[0].id) : '#'}
                                    onClick={(e) => {
                                        if (!upcomingClasses[0].meeting_link) {
                                            e.preventDefault();
                                            alert("Meeting link is not available yet.");
                                        }
                                    }}
                                    target={upcomingClasses[0].meeting_link ? "_blank" : undefined}
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 text-white font-black rounded-xl text-xs uppercase tracking-wider transition duration-200 shadow-md shrink-0"
                                >
                                    Join Class Now
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
                                                    setSelectedCourse(course);
                                                    setData('course_id', course.id);
                                                    setData('amount', course.price);
                                                }}
                                                className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-[#F4A623]/25 hover:border-[#F4A623]/35 rounded-xl text-xs font-bold text-white transition disabled:opacity-40 w-full mt-4"
                                            >
                                                Pay & Enroll
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Payment Modal */}
                        {selectedCourse && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-[#0D1B2A] border border-white/10 p-8 rounded-3xl max-w-md w-full space-y-6"
                                >
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-bold">Upload Payment Receipt</h3>
                                        <button onClick={() => setSelectedCourse(null)} className="text-gray-500 hover:text-white">&times;</button>
                                    </div>
                                    
                                    <div className="bg-[#1A3C5E]/20 p-4 rounded-xl border border-[#F4A623]/20">
                                        <p className="text-sm text-gray-300">To enroll in <span className="text-[#F4A623] font-bold">{selectedCourse.title}</span>, please pay <span className="text-[#2ECC8C] font-bold">&#8358;{parseFloat(selectedCourse.price).toLocaleString()}</span> to the bank details provided below and upload your receipt.</p>
                                    </div>

                                    <form onSubmit={submitReceipt} className="space-y-4">
                                        <div>
                                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Receipt (Image/PDF)</label>
                                            <input 
                                                type="file" 
                                                onChange={e => setData('receipt', e.target.files[0])}
                                                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#1A3C5E] file:text-white hover:file:bg-[#1A3C5E]/80"
                                                required
                                            />
                                            {errors.receipt && <p className="text-red-500 text-xs mt-1">{errors.receipt}</p>}
                                        </div>

                                        <button 
                                            type="submit"
                                            disabled={processing}
                                            className="w-full py-3 bg-[#F4A623] text-black font-black rounded-xl text-xs uppercase tracking-wider hover:bg-[#F4A623]/90 transition"
                                        >
                                            {processing ? 'Uploading...' : 'Submit Receipt for Verification'}
                                        </button>
                                    </form>
                                </motion.div>
                            </div>
                        )}

                        {/* CBT preparation module and historical grades */}
                        <div className="space-y-8">
                            
                            {/* Payment Transactions (Notifications) */}
                            <div className="space-y-4">
                                <h3 className="text-2xl font-serif font-semibold text-white">Payment Verifications</h3>
                                {(!transactions || transactions.length === 0) ? (
                                    <div className="bg-[#1A3C5E]/10 border border-white/5 rounded-2xl p-6 text-center text-gray-400 text-xs">
                                        No recent manual payment receipts uploaded.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {transactions.map((trx) => (
                                            <div key={trx.id} className="bg-[#1A3C5E]/15 border border-white/5 rounded-2xl p-4 hover:border-white/10 transition">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="font-bold text-sm text-white leading-tight">{trx.course?.title || 'Unknown Course'}</h4>
                                                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">Ref: {trx.reference}</p>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                                                        trx.status === 'success' ? 'bg-[#2ECC8C]/20 text-[#2ECC8C] border border-[#2ECC8C]/30' :
                                                        trx.status === 'failed' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                                                        'bg-[#F4A623]/20 text-[#F4A623] border border-[#F4A623]/30'
                                                    }`}>
                                                        {trx.status === 'pending' ? 'Verifying' : trx.status}
                                                    </span>
                                                </div>
                                                {trx.status === 'failed' && trx.admin_note && (
                                                    <div className="mt-2 p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-[11px] text-rose-300">
                                                        <span className="font-bold">Reason:</span> {trx.admin_note}
                                                    </div>
                                                )}
                                                {trx.status === 'success' && (
                                                    <div className="mt-2 p-2 bg-[#2ECC8C]/10 border border-[#2ECC8C]/20 rounded-lg text-[11px] text-[#2ECC8C]">
                                                        Your payment has been approved! You can now start studying.
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

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
