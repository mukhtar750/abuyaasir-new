import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, course, bankAccountNumber }) {
    const [showModal, setShowModal] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        course_id: course.id,
        amount: course.price,
        receipt: null,
    });

    const submitReceipt = (e) => {
        e.preventDefault();
        post(route('payment.upload-receipt'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={course.title} />
            <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                        <div className="h-64 bg-gradient-to-r from-[#1A3C5E] to-[#2ECC8C] flex items-center justify-center text-white text-4xl font-bold font-serif relative">
                            <div className="absolute inset-0 bg-black/20"></div>
                            <span className="relative z-10">{course.title}</span>
                        </div>
                        <div className="p-8">
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <span className="bg-amber-100 dark:bg-amber-900/30 text-[#F4A623] px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
                                    {course.type}
                                </span>
                                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-bold">
                                    {course.subject?.name}
                                </span>
                                <span className="text-2xl font-bold text-gray-900 dark:text-white ml-auto">
                                    ₦{Number(course.price).toLocaleString()}
                                </span>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About this Course</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-8 whitespace-pre-line text-lg leading-relaxed">
                                {course.description}
                            </p>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mb-8">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Curriculum Outline</h3>
                                <ul className="space-y-3">
                                    {course.lessons?.map((lesson, idx) => (
                                        <li key={lesson.id} className="flex items-center text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg font-medium">
                                            <span className="w-8 h-8 rounded-full bg-[#1A3C5E]/10 text-[#1A3C5E] dark:bg-[#1A3C5E]/30 dark:text-blue-300 flex items-center justify-center font-bold mr-4 shrink-0">
                                                {idx + 1}
                                            </span>
                                            {lesson.title}
                                        </li>
                                    ))}
                                    {(!course.lessons || course.lessons.length === 0) && (
                                        <li className="text-gray-500 italic">Lessons are currently being updated.</li>
                                    )}
                                </ul>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={() => setShowModal(true)}
                                    className="flex-1 bg-[#2ECC8C] hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg transform transition hover:-translate-y-0.5 text-lg"
                                >
                                    Enroll Now
                                </button>
                                <Link 
                                    href={`/courses/${course.id}/learn`}
                                    className="flex-1 bg-white hover:bg-gray-50 text-[#1A3C5E] border-2 border-[#1A3C5E] font-bold py-4 rounded-xl shadow-sm flex items-center justify-center text-lg transition-colors"
                                >
                                    Go to Learning Hub (If Enrolled)
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 rounded-3xl max-w-md w-full space-y-6 shadow-2xl transform transition-all scale-100">
                            <div className="flex justify-between items-start">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Upload Payment Receipt</h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-2xl leading-none">&times;</button>
                            </div>
                            
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800/50">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    To enroll in <span className="text-[#1A3C5E] dark:text-[#2ECC8C] font-bold">{course.title}</span>, please pay <span className="font-bold text-lg text-[#F4A623]">₦{Number(course.price).toLocaleString()}</span> to the bank details below and upload your receipt.
                                </p>
                                <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Bank Details</p>
                                    <p className="font-mono text-gray-900 dark:text-white font-bold tracking-widest text-lg">{bankAccountNumber}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">GTBank - MyTutorPlus Ltd</p>
                                </div>
                            </div>

                            <form onSubmit={submitReceipt} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-400 mb-2">Receipt (Image/PDF)</label>
                                    <input 
                                        type="file" 
                                        onChange={e => setData('receipt', e.target.files[0])}
                                        className="w-full text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#1A3C5E] file:text-white hover:file:bg-blue-900 transition-colors cursor-pointer"
                                        required
                                    />
                                    {errors.receipt && <p className="text-red-500 text-sm mt-2 font-medium">{errors.receipt}</p>}
                                </div>

                                <button 
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-4 bg-[#2ECC8C] text-white font-bold rounded-xl text-sm uppercase tracking-wider hover:bg-green-600 transition shadow-lg disabled:opacity-50"
                                >
                                    {processing ? 'Uploading...' : 'Submit Receipt for Verification'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
