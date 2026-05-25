import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Calendar, Video, Clock, User, Plus, CheckCircle, AlertCircle } from 'lucide-react';

export default function Index({ auth, sessions }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        tutor_id: '',
        topic: '',
        scheduled_at: '',
        duration_minutes: 60,
        platform: 'google_meet',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('sessions.store'), {
            onSuccess: () => reset(),
        });
    };

    const statusColors = {
        scheduled: 'bg-[#2ECC8C]/20 text-[#2ECC8C] border border-[#2ECC8C]/30',
        completed: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
        cancelled: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-serif font-semibold text-white leading-tight flex items-center">
                    <Video className="w-5 h-5 mr-2 text-[#F4A623]" />
                    Live Sessions
                </h2>
            }
        >
            <Head title="Live Sessions" />

            <div className="py-12 bg-[#0D1B2A] min-h-screen text-white">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    {/* Schedule a Session — Students Only */}
                    {auth.user.role === 'student' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-b from-[#1A3C5E]/20 to-[#0D1B2A] border border-white/10 rounded-2xl p-8"
                        >
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                                <Plus className="w-5 h-5 mr-2 text-[#F4A623]" />
                                Request a Live Session
                            </h3>
                            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-semibold">Topic</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Quadratic Equations, Electrostatics..."
                                        className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F4A623]/50 focus:border-[#F4A623]/50 transition"
                                        value={data.topic}
                                        onChange={e => setData('topic', e.target.value)}
                                        required
                                    />
                                    {errors.topic && <p className="text-rose-400 text-xs mt-1">{errors.topic}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-semibold">Scheduled Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F4A623]/50 focus:border-[#F4A623]/50 transition [color-scheme:dark]"
                                        value={data.scheduled_at}
                                        onChange={e => setData('scheduled_at', e.target.value)}
                                        required
                                    />
                                    {errors.scheduled_at && <p className="text-rose-400 text-xs mt-1">{errors.scheduled_at}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-semibold">Duration (Minutes)</label>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F4A623]/50 transition [color-scheme:dark]"
                                        value={data.duration_minutes}
                                        onChange={e => setData('duration_minutes', e.target.value)}
                                    >
                                        <option value="30">30 minutes</option>
                                        <option value="60">60 minutes</option>
                                        <option value="90">90 minutes</option>
                                        <option value="120">120 minutes</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-semibold">Platform</label>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F4A623]/50 transition [color-scheme:dark]"
                                        value={data.platform}
                                        onChange={e => setData('platform', e.target.value)}
                                    >
                                        <option value="google_meet">Google Meet</option>
                                        <option value="webrtc">In-Platform (WebRTC)</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-8 py-3 bg-gradient-to-r from-[#F4A623] to-amber-400 text-[#0D1B2A] font-black rounded-xl text-sm uppercase tracking-wider hover:opacity-90 transition disabled:opacity-50 shadow-lg"
                                    >
                                        {processing ? 'Scheduling...' : 'Book Session'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {/* Sessions Grid */}
                    {sessions.length === 0 ? (
                        <div className="text-center py-24 bg-[#1A3C5E]/10 border border-white/5 rounded-2xl">
                            <Video className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 font-medium">No sessions scheduled yet.</p>
                            <p className="text-gray-600 text-sm mt-1">Book a session above to get started.</p>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-2xl font-serif font-semibold text-white">
                                {auth.user.role === 'tutor' ? 'My Teaching Sessions' : 'My Upcoming Classes'}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sessions.map((session, index) => (
                                    <motion.div
                                        key={session.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.07 }}
                                        className="bg-gradient-to-b from-[#1A3C5E]/20 to-[#0D1B2A] border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-white/10 hover:shadow-lg transition duration-300"
                                    >
                                        <div>
                                            <div className="flex justify-between items-start mb-5">
                                                <div className="p-2.5 bg-[#1A3C5E]/40 rounded-xl">
                                                    <Video className="w-6 h-6 text-[#2ECC8C]" />
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${statusColors[session.status] || statusColors.scheduled}`}>
                                                    {session.status}
                                                </span>
                                            </div>

                                            <h4 className="text-lg font-bold text-white mb-4 leading-snug">{session.topic}</h4>

                                            <div className="space-y-2.5 text-sm text-gray-400 mb-6">
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-2.5 text-[#F4A623] shrink-0" />
                                                    {new Date(session.scheduled_at).toLocaleDateString('en-NG', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="w-4 h-4 mr-2.5 text-[#F4A623] shrink-0" />
                                                    {new Date(session.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    <span className="ml-1 text-gray-500">({session.duration_minutes} mins)</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <User className="w-4 h-4 mr-2.5 text-[#F4A623] shrink-0" />
                                                    {auth.user.role === 'tutor'
                                                        ? (session.student?.name || 'Student')
                                                        : (session.tutor?.name || 'Tutor')}
                                                </div>
                                            </div>
                                        </div>

                                        <a
                                            href={route('sessions.join', session.id)}
                                            className="block w-full text-center bg-gradient-to-r from-[#2ECC8C] to-emerald-500 text-[#0D1B2A] py-3 rounded-xl hover:opacity-90 transition font-black text-sm uppercase tracking-wider shadow-md"
                                        >
                                            Join Class
                                        </a>
                                    </motion.div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
