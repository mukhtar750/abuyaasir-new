import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Book, Plus, Video, Users, Sparkles, BookOpen, ShieldAlert, Clock, AlertCircle } from 'lucide-react';

export default function TutorDashboard({ auth, stats, subjects, courses, enrollments, classesToday = [] }) {
    
    // Forms for Tutor Actions
    const courseForm = useForm({ subject_id: '', title: '', description: '', type: 'Standard', price: 0 });
    const lessonForm = useForm({ course_id: '', title: '', video_url: '', content: '', resources: [] });

    const isApproved = auth.user.is_approved;
    const adminNote = auth.user.admin_note;

    const submitCourse = (e) => {
        if (!isApproved) {
            alert("Your account is pending approval. You cannot create courses yet.");
            return;
        }
        e.preventDefault();
        courseForm.post(route('tutor.course.create'), {
            onSuccess: () => courseForm.reset(),
        });
    };

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
                            
                            {/* 1. Create a New Course */}
                            <div className="bg-[#1A3C5E]/15 border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-lg hover:border-white/10 transition space-y-4">
                                <h3 className="text-lg font-serif font-semibold text-white flex items-center">
                                    <BookOpen className="w-5 h-5 mr-2 text-[#2ECC8C]" />
                                    Launch New Class / Course
                                </h3>
                                <p className="text-xs text-gray-400">Initialize a new preparational syllabus under your administrative subject allocations.</p>

                                <form onSubmit={submitCourse} className="space-y-4 pt-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-2 font-medium">Subject Domain</label>
                                            <select
                                                value={courseForm.data.subject_id}
                                                onChange={e => courseForm.setData('subject_id', e.target.value)}
                                                className="w-full bg-[#0D1B2A]/50 border border-white/10 focus:border-[#2ECC8C] focus:ring-[#2ECC8C] rounded-xl px-4 py-2.5 text-xs text-white transition"
                                                required
                                            >
                                                <option value="">-- Choose Subject --</option>
                                                {subjects.map(sub => (
                                                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-2 font-medium">Class Type / Scope</label>
                                            <select
                                                value={courseForm.data.type}
                                                onChange={e => courseForm.setData('type', e.target.value)}
                                                className="w-full bg-[#0D1B2A]/50 border border-white/10 focus:border-[#2ECC8C] focus:ring-[#2ECC8C] rounded-xl px-4 py-2.5 text-xs text-white transition"
                                            >
                                                <option value="Standard">Standard Course</option>
                                                <option value="JAMB">JAMB Preparation</option>
                                                <option value="WAEC">WAEC Preparation</option>
                                                <option value="Summer">Summer Bootcamp</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-xs text-gray-400 mb-2 font-medium">Course Title</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Inorganic Chemistry & Periodicity"
                                                value={courseForm.data.title}
                                                onChange={e => courseForm.setData('title', e.target.value)}
                                                className="w-full bg-[#0D1B2A]/50 border border-white/10 focus:border-[#2ECC8C] focus:ring-[#2ECC8C] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 transition"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-2 font-medium">Price (NGN)</label>
                                            <input
                                                type="number"
                                                placeholder="Price"
                                                value={courseForm.data.price}
                                                onChange={e => courseForm.setData('price', e.target.value)}
                                                className="w-full bg-[#0D1B2A]/50 border border-white/10 focus:border-[#2ECC8C] focus:ring-[#2ECC8C] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 transition"
                                                min="0"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={courseForm.processing}
                                        className="px-5 py-2.5 bg-[#2ECC8C] hover:bg-[#2ECC8C]/90 text-black font-bold rounded-xl text-xs transition duration-200 shadow-md shadow-[#2ECC8C]/15 disabled:opacity-50"
                                    >
                                        Create Course
                                    </button>
                                </form>
                            </div>

                            {/* 2. Add Lesson Material */}
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
                                            placeholder="e.g. Lesson 1: Stoichiometry and Gas Laws"
                                            value={lessonForm.data.title}
                                            onChange={e => lessonForm.setData('title', e.target.value)}
                                            className="w-full bg-[#0D1B2A]/50 border border-white/10 focus:border-[#F4A623] focus:ring-[#F4A623] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 transition"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-2 font-medium">Interactive Notes & Formulations</label>
                                        <textarea
                                            placeholder="Write formulas, reference guides, and notes for the students..."
                                            value={lessonForm.data.content}
                                            onChange={e => lessonForm.setData('content', e.target.value)}
                                            className="w-full bg-[#0D1B2A]/50 border border-white/10 focus:border-[#F4A623] focus:ring-[#F4A623] rounded-xl p-4 text-sm text-white transition h-28"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-400 mb-2 font-medium">Downloadable Resources (PDFs, Slides, Zip)</label>
                                        <input
                                            type="file"
                                            multiple
                                            onChange={e => lessonForm.setData('resources', e.target.files)}
                                            className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#F4A623]/10 file:text-[#F4A623] hover:file:bg-[#F4A623]/20 transition"
                                        />
                                        <p className="text-[10px] text-gray-500 mt-1">Select multiple files if needed (Max 5MB each)</p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={lessonForm.processing}
                                        className="w-full py-3 bg-[#F4A623] hover:bg-[#F4A623]/95 text-black font-bold rounded-xl text-xs transition duration-200 shadow-md shadow-[#F4A623]/15"
                                    >
                                        {lessonForm.processing ? 'Uploading Lesson...' : 'Add Lesson Material'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* RIGHT SIDE: Dynamic list of Course materials and Attending Students */}
                        <div className="space-y-8">
                            
                            {/* Course catalog & materials overview */}
                            <div className="bg-[#1A3C5E]/15 border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-lg hover:border-white/10 transition space-y-4">
                                <h3 className="text-lg font-serif font-semibold text-white">
                                    Launched Class Directories
                                </h3>
                                
                                {courses.length === 0 ? (
                                    <p className="text-xs text-gray-500">You haven't launched any classes yet.</p>
                                ) : (
                                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                                        {courses.map(crs => (
                                            <div key={crs.id} className="border-b border-white/5 pb-4 last:border-b-0 space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-bold text-xs text-white leading-tight">{crs.title}</h4>
                                                        <span className="inline-block mt-1.5 px-1.5 py-0.5 bg-[#2ECC8C]/10 text-[#2ECC8C] text-[9px] font-bold rounded">
                                                            {crs.subject.name} | {crs.type}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1.5">
                                                        <span className="text-xs text-[#F4A623] font-bold shrink-0">{crs.lessons.length} Lessons</span>
                                                        <span className={`px-1.5 py-0.5 text-[8px] font-black uppercase rounded tracking-widest ${
                                                            crs.is_approved 
                                                            ? 'bg-emerald-500/10 text-emerald-400' 
                                                            : crs.admin_note 
                                                                ? 'bg-red-500/10 text-red-400' 
                                                                : 'bg-blue-500/10 text-blue-400'
                                                        }`}>
                                                            {crs.is_approved ? 'Live' : crs.admin_note ? 'Rejected' : 'Pending Review'}
                                                        </span>
                                                    </div>
                                                </div>
                                                {!crs.is_approved && crs.admin_note && (
                                                    <div className="p-2 bg-red-500/5 border border-red-500/10 rounded-lg text-[10px] text-red-400 italic">
                                                        Note: {crs.admin_note}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Attending Students List */}
                            <div className="bg-[#1A3C5E]/15 border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-lg hover:border-white/10 transition space-y-4">
                                <h3 className="text-lg font-serif font-semibold text-white">
                                    Attending Enrolled Students
                                </h3>
                                
                                {enrollments.length === 0 ? (
                                    <p className="text-xs text-gray-500">No students are currently attending your classes.</p>
                                ) : (
                                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2">
                                        {enrollments.map(enr => (
                                            <div key={enr.id} className="bg-white/5 border border-white/5 p-3.5 rounded-xl flex items-center justify-between hover:border-white/10 transition">
                                                <div>
                                                    <h5 className="font-bold text-xs text-white leading-tight">{enr.student.name}</h5>
                                                    <p className="text-[9px] text-gray-400 mt-1 uppercase font-medium">Class: {enr.course.title}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs text-[#2ECC8C] font-black">{enr.progress_percent}%</span>
                                                    <p className="text-[8px] text-gray-500 uppercase">Progress</p>
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
