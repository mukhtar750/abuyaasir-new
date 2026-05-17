import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-[#F4A623] bg-[#F4A623]/10 text-white focus:border-[#F4A623] focus:bg-[#F4A623]/10'
                    : 'border-transparent text-slate-300 hover:border-white/30 hover:bg-white/5 hover:text-white focus:border-white/30 focus:bg-white/5 focus:text-white'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
