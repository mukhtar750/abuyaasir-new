import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Learn({ auth, course, completedLessonIds, progressPercent, liveSessions = [] }) {
    const [activeLesson, setActiveLesson] = useState(course.lessons[0] || null);
    const [activeTab, setActiveTab] = useState('lessons'); // 'lessons' or 'live'

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
                            <div className="w-full aspect-video bg-black animate-fadeIn">
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

                    {/* Navigation Tabs */}
                    <div className="flex border-b border-gray-200 dark:border-gray-700 px-4 pt-2">
                        <button
                            onClick={() => setActiveTab('lessons')}
                            className={`flex-1 py-3 text-center font-bold text-sm border-b-2 transition-colors relative ${
                                activeTab === 'lessons'
                                ? 'border-[#1A3C5E] dark:border-[#F4A623] text-[#1A3C5E] dark:text-[#F4A623]'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            Lessons ({course.lessons.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('live')}
                            className={`flex-1 py-3 text-center font-bold text-sm border-b-2 transition-colors relative flex justify-center items-center gap-1.5 ${
                                activeTab === 'live'
                                ? 'border-[#1A3C5E] dark:border-[#F4A623] text-[#1A3C5E] dark:text-[#F4A623]'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            Live Classes
                            {liveSessions.length > 0 && (
                                <span className="px-2 py-0.5 text-[10px] font-black bg-rose-500 text-white rounded-full animate-pulse">
                                    {liveSessions.length}
                                </span>
                            )}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {activeTab === 'lessons' ? (
                            <>
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
                            </>
                        ) : (
                            <>
                                <h4 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-3 px-2">Scheduled Live Classes</h4>
                                {liveSessions.length === 0 ? (
                                    <div className="text-center py-12 px-4 bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800 rounded-2xl">
                                        <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                        <p className="text-gray-500 text-sm font-medium">No live classes scheduled for this course yet.</p>
                                        <p className="text-xs text-gray-400 mt-1">Check back later or ask your tutor to schedule a session.</p>
                                    </div>
                                ) : (
                                    liveSessions.map((session) => (
                                        <div 
                                            key={session.id} 
                                            className="p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/80 border border-gray-100 dark:border-gray-700/50 rounded-2xl space-y-4 hover:shadow-md transition duration-200"
                                        >
                                            <div>
                                                <div className="flex justify-between items-start mb-1">
                                                    <h5 className="font-bold text-gray-900 dark:text-white leading-tight">
                                                        {session.topic}
                                                    </h5>
                                                    <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-black uppercase rounded-full border border-green-500/20">
                                                        {session.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Tutor: {session.tutor?.name || 'Instructor'}
                                                </p>
                                            </div>

                                            <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                                                <div className="flex items-center">
                                                    <svg className="w-3.5 h-3.5 mr-2 text-[#F4A623]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    {new Date(session.scheduled_at).toLocaleDateString('en-NG', { weekday: 'short', month: 'short', day: 'numeric' })}
                                                </div>
                                                <div className="flex items-center">
                                                    <svg className="w-3.5 h-3.5 mr-2 text-[#F4A623]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    {new Date(session.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({session.duration_minutes} mins)
                                                </div>
                                            </div>

                                            <a 
                                                href={session.meeting_link ? `/sessions/${session.id}/join` : '#'}
                                                onClick={(e) => {
                                                    if (!session.meeting_link) {
                                                        e.preventDefault();
                                                        alert("Meeting link is not available yet.");
                                                    }
                                                }}
                                                target={session.meeting_link ? "_blank" : undefined}
                                                rel="noopener noreferrer"
                                                className="block w-full text-center py-2.5 bg-gradient-to-r from-[#2ECC8C] to-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition shadow-sm"
                                            >
                                                Join Live Class
                                            </a>
                                        </div>
                                    ))
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
