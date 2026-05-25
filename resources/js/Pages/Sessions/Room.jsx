import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Video, Mic, PhoneOff, Settings, Users } from 'lucide-react';

export default function Room({ auth, session, roomName }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Live Session: {session.topic}</h2>}
        >
            <Head title={`Room - ${session.topic}`} />

            <div className="py-6 h-[calc(100vh-120px)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl relative h-full flex flex-col">
                        {/* Video Area Placeholder */}
                        <div className="flex-1 bg-gradient-to-br from-gray-800 to-gray-900 relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center"
                                >
                                    <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-gray-600">
                                        <Users className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <p className="text-gray-400 font-medium">Waiting for participants...</p>
                                    <p className="text-gray-600 text-sm mt-1">Room ID: {roomName}</p>
                                </motion.div>
                            </div>

                            {/* Self View Placeholder */}
                            <div className="absolute bottom-6 right-6 w-48 h-32 bg-gray-800 rounded-2xl border-2 border-gray-700 shadow-xl overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-700/50">
                                    <User className="w-8 h-8 text-gray-500" />
                                </div>
                                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 rounded text-[10px] text-white backdrop-blur-md">
                                    You (Tutor)
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="bg-gray-950 p-6 flex items-center justify-center space-x-4 border-t border-gray-800">
                            <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors group">
                                <Mic className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                            </button>
                            <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors group">
                                <Video className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                            </button>
                            <button className="p-4 bg-red-600 hover:bg-red-700 rounded-full transition-colors group mx-8">
                                <PhoneOff className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                            </button>
                            <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors group">
                                <Users className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                            </button>
                            <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors group">
                                <Settings className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function User({ className }) {
    return (
        <svg 
            className={className} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    );
}
