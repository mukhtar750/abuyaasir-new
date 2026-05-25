import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Catalog({ auth, courses }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Course Catalog" />
            <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-8">Course Catalog</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                <div className="h-48 bg-gradient-to-br from-[#1A3C5E] to-[#2ECC8C] flex items-center justify-center text-white text-2xl font-bold relative overflow-hidden">
                                    <div className="absolute inset-0 bg-black/20"></div>
                                    <span className="relative z-10">{course.subject?.name || 'Course'}</span>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xs font-bold text-[#F4A623] uppercase tracking-wider bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full">{course.type}</span>
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">₦{Number(course.price).toLocaleString()}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-serif">{course.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-2">{course.description}</p>
                                    <Link 
                                        href={`/courses/${course.id}`}
                                        className="block w-full text-center bg-[#1A3C5E] hover:bg-blue-800 text-white py-3 rounded-lg font-medium transition-colors"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {courses.length === 0 && (
                            <div className="col-span-full text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                                <p className="text-gray-500 dark:text-gray-400 text-lg">No courses available at the moment. Check back later!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
