import { Bell } from 'lucide-react';
import { Link, useForm } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';

export default function NotificationDropdown({ notifications = [] }) {
    const unreadCount = notifications.length;
    const { post } = useForm();

    const markAsRead = () => {
        if (unreadCount > 0) {
            post(route('notifications.markRead'), {
                preserveScroll: true,
            });
        }
    };

    return (
        <Dropdown>
            <Dropdown.Trigger>
                <button
                    onClick={markAsRead}
                    className="relative inline-flex items-center justify-center p-2 text-slate-400 transition hover:bg-white/5 hover:text-white rounded-lg focus:outline-none"
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow">
                            {unreadCount}
                        </span>
                    )}
                </button>
            </Dropdown.Trigger>

            <Dropdown.Content align="right" width="72" contentClasses="bg-[#1A3C5E] border border-white/10 py-0">
                <div className="px-4 py-3 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-slate-300 bg-[#10243A]">
                    Notifications
                </div>
                {unreadCount === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-slate-400">
                        No new notifications
                    </div>
                ) : (
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.map((notification) => (
                            <Link
                                key={notification.id}
                                href={notification.data.action_url || '#'}
                                className="block px-4 py-3 hover:bg-white/5 border-b border-white/5 last:border-0 transition"
                            >
                                <p className="text-sm font-medium text-white">{notification.data.title}</p>
                                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{notification.data.body}</p>
                            </Link>
                        ))}
                    </div>
                )}
            </Dropdown.Content>
        </Dropdown>
    );
}
