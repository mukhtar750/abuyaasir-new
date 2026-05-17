import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Clock, ChevronLeft, ChevronRight, Send } from 'lucide-react';

export default function ExamSession({ exam }) {
    const { questions } = exam;
    const totalQuestions = questions.length;
    
    // CBT Session State
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState({}); // {question_id: "A", ...}
    const [timeLeft, setTimeLeft] = useState(exam.duration_minutes * 60); // seconds
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const currentQuestion = questions[currentIdx];

    // Inertia Submission Form
    const submitForm = useForm({
        answers: {},
        time_spent_seconds: 0,
    });

    // Countdown Timer logic
    useEffect(() => {
        if (timeLeft <= 0) {
            triggerAutoSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Format seconds into MM:SS
    const formatTime = (secs) => {
        const mins = Math.floor(secs / 60);
        const remainingSecs = secs % 60;
        return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
    };

    const handleSelectOption = (optionKey) => {
        if (hasSubmitted) return;
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: optionKey
        }));
    };

    const triggerAutoSubmit = () => {
        if (hasSubmitted) return;
        setHasSubmitted(true);
        
        const timeSpent = (exam.duration_minutes * 60) - timeLeft;
        submitForm.setData({
            answers: answers,
            time_spent_seconds: timeSpent,
        });

        // Submit form asynchronously using a delay so states align
        setTimeout(() => {
            submitForm.post(route('cbt.submit', exam.id));
        }, 100);
    };

    const triggerManualSubmit = () => {
        if (window.confirm("Are you sure you want to submit your CBT Mock Exam? Your score will be graded instantly.")) {
            triggerAutoSubmit();
        }
    };

    return (
        <div className="app-shell flex min-h-screen flex-col justify-between font-sans selection:bg-[#F4A623] selection:text-black">
            <Head title={`CBT Session: ${exam.title}`} />

            {/* Locked Sticky Header */}
            <header className="sticky top-0 z-20 flex flex-col gap-4 border-b border-white/10 bg-[#0D1B2A]/92 px-4 py-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between md:px-6">
                <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#F4A623] font-bold">JAMB/WAEC Real CBT Simulator</span>
                    <h1 className="text-base font-black text-white leading-tight">{exam.title}</h1>
                </div>

                <div className="flex items-center gap-3">
                    {/* Live Clock Timer */}
                    <div className={`flex items-center space-x-2 border px-4 py-2 rounded-lg backdrop-blur-md ${timeLeft < 180 ? 'border-rose-500 text-rose-500 bg-rose-500/10 animate-pulse' : 'border-white/15 text-white bg-white/5'}`}>
                        <Clock className="w-5 h-5" />
                        <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
                    </div>

                    <button
                        onClick={triggerManualSubmit}
                        disabled={submitForm.processing}
                        className="btn-primary bg-[#2ECC8C] hover:bg-[#48df9f]"
                    >
                        <Send className="h-4 w-4" />
                        Submit CBT
                    </button>
                </div>
            </header>

            {/* Main CBT Workspace Layout */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Center / Left Panel: Current Question Sheet */}
                <div className="lg:col-span-3 space-y-6">
                    {totalQuestions === 0 ? (
                        <div className="surface p-8 rounded-lg text-center text-gray-400">
                            This mock exam has no questions loaded yet.
                        </div>
                    ) : (
                        <div className="surface p-6 md:p-8 rounded-lg space-y-8 min-h-[400px] flex flex-col justify-between">
                            
                            {/* Question Header & Body */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-center text-xs text-gray-400 border-b border-white/5 pb-4">
                                    <span>Question {currentIdx + 1} of {totalQuestions}</span>
                                    <span className="px-2 py-0.5 rounded bg-white/10 text-white font-semibold">Multiple Choice</span>
                                </div>
                                <p className="text-base md:text-lg text-white leading-relaxed font-medium">
                                    {currentQuestion.question_text}
                                </p>
                            </div>

                            {/* Options A, B, C, D */}
                            <div className="grid grid-cols-1 gap-4">
                                {Object.entries(currentQuestion.options).map(([key, val]) => {
                                    const isSelected = answers[currentQuestion.id] === key;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => handleSelectOption(key)}
                                            className={`w-full text-left p-4 rounded-lg border text-sm transition duration-150 flex items-center space-x-4 ${isSelected ? 'border-[#F4A623] bg-[#F4A623]/10 text-white' : 'border-white/10 hover:border-white/20 bg-white/5 text-gray-300 hover:text-white'}`}
                                        >
                                            <div className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center text-xs ${isSelected ? 'bg-[#F4A623] text-black' : 'bg-white/10 text-gray-400'}`}>
                                                {key}
                                            </div>
                                            <span>{val}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Navigation Footers */}
                            <div className="flex justify-between items-center pt-8 border-t border-white/5">
                                <button
                                    onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                                    disabled={currentIdx === 0}
                                    className="btn-secondary disabled:opacity-40"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Previous
                                </button>

                                <button
                                    onClick={() => setCurrentIdx(prev => Math.min(totalQuestions - 1, prev + 1))}
                                    disabled={currentIdx === totalQuestions - 1}
                                    className="btn-secondary disabled:opacity-40"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel: CBT Question Navigator (Grid overview) */}
                <div className="space-y-6">
                    <div className="surface p-6 rounded-lg">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Exam Navigation Map</h3>
                        
                        <div className="grid grid-cols-5 gap-2.5">
                            {questions.map((q, idx) => {
                                const isAnswered = !!answers[q.id];
                                const isCurrent = idx === currentIdx;
                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => setCurrentIdx(idx)}
                                        className={`h-9 rounded-lg font-bold text-xs transition flex items-center justify-center ${isCurrent ? 'bg-[#F4A623] text-black shadow-md shadow-[#F4A623]/20' : isAnswered ? 'bg-[#2ECC8C]/20 border border-[#2ECC8C]/40 text-[#2ECC8C]' : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/20'}`}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                                <div className="w-3.5 h-3.5 rounded bg-[#F4A623]" />
                                <span>Current Question</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                                <div className="w-3.5 h-3.5 rounded bg-[#2ECC8C]/20 border border-[#2ECC8C]/40" />
                                <span>Answered / Saved</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                                <div className="w-3.5 h-3.5 rounded bg-white/5 border border-white/10" />
                                <span>Unanswered Question</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Status Branding bar */}
            <footer className="border-t border-white/5 bg-[#0D1B2A] py-4 px-6 text-center text-xs text-slate-500">
                LMS System Secured. Do not refresh or exit the testing screen. Doing so may submit the mock exam auto-graded.
            </footer>
        </div>
    );
}
