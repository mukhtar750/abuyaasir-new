import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Book, Plus, Video, Users, Sparkles, BookOpen, ShieldAlert, Clock, AlertCircle, FileText, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TutorDashboard({ auth, stats, subjects, courses, enrollments, classesToday = [] }) {
    
    // Forms for Tutor Actions
    const lessonForm = useForm({ course_id: '', title: '', video_url: '', content: '', resources: [] });

    const isApproved = auth.user.is_approved;
    const adminNote = auth.user.admin_note;

    const submitLesson = (e) => {
        if (!isApproved) {
            alert("Your account is pending approval. You cannot add lessons yet.");
            return;
        }
        e.preventDefault();
        lessonForm.post(route('tutor.lesson.create'), {
            onSuccess: () => lessonForm.reset(),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-serif font-semibold text-white leading-tight flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-[#F4A623]" />
                    Tutor Workspace Portal
                </h2>
            }
        >
            <Head title="Tutor Workspace" />

            <div className="py-12 bg-[#0D1B2A] min-h-screen text-white">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Approval Status Banner */}
                    {!isApproved && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center gap-6 ${adminNote ? 'bg-red-500/10 border-red-500/30' : 'bg-[#F4A623]/10 border-[#F4A623]/30'}`}
                        >
                            <div className={`p-4 rounded-full ${adminNote ? 'bg-red-500/20 text-red-400' : 'bg-[#F4A623]/20 text-[#F4A623]'}`}>
                                {adminNote ? <ShieldAlert className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className={`text-lg font-black uppercase tracking-widest ${adminNote ? 'text-red-400' : 'text-[#F4A623]'}`}>
                                    {adminNote ? 'Application Rejected / Feedback Required' : 'Application Pending Approval'}
                                </h3>
                                <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                                    {adminNote 
                                        ? `The admin has provided the following feedback: "${adminNote}". Please update your profile or contact support.` 
                                        : "Your tutor account is currently under review by the administration. You can explore the dashboard, but course creation and live classes will be enabled once you are approved."}
                                </p>
                            </div>
                            {!adminNote && (
                                <div className="px-4 py-2 bg-[#F4A623]/10 border border-[#F4A623]/20 rounded-xl text-[10px] font-black text-[#F4A623] uppercase tracking-tighter">
                                    Estimated Review: 24-48 Hours
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-b from-[#1A3C5E]/20 to-[#0D1B2A] border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-md flex items-center space-x-4 hover:border-white/10 transition">
                            <div className="p-3 bg-[#F4A623]/10 text-[#F4A623] rounded-xl"><Book className="w-8 h-8" /></div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-400">Assigned Subjects</p>
                                <p className="text-2xl font-bold text-white mt-0.5">{stats.my_subjects}</p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-b from-[#1A3C5E]/20 to-[#0D1B2A] border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-md flex items-center space-x-4 hover:border-white/10 transition">
                            <div className="p-3 bg-[#2ECC8C]/10 text-[#2ECC8C] rounded-xl"><Plus className="w-8 h-8" /></div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-400">Launched Courses</p>
                                <p className="text-2xl font-bold text-white mt-0.5">{stats.my_courses}</p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-b from-[#1A3C5E]/20 to-[#0D1B2A] border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-md flex items-center space-x-4 hover:border-white/10 transition">
                            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl"><Users className="w-8 h-8" /></div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-400">Attending Students</p>
                                <p className="text-2xl font-bold text-white mt-0.5">{stats.total_students}</p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Widget: Next Upcoming Class Today */}
                    {classesToday.length > 0 && (
                        <div className="bg-gradient-to-r from-[#2ECC8C]/20 to-[#1A3C5E]/40 border border-[#2ECC8C]/30 rounded-2xl p-6 relative overflow-hidden shadow-lg animate-pulse">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                                <div className="space-y-2">
                                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#2ECC8C]/10 text-[#2ECC8C] text-xs font-semibold">
                                        <Video className="h-3.5 w-3.5" />
                                        <span>UPCOMING CLASS TODAY</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white leading-tight">{classesToday[0].topic}</h3>
                                    <p className="text-sm text-gray-300">
                                        Scheduled for: {new Date(classesToday[0].scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                                        {classesToday[0].course ? ` - ${classesToday[0].course.title}` : ` - 1-on-1 with ${classesToday[0].student?.name}`}
                                    </p>
                                </div>
                                <a
                                    href={classesToday[0].meeting_link ? route('sessions.join', classesToday[0].id) : '#'}
                                    onClick={(e) => {
                                        if (!classesToday[0].meeting_link) {
                                            e.preventDefault();
                                            alert("Meeting link is not available yet.");
                                        }
                                    }}
                                    target={classesToday[0].meeting_link ? "_blank" : undefined}
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-gradient-to-r from-[#2ECC8C] to-emerald-500 hover:opacity-90 text-[#07111f] font-black rounded-xl text-xs uppercase tracking-wider transition duration-200 shadow-md shrink-0"
                                >
                                    Join Class Now
                                </a>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Course Creation and Lesson management forms */}
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* 1. Add Lesson Material */}
                            <div className="bg-[#1A3C5E]/15 border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-lg hover:border-white/10 transition space-y-4">
                                <h3 className="text-lg font-serif font-semibold text-white flex items-center">
                                    <Video className="w-5 h-5 mr-2 text-[#F4A623]" />
                                    Add Video Lesson / Study Material
                                </h3>
                                <p className="text-xs text-gray-400">Upload video references and interactive learning notes into launched preparational classes.</p>

                                <form onSubmit={submitLesson} className="space-y-4 pt-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-2 font-medium">Select Target Course</label>
                                            <select
                                                value={lessonForm.data.course_id}
                                                onChange={e => lessonForm.setData('course_id', e.target.value)}
                                                className="w-full bg-[#0D1B2A]/50 border border-white/10 focus:border-[#F4A623] focus:ring-[#F4A623] rounded-xl px-4 py-2.5 text-xs text-white transition"
                                                required
                                            >
                                                <option value="">-- Choose Course --</option>
                                                {courses.map(crs => (
                                                    <option key={crs.id} value={crs.id}>{crs.subject.name} - {crs.title}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-2 font-medium">Video URL (YouTube, Vimeo, AWS)</label>
                                            <input
                                                type="url"
                                                placeholder="https://youtube.com/..."
                                                value={lessonForm.data.video_url}
                                                onChange={e => lessonForm.setData('video_url', e.target.value)}
                                                className="w-full bg-[#0D1B2A]/50 border border-white/10 focus:border-[#F4A623] focus:ring-[#F4A623] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 transition"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-2 font-medium">Lesson Title</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Introduction to Organic Compounds"
                                            value={lessonForm.data.title}
                                            onChange={e => lessonForm.setData('title', e.target.value)}
                                            className="w-full bg-[#0D1B2A]/50 border border-white/10 focus:border-[#F4A623] focus:ring-[#F4A623] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 transition"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-2 font-medium">Lesson Content / Notes</label>
                                        <textarea
                                            placeholder="Provide detailed notes for the student..."
                                            value={lessonForm.data.content}
                                            onChange={e => lessonForm.setData('content', e.target.value)}
                                            className="w-full bg-[#0D1B2A]/50 border border-white/10 focus:border-[#F4A623] focus:ring-[#F4A623] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 transition"
                                            rows="4"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={lessonForm.processing}
                                        className="px-5 py-2.5 bg-[#F4A623] hover:bg-[#F4A623]/90 text-black font-bold rounded-xl text-xs transition duration-200 shadow-md shadow-[#F4A623]/15 disabled:opacity-50"
                                    >
                                        Add Lesson Material
                                    </button>
                                </form>
                            </div>

                            {/* 3. CBT & Assignments Management Card */}
                            <div className="bg-[#1A3C5E]/15 border border-white/5 p-8 rounded-3xl backdrop-blur-md shadow-lg space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-serif font-bold text-white">Assessment Hub</h3>
                                            <p className="text-xs text-gray-400">Manage CBT exams and track assignment submissions.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Link 
                                        href={route('tutor.assignments.index')}
                                        className="group p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-purple-500/50 transition-all flex flex-col justify-between"
                                    >
                                        <div>
                                            <h4 className="font-bold text-white mb-1">Assignments</h4>
                                            <p className="text-[10px] text-gray-500 leading-relaxed">Grade submissions and post new tasks for students.</p>
                                        </div>
                                        <div className="mt-4 flex items-center text-xs font-black text-purple-400 uppercase tracking-widest">
                                            Manage Tasks <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>

                                    <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-bold text-white mb-1">CBT Management</h4>
                                            <p className="text-[10px] text-gray-500 leading-relaxed italic">CBT exams are linked to specific courses. Use the curriculum map to manage questions.</p>
                                        </div>
                                        <div className="mt-4 flex items-center text-xs font-black text-gray-600 uppercase tracking-widest cursor-not-allowed">
                                            Manage via Map
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar: Subjects & Courses Map */}
                        <div className="space-y-8">
                            <div className="bg-[#1A3C5E]/15 border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-lg space-y-6">
                                <div>
                                    <h3 className="text-lg font-serif font-semibold text-white">Academic Map</h3>
                                    <p className="text-xs text-gray-400 mt-1">Quick links to manage questions for your active courses.</p>
                                </div>

                                <div className="space-y-4">
                                    {courses.map(course => (
                                        <div key={course.id} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 transition space-y-3">
                                            <div>
                                                <h4 className="font-bold text-sm text-white">{course.title}</h4>
                                                <span className="text-[10px] text-gray-500 uppercase font-black">{course.subject.name}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                                                {course.cbt_exams?.map(exam => (
                                                    <Link 
                                                        key={exam.id}
                                                        href={route('tutor.cbt.questions.index', exam.id)}
                                                        className="px-3 py-1.5 bg-[#F4A623]/10 text-[#F4A623] text-[9px] font-black uppercase rounded-lg hover:bg-[#F4A623]/20 transition flex items-center"
                                                    >
                                                        Manage CBT: {exam.title}
                                                    </Link>
                                                ))}
                                                {(!course.cbt_exams || course.cbt_exams.length === 0) && (
                                                    <span className="text-[9px] text-gray-600 italic">No CBT exams linked.</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {courses.length === 0 && (
                                        <p className="text-xs text-gray-500 italic text-center py-4">No active courses assigned yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
