import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function QuestionManager({ auth, exam }) {
    const singleForm = useForm({
        question_text: '',
        options: { A: '', B: '', C: '', D: '' },
        correct_option: 'A',
    });

    const csvForm = useForm({
        csv_file: null,
    });

    const submitSingle = (e) => {
        e.preventDefault();
        singleForm.post(route('tutor.cbt.questions.store', exam.id), {
            onSuccess: () => singleForm.reset()
        });
    };

    const submitCsv = (e) => {
        e.preventDefault();
        csvForm.post(route('tutor.cbt.questions.import', exam.id), {
            onSuccess: () => csvForm.reset()
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Questions: ${exam.title}`} />
            
            <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-[#1A3C5E] dark:text-white">{exam.title}</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage Questions for this CBT Exam</p>
                    </div>
                    <div className="text-right bg-blue-50 dark:bg-blue-900/20 px-6 py-4 rounded-xl border border-blue-100 dark:border-blue-800/50">
                        <p className="text-xs text-[#F4A623] uppercase tracking-wider font-bold mb-1">Total Questions</p>
                        <p className="text-4xl font-bold text-[#1A3C5E] dark:text-white">{exam.questions?.length || 0}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Add Single Question Form */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">Add Single Question</h2>
                        <form onSubmit={submitSingle} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Question Text</label>
                                <textarea required rows="3" value={singleForm.data.question_text} onChange={e => singleForm.setData('question_text', e.target.value)} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2ECC8C] focus:ring-[#2ECC8C]"></textarea>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {['A', 'B', 'C', 'D'].map(opt => (
                                    <div key={opt}>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                                            <span className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 inline-flex items-center justify-center text-xs mr-2">{opt}</span>
                                            Option
                                        </label>
                                        <input required type="text" value={singleForm.data.options[opt]} onChange={e => singleForm.setData('options', { ...singleForm.data.options, [opt]: e.target.value })} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2ECC8C] focus:ring-[#2ECC8C]" />
                                    </div>
                                ))}
                            </div>
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Select Correct Option</label>
                                <div className="flex gap-4">
                                    {['A', 'B', 'C', 'D'].map(opt => (
                                        <label key={opt} className={`flex-1 text-center py-2 rounded-lg border cursor-pointer font-bold transition-colors ${singleForm.data.correct_option === opt ? 'bg-[#2ECC8C] text-white border-[#2ECC8C]' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                                            <input type="radio" name="correct_option" value={opt} checked={singleForm.data.correct_option === opt} onChange={e => singleForm.setData('correct_option', e.target.value)} className="sr-only" />
                                            {opt}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <button type="submit" disabled={singleForm.processing} className="w-full bg-[#1A3C5E] text-white py-3 rounded-xl font-bold hover:bg-blue-900 transition-colors shadow-lg mt-4">
                                Save Question
                            </button>
                        </form>
                    </div>

                    {/* Bulk Import CSV Form */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-fit">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">Bulk Import via CSV</h2>
                        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-6 rounded-xl text-sm mb-6 border border-blue-100 dark:border-blue-800/50">
                            <div className="flex items-start">
                                <svg className="w-6 h-6 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <div>
                                    <p className="font-bold text-base mb-2">CSV Format Requirements:</p>
                                    <p className="mb-2">Your CSV should have exactly 6 columns without headers:</p>
                                    <ol className="list-decimal ml-5 mt-1 opacity-90 space-y-1 font-medium">
                                        <li>Question Text</li>
                                        <li>Option A</li>
                                        <li>Option B</li>
                                        <li>Option C</li>
                                        <li>Option D</li>
                                        <li>Correct Option (A, B, C, or D)</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                        <form onSubmit={submitCsv} className="space-y-6">
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-[#2ECC8C] transition-colors">
                                <input 
                                    type="file" 
                                    accept=".csv"
                                    onChange={e => csvForm.setData('csv_file', e.target.files[0])}
                                    className="mx-auto block w-full max-w-sm text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#1A3C5E]/10 file:text-[#1A3C5E] dark:file:bg-[#1A3C5E]/30 dark:file:text-blue-300 hover:file:bg-[#1A3C5E]/20 cursor-pointer"
                                    required
                                />
                            </div>
                            {csvForm.errors.csv_file && <div className="text-red-500 text-sm font-medium text-center">{csvForm.errors.csv_file}</div>}
                            <button type="submit" disabled={csvForm.processing} className="w-full bg-[#2ECC8C] text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg flex justify-center items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                Upload & Import CSV
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Existing Questions */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">Existing Questions Database</h2>
                    {(!exam.questions || exam.questions.length === 0) ? (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                            <svg className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">No questions have been added to this exam yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {exam.questions.map((q, idx) => (
                                <div key={q.id} className="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#1A3C5E]/30 transition-colors">
                                    <div className="flex items-start mb-4">
                                        <span className="bg-[#1A3C5E] text-white text-xs font-bold px-2 py-1 rounded mr-3 shrink-0 mt-0.5">Q{idx + 1}</span>
                                        <p className="font-bold text-gray-900 dark:text-white">{q.question_text}</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                        {['A', 'B', 'C', 'D'].map(opt => (
                                            <div key={opt} className={`p-2 rounded-lg border ${q.correct_option === opt ? 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400 font-bold' : 'bg-white border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400'}`}>
                                                <span className="font-bold mr-2 opacity-70">{opt}:</span>
                                                {q.options?.[opt]}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
