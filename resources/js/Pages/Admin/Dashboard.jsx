import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { 
    Shield, Users, BookOpen, Layers, Plus, Check, RefreshCw, 
    Sparkles, Trash2, ShieldAlert, Award, Flame, Megaphone, HelpCircle, Key 
} from 'lucide-react';

export default function AdminDashboard({ auth, stats, tutors, students, subjects, courses, campaigns, allUsers, pendingTransactions, sessions = [] }) {
    const { post, processing } = useForm();
    const [rejectNote, setRejectNote] = React.useState('');

    const approvePayment = (id) => {
        if (confirm('Approve this payment and enroll the student?')) {
            post(route('admin.payments.approve', id));
        }
    };

    const rejectPayment = (id) => {
        const note = prompt('Reason for rejection:');
        if (note) {
            post(route('admin.payments.reject', id), {
                data: { note }
            });
        }
    };
    const [activeTab, setActiveTab] = useState('overview');
    
    // Forms for Admin Actions
    const subjectForm = useForm({ name: '', description: '' });
    const assignTutorForm = useForm({ subject_id: '', tutor_id: '' });
    const enrollStudentForm = useForm({ student_id: '', course_id: '' });
    const campaignForm = useForm({ title: '', type: 'General', link: '/dashboard', is_active: true });
    
    const [maintenanceActive, setMaintenanceActive] = useState(stats.maintenance_mode);
    const maintenanceForm = useForm({ active: false });

    // Handle Forms Submissions
    const submitSubject = (e) => {
        e.preventDefault();
        subjectForm.post(route('admin.subject.create'), {
            onSuccess: () => subjectForm.reset(),
        });
    };

    const submitAssignTutor = (e) => {
        e.preventDefault();
        assignTutorForm.post(route('admin.tutor.assign'), {
            onSuccess: () => assignTutorForm.reset(),
        });
    };

    const submitEnrollStudent = (e) => {
        e.preventDefault();
        enrollStudentForm.post(route('admin.student.enroll'), {
            onSuccess: () => enrollStudentForm.reset(),
        });
    };

    const submitCampaign = (e) => {
        e.preventDefault();
        campaignForm.post(route('admin.campaign.save'), {
            onSuccess: () => campaignForm.reset(),
        });
    };

    const toggleMaintenance = () => {
        const nextState = !maintenanceActive;
        setMaintenanceActive(nextState);
        maintenanceForm.setData('active', nextState);
        
        setTimeout(() => {
            maintenanceForm.post(route('admin.maintenance.toggle'));
        }, 100);
    };

    const handleRoleChange = (userId, newRole) => {
        router.post(route('admin.user.role', userId), { role: newRole });
    };

    const handleDeleteUser = (userId, userName) => {
        if (confirm(`Are you absolutely sure you want to suspend/delete ${userName}'s account? This action is permanent.`)) {
            router.delete(route('admin.user.delete', userId));
        }
    };

    const handleResetPassword = (userId, userName) => {
        const newPassword = prompt(`Enter new password for ${userName} (min 8 chars):`);
        if (newPassword && newPassword.length >= 8) {
            router.post(route('admin.user.password', userId), { 
                password: newPassword,
                password_confirmation: newPassword 
            });
        } else if (newPassword) {
            alert("Password must be at least 8 characters.");
        }
    };

    const handleDeleteSubject = (subId, subName) => {
        if (confirm(`Are you sure you want to delete the subject "${subName}"? All related course definitions will be affected.`)) {
            router.delete(route('admin.subject.delete', subId));
        }
    };

    const handleToggleCampaign = (campId) => {
        router.post(route('admin.campaign.toggle', campId));
    };

    const handleDeleteCampaign = (campId) => {
        if (confirm('Delete this marketing campaign banner?')) {
            router.delete(route('admin.campaign.delete', campId));
        }
    };

    const handleCancelSession = (id) => {
        if (confirm('Are you sure you want to cancel this global session?')) {
            router.delete(route('sessions.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-xl font-serif font-semibold text-white leading-tight flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-[#F4A623]" />
                        Admin Operations Center
                    </h2>

                    {/* Developer Maintenance Mode Switcher */}
                    <div className="flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md shrink-0">
                        <div className="flex items-center space-x-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs font-semibold text-gray-300">Live Bypass Server</span>
                        </div>
                        <span className="text-gray-500">|</span>
                        <button
                            onClick={toggleMaintenance}
                            className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 focus:outline-none ${maintenanceActive ? 'bg-[#F4A623]' : 'bg-white/10 border border-white/5'}`}
                        >
                            <div className={`w-4 h-4 rounded-full shadow-md transform transition duration-300 ${maintenanceActive ? 'bg-black translate-x-6' : 'bg-gray-400 translate-x-0'}`} />
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Admin Operations" />

            <div className="py-8 bg-[#0D1B2A] min-h-screen text-white">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Tab Navigation Menu */}
                    <div className="flex border-b border-white/10 space-x-8 pb-1">
                        {[
                            { id: 'overview', label: '📊 Overview' },
                            { id: 'users', label: '👥 User Directory' },
                            { id: 'curriculum', label: '🎓 Curriculum Hub' },
                            { id: 'campaigns', label: '📢 Ad Campaigns' },
                            { id: 'sessions', label: '🎥 Classes & Timetable' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-3 text-sm font-bold transition duration-200 border-b-2 relative ${
                                    activeTab === tab.id 
                                    ? 'text-[#F4A623] border-[#F4A623]' 
                                    : 'text-gray-400 border-transparent hover:text-white'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* TAB CONTENT: OVERVIEW */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8 animate-fadeIn">
                            {/* Analytics Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-gradient-to-b from-[#1A3C5E]/20 to-[#0D1B2A] border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-md flex items-center space-x-4 hover:border-white/10 transition">
                                    <div className="p-3 bg-[#F4A623]/10 text-[#F4A623] rounded-xl"><Users className="w-7 h-7" /></div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-gray-400">Total Students</p>
                                        <p className="text-2xl font-bold text-white mt-0.5">{stats.total_students}</p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-b from-[#1A3C5E]/20 to-[#0D1B2A] border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-md flex items-center space-x-4 hover:border-white/10 transition">
                                    <div className="p-3 bg-[#2ECC8C]/10 text-[#2ECC8C] rounded-xl"><Users className="w-7 h-7" /></div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-gray-400">Assigned Tutors</p>
                                        <p className="text-2xl font-bold text-white mt-0.5">{stats.total_tutors}</p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-b from-[#1A3C5E]/20 to-[#0D1B2A] border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-md flex items-center space-x-4 hover:border-white/10 transition">
                                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl"><Layers className="w-7 h-7" /></div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-gray-400">Active Courses</p>
                                        <p className="text-2xl font-bold text-white mt-0.5">{stats.total_courses}</p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-b from-[#1A3C5E]/20 to-[#0D1B2A] border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-md flex items-center space-x-4 hover:border-white/10 transition">
                                    <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl"><BookOpen className="w-7 h-7" /></div>
                                    <div>
                                    <p className="text-xs uppercase tracking-wider text-gray-400">Subject Domains</p>
                                    <p className="text-2xl font-bold text-white mt-0.5">{stats.total_subjects}</p>
                                </div>
                            </div>

                            {/* Pending Payments Table */}
                            {pendingTransactions && pendingTransactions.length > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-[#1A3C5E]/15 border border-[#F4A623]/20 p-6 rounded-2xl backdrop-blur-md shadow-lg space-y-4"
                                >
                                    <h3 className="text-lg font-serif font-semibold text-white flex items-center">
                                        <Clock className="w-5 h-5 mr-2 text-[#F4A623]" />
                                        Pending Enrollment Receipts ({pendingTransactions.length})
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-400">
                                                    <th className="py-3 px-4">Student</th>
                                                    <th className="py-3 px-4">Course</th>
                                                    <th className="py-3 px-4">Amount</th>
                                                    <th className="py-3 px-4">Receipt</th>
                                                    <th className="py-3 px-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5 text-sm">
                                                {pendingTransactions.map((tx) => (
                                                    <tr key={tx.id} className="hover:bg-white/5 transition duration-150">
                                                        <td className="py-3.5 px-4">{tx.user.name}</td>
                                                        <td className="py-3.5 px-4">{tx.course?.title || 'Wallet Top-up'}</td>
                                                        <td className="py-3.5 px-4 font-bold text-[#2ECC8C]">&#8358;{parseFloat(tx.amount).toLocaleString()}</td>
                                                        <td className="py-3.5 px-4">
                                                            <a 
                                                                href={`/storage/${tx.proof_of_payment}`} 
                                                                target="_blank" 
                                                                className="text-[#F4A623] hover:underline flex items-center text-xs"
                                                            >
                                                                View Receipt <PlayCircle className="w-3 h-3 ml-1" />
                                                            </a>
                                                        </td>
                                                        <td className="py-3.5 px-4 text-right space-x-2">
                                                            <button 
                                                                onClick={() => approvePayment(tx.id)}
                                                                disabled={processing}
                                                                className="px-3 py-1.5 bg-emerald-500 text-black text-xs font-bold rounded-lg hover:bg-emerald-400 transition"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button 
                                                                onClick={() => rejectPayment(tx.id)}
                                                                disabled={processing}
                                                                className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-400 transition"
                                                            >
                                                                Reject
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            )}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Assign Tutor to Subject */}
                                <div className="bg-[#1A3C5E]/15 border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-lg space-y-4">
                                    <h3 className="text-lg font-serif font-semibold text-white flex items-center">
                                        <RefreshCw className="w-5 h-5 mr-2 text-[#F4A623]" />
                                        Assign Tutor to Subject Domain
                                    </h3>
                                    <p className="text-xs text-gray-400">Map certified platform tutors directly to their designated academic departments for course planning.</p>
                                    
                                    <form onSubmit={submitAssignTutor} className="space-y-4 pt-2">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-2 font-medium">Select Subject</label>
                                                <select
                                                    value={assignTutorForm.data.subject_id}
                                                    onChange={e => assignTutorForm.setData('subject_id', e.target.value)}
                                                    className="w-full bg-[#0D1B2A]/50 border border-white/10 focus:border-[#F4A623] focus:ring-[#F4A623] rounded-xl px-4 py-2.5 text-xs text-white transition"
                                                    required
                                                >
                                                    <option value="">-- Choose Subject --</option>
                                                    {subjects.map(sub => (
                                                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-2 font-medium">Select Assigned Tutor</label>
                                                <select
                                                    value={assignTutorForm.data.tutor_id}
                                                    onChange={e => assignTutorForm.setData('tutor_id', e.target.value)}
                                                    className="w-full bg-[#0D1B2A]/50 border border-white/10 focus:border-[#F4A623] focus:ring-[#F4A623] rounded-xl px-4 py-2.5 text-xs text-white transition"
                                                    required
                                                >
                                                    <option value="">-- Choose Tutor --</option>
                                                    {tutors.map(tut => (
                                                        <option key={tut.id} value={tut.id}>{tut.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={assignTutorForm.processing}
                                            className="px-5 py-2.5 bg-[#F4A623] hover:bg-[#F4A623]/90 text-black font-bold rounded-xl text-xs transition duration-200 shadow-md shadow-[#F4A623]/15 w-full disabled:opacity-50"
                                        >
                                            Assign Tutor
                                        </button>
                                    </form>
                                </div>

                                {/* Manually Enroll a Student */}
                                <div className="bg-[#1A3C5E]/15 border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-lg space-y-4">
                                    <h3 className="text-lg font-serif font-semibold text-white flex items-center">
                                        <Check className="w-5 h-5 mr-2 text-blue-400" />
                                        Manually Enroll Student to Course
                                    </h3>
                                    <p className="text-xs text-gray-400">Direct administrative registration to bypass dynamic student self-enrollments.</p>
                                    
                                    <form onSubmit={submitEnrollStudent} className="space-y-4 pt-2">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-2 font-medium">Select Student</label>
                                                <select
                                                    value={enrollStudentForm.data.student_id}
                                                    onChange={e => enrollStudentForm.setData('student_id', e.target.value)}
                                                    className="w-full bg-[#0D1B2A]/50 border border-white/10 focus:border-blue-400 focus:ring-blue-400 rounded-xl px-4 py-2.5 text-xs text-white transition"
                                                    required
                                                >
                                                    <option value="">-- Choose Student --</option>
                                                    {students.map(stud => (
                                                        <option key={stud.id} value={stud.id}>{stud.name} ({stud.email})</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-2 font-medium">Select Active Course</label>
                                                <select
                                                    value={enrollStudentForm.data.course_id}
                                                    onChange={e => enrollStudentForm.setData('course_id', e.target.value)}
                                                    className="w-full bg-[#0D1B2A]/50 border border-white/10 focus:border-blue-400 focus:ring-blue-400 rounded-xl px-4 py-2.5 text-xs text-white transition"
                                                    required
                                                >
                                                    <option value="">-- Choose Course --</option>
                                                    {courses.map(crs => (
                                                        <option key={crs.id} value={crs.id}>{crs.subject.name} - {crs.title} ({crs.type})</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={enrollStudentForm.processing}
                                            className="px-5 py-2.5 bg-blue-500 hover:bg-blue-500/90 text-white font-bold rounded-xl text-xs transition duration-200 shadow-md shadow-blue-500/15 w-full disabled:opacity-50"
                                        >
                                            Enroll Student
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB CONTENT: USER DIRECTORY */}
                    {activeTab === 'users' && (
                        <div className="bg-[#1A3C5E]/15 border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-lg space-y-6 animate-fadeIn">
                            <div>
                                <h3 className="text-lg font-serif font-semibold text-white">Registered Users Directory</h3>
                                <p className="text-xs text-gray-400 mt-1">Manage, promote, or suspend active user profiles in real-time.</p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-400">
                                            <th className="py-3 px-4">User</th>
                                            <th className="py-3 px-4">Email</th>
                                            <th className="py-3 px-4">Current Role</th>
                                            <th className="py-3 px-4">Gamification</th>
                                            <th className="py-3 px-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-sm">
                                        {allUsers.map((usr) => (
                                            <tr key={usr.id} className="hover:bg-white/5 transition duration-150">
                                                <td className="py-3.5 px-4 flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#1A3C5E] border border-white/10 flex items-center justify-center font-bold text-xs uppercase text-[#F4A623]">
                                                        {usr.name.charAt(0)}
                                                    </div>
                                                    <span className="font-semibold text-white">{usr.name}</span>
                                                </td>
                                                <td className="py-3.5 px-4 text-gray-300 font-mono text-xs">{usr.email}</td>
                                                <td className="py-3.5 px-4">
                                                    <span className={`inline-block px-2 py-0.5 text-[10px] font-black uppercase rounded tracking-wider ${
                                                        usr.role === 'admin' ? 'bg-[#F4A623]/15 text-[#F4A623]' : 
                                                        usr.role === 'tutor' ? 'bg-[#2ECC8C]/15 text-[#2ECC8C]' : 
                                                        'bg-gray-500/15 text-gray-400'
                                                    }`}>
                                                        {usr.role}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center space-x-3 text-xs">
                                                        <span className="flex items-center text-amber-400 font-bold" title="XP Points">
                                                            <Award className="w-3.5 h-3.5 mr-1" />
                                                            {usr.points} XP
                                                        </span>
                                                        <span className="flex items-center text-rose-400 font-bold" title="Daily Streak">
                                                            <Flame className="w-3.5 h-3.5 mr-1 animate-pulse" />
                                                            {usr.streak_days} days
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 text-right">
                                                    <div className="flex items-center justify-end space-x-3">
                                                        <select
                                                            value={usr.role}
                                                            onChange={(e) => handleRoleChange(usr.id, e.target.value)}
                                                            className="bg-[#0D1B2A]/50 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:ring-[#F4A623]"
                                                        >
                                                            <option value="student">Student</option>
                                                            <option value="tutor">Tutor</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                        <button
                                                            onClick={() => handleResetPassword(usr.id, usr.name)}
                                                            className="p-1.5 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-lg transition"
                                                            title="Reset Password"
                                                        >
                                                            <Key className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(usr.id, usr.name)}
                                                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-lg transition"
                                                            title="Suspend User Account"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB CONTENT: CURRICULUM HUB */}
                    {activeTab === 'curriculum' && (
                        <div className="space-y-8 animate-fadeIn">
                            
                            {/* 1. Add Subject Category Form */}
                            <div className="bg-[#1A3C5E]/15 border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-lg space-y-4">
                                <h3 className="text-lg font-serif font-semibold text-white flex items-center">
                                    <Plus className="w-5 h-5 mr-2 text-[#2ECC8C]" />
                                    Add New Curriculum Subject
                                </h3>
                                <p className="text-xs text-gray-400">Add dynamic science branches, languages, or specialized test directories to the core database.</p>
                                
                                <form onSubmit={submitSubject} className="space-y-4 pt-2">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="md:col-span-1">
                                            <input
                                                type="text"
                                                placeholder="e.g. Further Mathematics"
                                                value={subjectForm.data.name}
                                                onChange={e => subjectForm.setData('name', e.target.value)}
                                                className="w-full bg-[#0D1B2A]/50 border border-white/10 focus:border-[#2ECC8C] focus:ring-[#2ECC8C] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 transition duration-200"
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <input
                                                type="text"
                                                placeholder="Curriculum scope description..."
                                                value={subjectForm.data.description}
                                                onChange={e => subjectForm.setData('description', e.target.value)}
                                                className="w-full bg-[#0D1B2A]/50 border border-white/10 focus:border-[#2ECC8C] focus:ring-[#2ECC8C] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 transition duration-200"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={subjectForm.processing}
                                        className="px-5 py-2.5 bg-[#2ECC8C] hover:bg-[#2ECC8C]/90 text-black font-bold rounded-xl text-xs transition duration-200 shadow-md shadow-[#2ECC8C]/15 disabled:opacity-50"
                                    >
                                        Create Subject
                                    </button>
                                </form>
                            </div>

                            {/* 2. List of Active Subjects & Courses */}
                            <div className="bg-[#1A3C5E]/15 border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-lg space-y-6">
                                <div>
                                    <h3 className="text-lg font-serif font-semibold text-white">Platform Curriculum Map</h3>
                                    <p className="text-xs text-gray-400 mt-1">Review live courses, lesson configurations, and subjects catalog.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {subjects.map((sub) => {
                                        const relatedCourses = courses.filter(c => c.subject_id === sub.id);
                                        return (
                                            <div key={sub.id} className="bg-white/5 border border-white/5 p-5 rounded-xl hover:border-white/10 transition flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-bold text-sm text-white">{sub.name}</h4>
                                                            <p className="text-[11px] text-gray-400 mt-1">{sub.description || 'No description provided.'}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteSubject(sub.id, sub.name)}
                                                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-lg transition"
                                                            title="Delete Subject"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>

                                                    <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Active Courses ({relatedCourses.length})</span>
                                                        {relatedCourses.length === 0 ? (
                                                            <span className="text-[11px] text-gray-500 italic block">No active classes deployed.</span>
                                                        ) : (
                                                            <div className="space-y-1.5">
                                                                {relatedCourses.map(crs => (
                                                                    <div key={crs.id} className="flex justify-between items-center text-xs">
                                                                        <span className="text-gray-300">↳ {crs.title} ({crs.type})</span>
                                                                        <span className="text-amber-400 font-bold">{crs.lessons?.length || 0} lessons</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mt-4 pt-3 border-t border-white/5 flex items-center space-x-1.5 text-[10px] text-gray-400">
                                                    <span className="font-bold text-[#F4A623]">Assigned Tutors:</span>
                                                    <span>{sub.tutors?.map(t => t.name).join(', ') || 'None assigned yet.'}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB CONTENT: AD CAMPAIGNS */}
                    {activeTab === 'campaigns' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
                            
                            {/* Create Ad Form */}
                            <div className="bg-[#1A3C5E]/15 border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-lg space-y-4 h-fit">
                                <h3 className="text-lg font-serif font-semibold text-white flex items-center">
                                    <Sparkles className="w-5 h-5 mr-2 text-[#F4A623]" />
                                    Launch Ad Campaign
                                </h3>
                                <p className="text-xs text-gray-400 font-light">Deploy a highly engaging ad card globally to matching student dashboard flows.</p>

                                <form onSubmit={submitCampaign} className="space-y-4 pt-2">
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1.5 font-medium">Campaign / Ad Title</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. chemistry Bootcamp Registration open!"
                                            value={campaignForm.data.title}
                                            onChange={e => campaignForm.setData('title', e.target.value)}
                                            className="w-full bg-[#0D1B2A]/50 border border-white/10 focus:border-[#F4A623] focus:ring-[#F4A623] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 transition"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Ad Type</label>
                                            <select
                                                value={campaignForm.data.type}
                                                onChange={e => campaignForm.setData('type', e.target.value)}
                                                className="w-full bg-[#0D1B2A]/50 border border-white/10 focus:border-[#F4A623] focus:ring-[#F4A623] rounded-xl px-3 py-2.5 text-xs text-white transition"
                                            >
                                                <option value="General">General Ad</option>
                                                <option value="Summer">Summer Class</option>
                                                <option value="JAMB">JAMB Prep</option>
                                                <option value="WAEC">WAEC Prep</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Set Live</label>
                                            <select
                                                value={campaignForm.data.is_active ? '1' : '0'}
                                                onChange={e => campaignForm.setData('is_active', e.target.value === '1')}
                                                className="w-full bg-[#0D1B2A]/50 border border-white/10 focus:border-[#F4A623] focus:ring-[#F4A623] rounded-xl px-3 py-2.5 text-xs text-white transition"
                                            >
                                                <option value="1">Active</option>
                                                <option value="0">Paused</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1.5 font-medium">CTA Link Destination</label>
                                        <input
                                            type="text"
                                            placeholder="/dashboard"
                                            value={campaignForm.data.link}
                                            onChange={e => campaignForm.setData('link', e.target.value)}
                                            className="w-full bg-[#0D1B2A]/50 border border-white/10 focus:border-[#F4A623] focus:ring-[#F4A623] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 transition"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={campaignForm.processing}
                                        className="w-full py-3 bg-[#F4A623] hover:bg-[#F4A623]/95 text-black font-bold rounded-xl text-xs transition duration-200 shadow-md shadow-[#F4A623]/15"
                                    >
                                        Deploy Campaign
                                    </button>
                                </form>
                            </div>

                            {/* Campaigns Management directory */}
                            <div className="bg-[#1A3C5E]/15 border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-lg space-y-6 lg:col-span-2">
                                <div>
                                    <h3 className="text-lg font-serif font-semibold text-white">Announcements & Campaigns Scheduler</h3>
                                    <p className="text-xs text-gray-400 mt-1">Audit active marketing campaigns or toggle scheduling timers instantly.</p>
                                </div>

                                {campaigns.length === 0 ? (
                                    <p className="text-xs text-gray-500 italic">No campaigns deployed yet.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {campaigns.map((camp) => (
                                            <div key={camp.id} className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-center justify-between hover:border-white/10 transition">
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2.5 bg-[#F4A623]/10 text-[#F4A623] rounded-lg">
                                                        <Megaphone className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h5 className="font-bold text-xs text-white leading-tight">{camp.title}</h5>
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            <span className="px-1.5 py-0.5 bg-[#F4A623]/10 text-[#F4A623] text-[9px] font-bold rounded">
                                                                {camp.type}
                                                            </span>
                                                            <span className="text-[10px] text-gray-500 font-mono">Link: {camp.link}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center space-x-2">
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${camp.is_active ? 'text-[#2ECC8C]' : 'text-gray-500'}`}>
                                                            {camp.is_active ? 'Live' : 'Paused'}
                                                        </span>
                                                        <button
                                                            onClick={() => handleToggleCampaign(camp.id)}
                                                            className={`w-9 h-5 flex items-center rounded-full p-0.5 transition duration-300 focus:outline-none ${camp.is_active ? 'bg-[#2ECC8C]' : 'bg-white/10'}`}
                                                        >
                                                            <div className={`w-4 h-4 rounded-full shadow-sm transform transition duration-300 ${camp.is_active ? 'bg-black translate-x-4' : 'bg-gray-400 translate-x-0'}`} />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteCampaign(camp.id)}
                                                        className="p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-lg transition"
                                                        title="Delete Campaign"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {/* TAB CONTENT: SESSIONS & TIMETABLE */}
                    {activeTab === 'sessions' && (
                        <div className="bg-[#1A3C5E]/15 border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-lg space-y-6 animate-fadeIn">
                            <div>
                                <h3 className="text-lg font-serif font-semibold text-white">Global Class Timetable</h3>
                                <p className="text-xs text-gray-400 mt-1">Monitor, filter, and cancel any scheduled live sessions across the entire platform.</p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-400">
                                            <th className="py-3 px-4">Topic & Date</th>
                                            <th className="py-3 px-4">Tutor</th>
                                            <th className="py-3 px-4">Type</th>
                                            <th className="py-3 px-4">Status</th>
                                            <th className="py-3 px-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-sm">
                                        {sessions.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="py-6 text-center text-gray-500 italic">No classes scheduled yet.</td>
                                            </tr>
                                        ) : (
                                            sessions.map(session => (
                                                <tr key={session.id} className="hover:bg-white/5 transition duration-150">
                                                    <td className="py-3.5 px-4">
                                                        <div className="font-bold text-white mb-1">{session.topic}</div>
                                                        <div className="text-xs text-gray-400">
                                                            {new Date(session.scheduled_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                                            <span className="ml-1 text-gray-500">({session.duration_minutes}m)</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-gray-300 font-medium">
                                                        {session.tutor?.name || 'N/A'}
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        {session.course ? (
                                                            <span className="text-amber-400 text-xs font-semibold block">Course: {session.course.title}</span>
                                                        ) : (
                                                            <span className="text-blue-400 text-xs font-semibold block">1-on-1: {session.student?.name}</span>
                                                        )}
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <span className={`inline-block px-2 py-0.5 text-[10px] font-black uppercase rounded tracking-wider ${
                                                            session.status === 'completed' ? 'bg-blue-500/15 text-blue-400' :
                                                            session.status === 'scheduled' ? 'bg-[#2ECC8C]/15 text-[#2ECC8C]' :
                                                            session.status === 'cancelled' ? 'bg-rose-500/15 text-rose-400' :
                                                            'bg-[#F4A623]/15 text-[#F4A623]'
                                                        }`}>
                                                            {session.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right">
                                                        {session.status !== 'cancelled' && (
                                                            <button
                                                                onClick={() => handleCancelSession(session.id)}
                                                                className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-lg transition text-xs font-bold uppercase tracking-wider"
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
