import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function EditSessionModal({ show, onClose, session }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        topic: '',
        scheduled_at: '',
        duration_minutes: 60,
        status: 'scheduled',
        meeting_link: '',
    });

    useEffect(() => {
        if (session) {
            const date = new Date(session.scheduled_at);
            const offset = date.getTimezoneOffset() * 60000;
            const localISOTime = (new Date(date - offset)).toISOString().slice(0, 16);

            setData({
                topic: session.topic,
                scheduled_at: localISOTime,
                duration_minutes: session.duration_minutes,
                status: session.status,
                meeting_link: session.meeting_link || '',
            });
        }
    }, [session]);

    const submit = (e) => {
        e.preventDefault();
        put(route('sessions.update', session.id), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <div className="bg-[#10243A] p-8 border border-[#1A3C5E] rounded-xl text-white">
                <h2 className="text-2xl font-serif font-bold mb-6 text-white">Edit Session</h2>
                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Topic</label>
                        <input
                            type="text"
                            value={data.topic}
                            onChange={e => setData('topic', e.target.value)}
                            className="w-full bg-[#0D1B2A] border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#F4A623]/50"
                        />
                        {errors.topic && <div className="text-red-500 text-xs mt-1">{errors.topic}</div>}
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Scheduled Date & Time</label>
                        <input
                            type="datetime-local"
                            value={data.scheduled_at}
                            onChange={e => setData('scheduled_at', e.target.value)}
                            className="w-full bg-[#0D1B2A] border border-white/10 rounded-lg px-4 py-3 text-white [color-scheme:dark] focus:ring-2 focus:ring-[#F4A623]/50"
                        />
                        {errors.scheduled_at && <div className="text-red-500 text-xs mt-1">{errors.scheduled_at}</div>}
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Duration (Minutes)</label>
                        <select
                            value={data.duration_minutes}
                            onChange={e => setData('duration_minutes', e.target.value)}
                            className="w-full bg-[#0D1B2A] border border-white/10 rounded-lg px-4 py-3 text-white [color-scheme:dark] focus:ring-2 focus:ring-[#F4A623]/50"
                        >
                            <option value="30">30 minutes</option>
                            <option value="60">60 minutes</option>
                            <option value="90">90 minutes</option>
                            <option value="120">120 minutes</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Status</label>
                        <select
                            value={data.status}
                            onChange={e => setData('status', e.target.value)}
                            className="w-full bg-[#0D1B2A] border border-white/10 rounded-lg px-4 py-3 text-white [color-scheme:dark] focus:ring-2 focus:ring-[#F4A623]/50"
                        >
                            <option value="scheduled">Scheduled</option>
                            <option value="live">Live</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Google Meet Link</label>
                        <input
                            type="text"
                            value={data.meeting_link}
                            onChange={e => setData('meeting_link', e.target.value)}
                            className="w-full bg-[#0D1B2A] border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#F4A623]/50"
                            placeholder="https://meet.google.com/xxx-xxxx-xxx"
                            required={data.status === 'scheduled'}
                        />
                        {errors.meeting_link && <div className="text-red-500 text-xs mt-1">{errors.meeting_link}</div>}
                    </div>

                    <div className="flex justify-end pt-6 space-x-4 border-t border-white/10">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 text-slate-400 hover:text-white transition">Cancel</button>
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-[#F4A623] text-black font-bold rounded-lg shadow hover:opacity-90 transition disabled:opacity-50">
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
