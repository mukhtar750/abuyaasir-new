import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function AttendanceModal({ show, onClose, session }) {
    const { data, setData, post, processing, reset } = useForm({
        attendances: [],
    });

    useEffect(() => {
        if (session) {
            let studentsList = [];
            if (session.course && session.course.enrollments) {
                studentsList = session.course.enrollments.map(e => e.student).filter(Boolean);
            } else if (session.student) {
                studentsList = [session.student];
            }

            const initialAttendances = studentsList.map(st => ({
                student_id: st.id,
                student_name: st.name,
                status: 'absent',
                notes: '',
            }));

            // Check if there's existing attendance
            if (session.attendances && session.attendances.length > 0) {
                initialAttendances.forEach(ia => {
                    const existing = session.attendances.find(a => a.student_id === ia.student_id);
                    if (existing) {
                        ia.status = existing.status || (existing.is_present ? 'present' : 'absent');
                        ia.notes = existing.notes || '';
                    }
                });
            }

            setData('attendances', initialAttendances);
        }
    }, [session]);

    const setAttendanceStatus = (index, status) => {
        const newAttendances = [...data.attendances];
        newAttendances[index].status = status;
        setData('attendances', newAttendances);
    };

    const statusStyles = {
        present: 'bg-[#2ECC8C]/20 text-[#2ECC8C] border border-[#2ECC8C]/30',
        late: 'bg-[#F4A623]/20 text-[#F4A623] border border-[#F4A623]/30',
        excused: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
        absent: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('sessions.attendance', session.id), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <div className="bg-[#10243A] p-8 border border-[#1A3C5E] rounded-xl text-white">
                <h2 className="text-2xl font-serif font-bold mb-2 text-white">Mark Attendance</h2>
                <p className="text-sm text-gray-400 mb-6">Session: {session?.topic}</p>

                <form onSubmit={submit} className="space-y-4">
                    {data.attendances.length === 0 ? (
                        <div className="p-4 bg-[#0D1B2A] rounded-lg text-gray-400 text-center text-sm">
                            No students found for this session.
                        </div>
                    ) : (
                        <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
                            {data.attendances.map((att, i) => (
                                <div key={att.student_id} className="flex items-center justify-between p-4 bg-[#0D1B2A] border border-white/5 rounded-xl transition hover:border-white/10">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-white">{att.student_name}</span>
                                        <span className="text-xs text-gray-500 mt-1">ID: {att.student_id}</span>
                                    </div>
                                    <select
                                        value={att.status}
                                        onChange={(e) => setAttendanceStatus(i, e.target.value)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-bold uppercase transition bg-[#0D1B2A] ${statusStyles[att.status] || statusStyles.absent}`}
                                    >
                                        <option value="present">Present</option>
                                        <option value="late">Late</option>
                                        <option value="absent">Absent</option>
                                        <option value="excused">Excused</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-end pt-6 space-x-4 border-t border-white/10 mt-6">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 text-slate-400 hover:text-white transition">Cancel</button>
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-[#F4A623] text-black font-bold rounded-lg shadow hover:opacity-90 transition disabled:opacity-50">
                            {processing ? 'Submitting...' : 'Complete Session'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
