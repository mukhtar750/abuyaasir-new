import { Link } from '@inertiajs/react';
import { BookOpenCheck, Brain, FlaskConical, Sigma } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="app-shell flex min-h-screen items-center justify-center px-4 py-10 selection:bg-[#F4A623] selection:text-black">
            <div className="grid w-full max-w-6xl overflow-hidden rounded-lg border border-white/10 bg-[#081523]/70 shadow-2xl lg:grid-cols-[1fr_0.82fr]">
                <section className="relative hidden min-h-[640px] flex-col justify-between overflow-hidden p-10 lg:flex">
                    <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(244,166,35,0.16),transparent_38%),linear-gradient(40deg,rgba(46,204,140,0.13),transparent_42%)]" />
                    <div className="relative z-10">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#F4A623] text-sm font-black text-[#07111f]">
                                M+
                            </span>
                            <span className="text-lg font-black tracking-wide text-white">MyTutorPlus</span>
                        </Link>
                    </div>

                    <div className="relative z-10 max-w-xl space-y-7">
                        <span className="eyebrow">Science exam command center</span>
                        <h1 className="text-5xl font-black leading-tight text-white">
                            Learn, practice, and measure progress in one focused portal.
                        </h1>
                        <p className="max-w-lg text-base leading-7 text-slate-300">
                            Purpose-built for Mathematics, Physics, Chemistry, JAMB, WAEC, and CBT readiness.
                        </p>

                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { icon: Sigma, label: 'Math' },
                                { icon: Brain, label: 'CBT' },
                                { icon: FlaskConical, label: 'Science' },
                            ].map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div key={item.label} className="surface-muted rounded-lg p-4">
                                        <Icon className="mb-4 h-6 w-6 text-[#F4A623]" />
                                        <p className="text-sm font-bold text-white">{item.label}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center gap-3 text-sm text-slate-300">
                        <BookOpenCheck className="h-5 w-5 text-[#2ECC8C]" />
                        Premium lesson flow with role-aware dashboards.
                    </div>
                </section>

                <main className="flex min-h-[640px] items-center justify-center bg-[#0D1B2A]/92 px-5 py-10 sm:px-10">
                    <div className="w-full max-w-md">
                        <Link href="/" className="mb-8 flex items-center gap-3 lg:hidden">
                            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F4A623] text-sm font-black text-[#07111f]">
                                M+
                            </span>
                            <span className="text-lg font-black tracking-wide text-white">MyTutorPlus</span>
                        </Link>

                        <div className="surface rounded-lg p-6 sm:p-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
