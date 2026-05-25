import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Learn({ auth, course, completedLessonIds, progressPercent }) {
    const [activeLesson, setActiveLesson] = useState(course.lessons[0] || null);

    const markComplete = () => {
        if (!activeLesson) return;
        router.post(`/courses/${course.id}/lessons/${activeLesson.id}/complete`, {}, {
            preserveScroll: true
        });
    };

    const isComplete = (lessonId) => completedLessonIds.includes(lessonId);

    const renderVideo = (url) => {
        if (!url) return <div className="flex items-center justify-center h-full bg-black text-white">No video provided</div>;
        
        // Handle YouTube links
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = url.includes('youtu.be') ? url.split('youtu.be/')[1] : url.split('v=')[1]?.split('&')[0];
            return (
                <iframe 
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                </iframe>
            );
        }
        
        // Handle MP4
        return (
            <video className="w-full h-full" controls>
                <source src={url} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Learning: ${course.title}`} />
            
            <div className="flex flex-col lg:flex-row h-[calc(100vh-65px)] bg-gray-50 dark:bg-gray-900">
                {/* Main Video Area */}
                <div className="flex-1 flex flex-col overflow-y-auto">
                    {activeLesson ? (
                        <>
                            <div className="w-full aspect-video bg-black">
                                {renderVideo(activeLesson.video_url)}
                            </div>
                            <div className="p-6 md:p-8 max-w-4xl mx-auto w-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-2">
                                            {activeLesson.title}
                                        </h1>
                                        <p className="text-gray-500 dark:text-gray-400">Course: {course.title}</p>
                                    </div>
                                    {!isComplete(activeLesson.id) ? (
                                        <button 
                                            onClick={markComplete}
                                            className="px-6 py-2 bg-[#2ECC8C] hover:bg-green-600 text-white font-medium rounded-lg shadow transition-colors"
                                        >
                                            Mark as Complete
                                        </button>
                                    ) : (
                                        <span className="px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-lg font-medium flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            Completed
                                        </span>
                                    )}
                                </div>
                                <div className="prose dark:prose-invert max-w-none">
                                    <div dangerouslySetInnerHTML={{ __html: activeLesson.content || 'No additional content provided for this lesson.' }} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center p-8">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">No lessons available yet</h2>
                                <p className="text-gray-500">Check back later for course content.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Course Progress</h3>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                            <div className="bg-[#2ECC8C] h-3 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-right">{progressPercent}% Completed</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        <h4 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-3 px-2">Lessons</h4>
                        {course.lessons.map((lesson, idx) => (
                            <button
                                key={lesson.id}
                                onClick={() => setActiveLesson(lesson)}
                                className={`w-full text-left p-4 rounded-xl transition-colors flex items-start gap-3 ${
                                    activeLesson?.id === lesson.id 
                                    ? 'bg-[#1A3C5E]/10 dark:bg-[#1A3C5E]/30 border border-[#1A3C5E]/20' 
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent'
                                }`}
                            >
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                    isComplete(lesson.id)
                                    ? 'bg-[#2ECC8C] text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                }`}>
                                    {isComplete(lesson.id) ? '✓' : idx + 1}
                                </div>
                                <div>
                                    <h5 className={`font-medium ${activeLesson?.id === lesson.id ? 'text-[#1A3C5E] dark:text-[#F4A623]' : 'text-gray-700 dark:text-gray-300'}`}>
                                        {lesson.title}
                                    </h5>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Video Lesson
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
