import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-[#F4A623] text-white focus:border-[#F4A623]'
                    : 'border-transparent text-slate-300 hover:border-white/30 hover:text-white focus:border-white/30 focus:text-white') +
                ' ' +
                className
            }
        >
            {children}
        </Link>
    );
}
