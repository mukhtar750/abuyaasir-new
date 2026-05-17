import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification - MyTutorPlus" />

            <div className="mb-8">
                <p className="eyebrow">Verify email</p>
                <h1 className="mt-2 text-3xl font-black text-white">Check your inbox</h1>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                    Verify your email address before entering the learning portal. We can send a fresh link if needed.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 rounded-lg border border-[#2ECC8C]/25 bg-[#2ECC8C]/10 px-4 py-3 text-sm font-medium text-[#2ECC8C]">
                    A new verification link has been sent to the email address
                    you provided during registration.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton disabled={processing}>
                        Resend Verification Email
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-sm font-semibold text-slate-300 hover:text-white"
                    >
                        Log Out
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
