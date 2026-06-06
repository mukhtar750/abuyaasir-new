import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { LogIn } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in - MyTutorPlus" />

            <div className="mb-8">
                <p className="eyebrow">Welcome back</p>
                <h1 className="mt-2 text-3xl font-black text-white">Log in to your portal</h1>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                    Continue your lessons, mock exams, and progress tracking.
                </p>
            </div>

            {status && (
                <div className="mb-4 rounded-lg border border-[#2ECC8C]/25 bg-[#2ECC8C]/10 px-4 py-3 text-sm font-medium text-[#2ECC8C]">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2 block w-full"
                        placeholder="student@mytutor.plus"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-2 block w-full"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-slate-300">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col">
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-semibold text-[#F4A623] hover:text-[#f6b744]"
                            >
                                Forgot your password?
                            </Link>
                        )}
                        <Link
                            href={route('register.tutor')}
                            className="mt-1 text-xs font-semibold text-slate-400 hover:text-white"
                        >
                            Want to teach? Apply as a Tutor
                        </Link>
                    </div>

                    <PrimaryButton className="w-full sm:w-auto" disabled={processing}>
                        <LogIn className="h-4 w-4" />
                        Log in
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
