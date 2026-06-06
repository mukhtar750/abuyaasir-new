import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { UserPlus, Briefcase, Star, DollarSign } from 'lucide-react';

export default function TutorRegister() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        bio: '',
        specialty: '',
        hourly_rate: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register.tutor'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Become a Tutor - MyTutorPlus" />

            <div className="mb-8">
                <p className="eyebrow">Join our faculty</p>
                <h1 className="mt-2 text-3xl font-black text-white">Register as a Tutor</h1>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                    Share your expertise and help students excel in JAMB, WAEC, and Science subjects.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <InputLabel htmlFor="name" value="Full Name" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-2 block w-full"
                            placeholder="Your full name"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email Address" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-2 block w-full"
                            placeholder="you@example.com"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-2 block w-full"
                            placeholder="Create a secure password"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-2 block w-full"
                            placeholder="Repeat your password"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                    <p className="text-xs font-black uppercase tracking-widest text-[#F4A623] mb-4">Professional Details</p>
                    
                    <div className="space-y-5">
                        <div>
                            <InputLabel htmlFor="specialty" value="Primary Specialty" />
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <TextInput
                                    id="specialty"
                                    value={data.specialty}
                                    className="mt-2 block w-full pl-10"
                                    placeholder="e.g. Senior Physics & Mathematics Tutor"
                                    onChange={(e) => setData('specialty', e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.specialty} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="hourly_rate" value="Hourly Rate (₦)" />
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <TextInput
                                    id="hourly_rate"
                                    type="number"
                                    value={data.hourly_rate}
                                    className="mt-2 block w-full pl-10"
                                    placeholder="e.g. 5000"
                                    onChange={(e) => setData('hourly_rate', e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.hourly_rate} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="bio" value="Professional Bio / Experience" />
                            <textarea
                                id="bio"
                                value={data.bio}
                                className="mt-2 block w-full bg-[#0D1B2A] border-white/10 rounded-xl text-slate-300 focus:border-[#F4A623] focus:ring-[#F4A623] text-sm h-32"
                                placeholder="Describe your teaching experience and academic background (Min 50 characters)..."
                                onChange={(e) => setData('bio', e.target.value)}
                                required
                            />
                            <InputError message={errors.bio} className="mt-2" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-4">
                    <Link
                        href={route('login')}
                        className="text-sm font-semibold text-slate-300 hover:text-white"
                    >
                        Already have an account?
                    </Link>

                    <PrimaryButton className="w-full sm:w-auto bg-[#F4A623] hover:bg-[#F4A623]/90 text-black" disabled={processing}>
                        <UserPlus className="h-4 w-4" />
                        Submit Application
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
