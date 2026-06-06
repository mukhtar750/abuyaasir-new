import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Clock, ShieldAlert, Mail, UserCheck } from 'lucide-react';

export default function PendingApproval({ auth, adminNote }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Account Status</h2>}
        >
            <Head title="Pending Approval" />

            <div className="py-12 bg-[#0D1B2A] min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="max-w-2xl w-full px-6">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`bg-[#1A3C5E]/10 border p-12 rounded-[40px] backdrop-blur-xl shadow-2xl text-center space-y-8 ${adminNote ? 'border-red-500/30' : 'border-[#F4A623]/30'}`}
                    >
                        <div className="relative inline-block">
                            <motion.div 
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${adminNote ? 'bg-red-500/20 text-red-400' : 'bg-[#F4A623]/20 text-[#F4A623]'}`}
                            >
                                {adminNote ? <ShieldAlert className="w-12 h-12" /> : <Clock className="w-12 h-12" />}
                            </motion.div>
                        </div>

                        <div className="space-y-4">
                            <h1 className={`text-3xl font-black uppercase tracking-widest font-serif ${adminNote ? 'text-red-400' : 'text-[#F4A623]'}`}>
                                {adminNote ? 'Application Feedback' : 'Awaiting Approval'}
                            </h1>
                            <p className="text-gray-400 text-lg leading-relaxed max-w-md mx-auto">
                                {adminNote 
                                    ? `The administration team has reviewed your profile and left the following note: "${adminNote}"`
                                    : "Thank you for joining MyTutorPlus! Your tutor application is currently being reviewed by our academic board. This usually takes 24-48 hours."}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-left">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <div className="flex items-center space-x-3 mb-2">
                                    <Mail className="w-4 h-4 text-[#F4A623]" />
                                    <span className="text-xs font-bold text-white uppercase tracking-tighter">Notification</span>
                                </div>
                                <p className="text-[10px] text-gray-500">You will receive an email once your account has been verified and activated.</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <div className="flex items-center space-x-3 mb-2">
                                    <UserCheck className="w-4 h-4 text-[#2ECC8C]" />
                                    <span className="text-xs font-bold text-white uppercase tracking-tighter">What's Next?</span>
                                </div>
                                <p className="text-[10px] text-gray-500">Once approved, you'll be able to create courses, schedule live classes, and assign CBTs.</p>
                            </div>
                        </div>

                        <div className="pt-6">
                            <a 
                                href="mailto:support@mytutorplus.com.ng"
                                className="text-sm font-bold text-[#F4A623] hover:text-amber-400 underline underline-offset-4 decoration-2 transition-colors"
                            >
                                Need help? Contact Academic Support
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
