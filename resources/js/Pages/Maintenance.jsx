import React from 'react';
import { Head } from '@inertiajs/react';
import { Wrench, Clock, ShieldAlert } from 'lucide-react';

export default function Maintenance() {
    return (
        <div className="min-h-screen bg-[#0D1B2A] flex flex-col items-center justify-center p-6 text-white font-sans selection:bg-[#F4A623] selection:text-black">
            <Head title="Under Maintenance - MyTutorPlus" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(26,60,94,0.3)_0%,transparent_70%)] pointer-events-none" />

            {/* Premium Glassmorphic Card */}
            <div className="relative z-10 max-w-lg w-full bg-[#1A3C5E]/20 border border-white/10 rounded-lg p-8 backdrop-blur-md shadow-2xl text-center">
                <div className="inline-flex p-4 bg-[#F4A623]/10 border border-[#F4A623]/20 rounded-full text-[#F4A623] mb-6 animate-pulse">
                    <Wrench className="w-10 h-10" />
                </div>

                <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
                    Upgrading Your Learning Experience
                </h1>
                
                <p className="text-gray-300 text-base leading-relaxed mb-8">
                    MyTutorPlus is currently undergoing scheduled developer maintenance to bring you new premium CBT features, lesson materials, and mock exams. We'll be back shortly!
                </p>

                {/* Sub Stats inside Maintenance */}
                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6 text-left">
                    <div className="flex items-center space-x-3 text-gray-400">
                        <Clock className="w-5 h-5 text-[#2ECC8C]" />
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Estimated Restore</p>
                            <p className="text-sm font-medium text-white">Under 2 Hours</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-gray-400">
                        <ShieldAlert className="w-5 h-5 text-[#F4A623]" />
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Platform Status</p>
                            <p className="text-sm font-medium text-white">Updating Core</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Branding */}
            <p className="mt-8 text-xs text-gray-500 z-10">
                &copy; {new Date().getFullYear()} MyTutorPlus LMS. All rights reserved.
            </p>
        </div>
    );
}
