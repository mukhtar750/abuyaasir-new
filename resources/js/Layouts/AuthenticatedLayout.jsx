import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import NotificationDropdown from '@/Components/NotificationDropdown';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const { flash } = usePage().props;
    const [flashMsg, setFlashMsg] = useState(null);

    useEffect(() => {
        if (flash?.message || flash?.success || flash?.error) {
            setFlashMsg(flash.message || flash.success || flash.error);
            const timer = setTimeout(() => {
                setFlashMsg(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    return (
        <div className="app-shell font-sans selection:bg-[#F4A623] selection:text-black">
            <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0D1B2A]/88 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/" className="flex items-center space-x-2">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F4A623] text-sm font-black text-[#07111f]">
                                        M+
                                    </div>
                                    <span className="text-base font-black tracking-wide text-white">
                                        MyTutorPlus
                                    </span>
                                </Link>
                            </div>

                            {/* Role-based main Navigation Links */}
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {user.role === 'admin' && (
                                    <NavLink
                                        href={route('admin.dashboard')}
                                        active={route().current('admin.dashboard')}
                                        className="text-white hover:text-[#F4A623] active:text-[#F4A623]"
                                    >
                                        Admin Center
                                    </NavLink>
                                )}
                                {user.role === 'tutor' && (
                                    <>
                                        <NavLink
                                            href={route('tutor.dashboard')}
                                            active={route().current('tutor.dashboard')}
                                            className="text-white hover:text-[#F4A623] active:text-[#F4A623]"
                                        >
                                            Tutor Workspace
                                        </NavLink>
                                        <NavLink
                                            href={route('sessions.index')}
                                            active={route().current('sessions.index')}
                                            className="text-white hover:text-[#F4A623] active:text-[#F4A623]"
                                        >
                                            Live Classes
                                        </NavLink>
                                    </>
                                )}
                                {user.role === 'student' && (
                                    <>
                                        <NavLink
                                            href={route('dashboard')}
                                            active={route().current('dashboard')}
                                            className="text-white hover:text-[#F4A623] active:text-[#F4A623]"
                                        >
                                            Student Dashboard
                                        </NavLink>
                                        <NavLink
                                            href={route('sessions.index')}
                                            active={route().current('sessions.index')}
                                            className="text-white hover:text-[#F4A623] active:text-[#F4A623]"
                                        >
                                            Live Sessions
                                        </NavLink>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            {/* Notification Bell */}
                            <div className="ms-3">
                                <NotificationDropdown notifications={user.unreadNotifications || []} />
                            </div>

                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-lg">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium leading-4 text-white transition duration-150 ease-in-out hover:bg-white/10 focus:outline-none"
                                            >
                                                <span className="mr-2 rounded bg-[#F4A623]/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#F4A623]">
                                                    {user.role}
                                                </span>
                                                {user.name}

                                                <ChevronDown className="-me-0.5 ms-2 h-4 w-4 text-slate-400" />
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content className="bg-[#1A3C5E] border border-white/10 text-white">
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                            className="text-white hover:bg-white/5"
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="text-rose-400 hover:bg-white/5"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition duration-150 hover:bg-white/5 focus:outline-none"
                            >
                                {showingNavigationDropdown ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden border-t border-white/10 bg-[#10243A]'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        {user.role === 'student' && (
                            <>
                                <ResponsiveNavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    className="text-white"
                                >
                                    Student Dashboard
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('sessions.index')}
                                    active={route().current('sessions.index')}
                                    className="text-white"
                                >
                                    Live Sessions
                                </ResponsiveNavLink>
                            </>
                        )}
                        {user.role === 'tutor' && (
                            <>
                                <ResponsiveNavLink
                                    href={route('tutor.dashboard')}
                                    active={route().current('tutor.dashboard')}
                                    className="text-white"
                                >
                                    Tutor Workspace
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('sessions.index')}
                                    active={route().current('sessions.index')}
                                    className="text-white"
                                >
                                    Live Classes
                                </ResponsiveNavLink>
                            </>
                        )}
                        {user.role === 'admin' && (
                            <ResponsiveNavLink
                                href={route('admin.dashboard')}
                                active={route().current('admin.dashboard')}
                                className="text-white"
                            >
                                Admin Center
                            </ResponsiveNavLink>
                        )}
                    </div>

                    <div className="border-t border-white/5 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-white">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-400">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')} className="text-white">
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                                className="text-rose-400"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="border-b border-white/10 bg-[#10243A]/42 backdrop-blur-sm">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>

            {/* Premium Floating Glassmorphic Alert Banner */}
            {flashMsg && (
                <div className="fixed bottom-6 right-6 z-50 flex w-full max-w-sm items-center space-x-3 rounded-lg border border-[#F4A623]/30 bg-[#10243A]/95 px-6 py-4 shadow-2xl backdrop-blur-md transition duration-300">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F4A623] animate-ping" />
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#F4A623]">Platform Update</p>
                        <p className="text-sm font-medium text-white mt-0.5">{flashMsg}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
