import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, assignments }) {
    const { data, setData, post, processing, reset } = useForm({
        course_id: '',
        title: '',
        description: '',
        due_date: '',
        max_score: 100,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('tutor.assignments.store'), {
            onSuccess: () => reset()
        });
    };

    const gradeSubmission = (submissionId, score, feedback) => {
        router.post(route('tutor.assignments.grade', submissionId), {
            score, feedback
        }, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Manage Assignments" />
            <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                
                {/* Create Assignment Form */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold mb-6 text-[#1A3C5E] dark:text-white border-b pb-2 dark:border-gray-700">Create New Assignment</h2>
                    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Course ID</label>
                            <input type="text" value={data.course_id} onChange={e => setData('course_id', e.target.value)} className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2ECC8C] focus:ring-[#2ECC8C]" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                            <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2ECC8C] focus:ring-[#2ECC8C]" required />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                            <textarea rows="3" value={data.description} onChange={e => setData('description', e.target.value)} className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2ECC8C] focus:ring-[#2ECC8C]"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                            <input type="datetime-local" value={data.due_date} onChange={e => setData('due_date', e.target.value)} className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2ECC8C] focus:ring-[#2ECC8C]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Score</label>
                            <input type="number" value={data.max_score} onChange={e => setData('max_score', e.target.value)} className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2ECC8C] focus:ring-[#2ECC8C]" required />
                        </div>
                        <div className="md:col-span-2 text-right">
                            <button type="submit" disabled={processing} className="bg-[#1A3C5E] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-900 transition-colors shadow-sm">
                                Create Assignment
                            </button>
                        </div>
                    </form>
                </div>

                {/* Submissions List */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold mb-6 text-[#1A3C5E] dark:text-white border-b pb-2 dark:border-gray-700">Assignments & Submissions</h2>
                    <div className="space-y-6">
                        {assignments.map(assignment => (
                            <div key={assignment.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-gray-50/50 dark:bg-gray-800/50">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center justify-between">
                                    {assignment.title} 
                                    <span className="text-xs font-semibold bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-gray-700 dark:text-gray-300">Course ID: {assignment.course_id}</span>
                                </h3>
                                <p className="text-sm text-gray-500 mt-1 mb-4">Max Score: {assignment.max_score} | Due: {assignment.due_date || 'No deadline'}</p>
                                
                                <div className="mt-4">
                                    <h4 className="font-semibold text-sm mb-3 text-gray-700 dark:text-gray-300 uppercase tracking-wider">Submissions</h4>
                                    {assignment.submissions?.length === 0 ? (
                                        <p className="text-sm text-gray-500 italic">No submissions yet.</p>
                                    ) : (
                                        <ul className="space-y-3">
                                            {assignment.submissions?.map(sub => (
                                                <li key={sub.id} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-4 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
                                                    <div>
                                                        <p className="font-bold text-gray-900 dark:text-white">{sub.student?.name}</p>
                                                        <a href={`/storage/${sub.file_path}`} target="_blank" rel="noreferrer" className="text-[#2ECC8C] hover:underline text-sm font-medium flex items-center mt-1">
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                            View File
                                                        </a>
                                                    </div>
                                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                                        <input type="number" defaultValue={sub.score} placeholder={`/ ${assignment.max_score}`} id={`score-${sub.id}`} className="w-24 rounded-lg border-gray-300 focus:ring-[#2ECC8C] focus:border-[#2ECC8C] text-sm" />
                                                        <input type="text" defaultValue={sub.feedback} placeholder="Feedback..." id={`feedback-${sub.id}`} className="flex-1 md:w-48 rounded-lg border-gray-300 focus:ring-[#2ECC8C] focus:border-[#2ECC8C] text-sm" />
                                                        <button onClick={() => gradeSubmission(
                                                            sub.id, 
                                                            document.getElementById(`score-${sub.id}`).value,
                                                            document.getElementById(`feedback-${sub.id}`).value
                                                        )} className="bg-[#2ECC8C] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors shrink-0">
                                                            Grade
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
