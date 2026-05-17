import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { Mail } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password - MyTutorPlus" />

            <div className="mb-8">
                <p className="eyebrow">Account recovery</p>
                <h1 className="mt-2 text-3xl font-black text-white">Reset your password</h1>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                    Enter your email and we will send a secure reset link.
                </p>
            </div>

            {status && (
                <div className="mb-4 rounded-lg border border-[#2ECC8C]/25 bg-[#2ECC8C]/10 px-4 py-3 text-sm font-medium text-[#2ECC8C]">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="block w-full"
                    placeholder="you@example.com"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="flex items-center justify-end">
                    <PrimaryButton className="w-full" disabled={processing}>
                        <Mail className="h-4 w-4" />
                        Email Password Reset Link
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
