import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Submit({ auth, assignment, submission }) {
    const { data, setData, post, processing, progress, errors } = useForm({
        file: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('student.assignments.submit', assignment.id));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Submit: ${assignment.title}`} />
            <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
                    <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-3">{assignment.title}</h1>
                    <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg inline-flex">
                        <span className="flex items-center"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> Course: {assignment.course?.title}</span>
                        <span>|</span>
                        <span className="flex items-center"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg> Max Score: {assignment.max_score}</span>
                        <span>|</span>
                        <span className="font-bold text-red-500 flex items-center"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Due: {assignment.due_date || 'No deadline'}</span>
                    </div>

                    <div className="prose dark:prose-invert max-w-none mb-10 text-lg text-gray-700 dark:text-gray-300 leading-relaxed border-l-4 border-[#F4A623] pl-4">
                        <p>{assignment.description}</p>
                    </div>

                    {submission ? (
                        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-8 transform transition-all hover:scale-[1.01]">
                            <h3 className="text-green-800 dark:text-green-400 font-bold text-xl mb-2 flex items-center">
                                <svg className="w-8 h-8 mr-3 bg-green-200 dark:bg-green-800 p-1.5 rounded-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                Assignment Submitted Successfully
                            </h3>
                            <p className="text-green-700 dark:text-green-500 mb-6 ml-11">Your file has been uploaded and is ready for grading.</p>
                            
                            {submission.score !== null ? (
                                <div className="mt-6 pt-6 border-t-2 border-green-200 dark:border-green-800/50">
                                    <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm mb-2">Grade Received</h4>
                                    <p className="text-4xl font-bold text-[#1A3C5E] dark:text-[#2ECC8C] mb-4">{submission.score} <span className="text-xl text-gray-500">/ {assignment.max_score}</span></p>
                                    {submission.feedback && (
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-inner">
                                            <span className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Tutor Feedback: </span>
                                            <span className="text-gray-600 dark:text-gray-400 italic">"{submission.feedback}"</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="ml-11 inline-flex items-center px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full text-sm font-medium">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-yellow-800 dark:text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Waiting for tutor to grade...
                                </div>
                            )}
                        </div>
                    ) : (
                        <form onSubmit={submit} className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 text-center hover:border-[#1A3C5E] transition-colors">
                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Upload your work</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">PDF, DOCX, ZIP up to 10MB</p>
                            
                            <input 
                                type="file" 
                                onChange={e => setData('file', e.target.files[0])}
                                className="mx-auto block w-full max-w-sm text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#1A3C5E] file:text-white hover:file:bg-blue-900 cursor-pointer mb-6 transition-colors"
                                required
                            />
                            {errors.file && <div className="text-red-500 text-sm mb-4 font-medium">{errors.file}</div>}
                            
                            {progress && (
                                <div className="w-full max-w-sm mx-auto mb-6 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                  <div className="bg-[#2ECC8C] h-2.5 rounded-full" style={{ width: `${progress.percentage}%` }}></div>
                                </div>
                            )}
                            
                            <button 
                                type="submit" 
                                disabled={processing} 
                                className="w-full max-w-sm bg-[#2ECC8C] hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition hover:-translate-y-0.5"
                            >
                                Submit Assignment
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
