// resources/js/Pages/Admin/BankSettings.jsx
import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function BankSettings({ auth, bankName, accountName, accountNumber, supportWhatsapp }) {
  const { data, setData, post, processing, errors } = useForm({
    bank_name: bankName || '',
    account_name: accountName || '',
    account_number: accountNumber || '',
    support_whatsapp: supportWhatsapp || '',
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('admin.settings.bank.update'));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-white leading-tight">Platform Configuration</h2>}
    >
      <Head title="Platform Settings" />
      <div className="py-12 bg-[#0D1B2A] min-h-screen">
        <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-[#1A3C5E]/10 border border-white/10 p-8 rounded-3xl shadow-xl backdrop-blur-md">
            <h2 className="text-2xl font-serif font-bold mb-6 text-white">Edit Platform Details</h2>
            <p className="text-sm text-gray-400 mb-8 leading-relaxed">
              Configure payment details and support channels for your students.
            </p>
            
            <form onSubmit={submit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-[#F4A623] mb-4 font-black">Bank Payment Details</label>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={data.bank_name}
                    onChange={e => setData('bank_name', e.target.value)}
                    placeholder="e.g. GTBank, Zenith, Kuda"
                    className="w-full bg-[#0D1B2A]/50 border border-white/10 focus:border-[#F4A623] focus:ring-[#F4A623] rounded-xl px-4 py-3 text-white transition"
                    required
                  />
                  {errors.bank_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.bank_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={data.account_number}
                    onChange={e => setData('account_number', e.target.value)}
                    placeholder="e.g. 0123456789"
                    className="w-full bg-[#0D1B2A]/50 border border-white/10 focus:border-[#F4A623] focus:ring-[#F4A623] rounded-xl px-4 py-3 text-white transition"
                    required
                  />
                  {errors.account_number && (
                    <p className="text-red-500 text-xs mt-1">{errors.account_number}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">
                  Account Name
                </label>
                <input
                  type="text"
                  value={data.account_name}
                  onChange={e => setData('account_name', e.target.value)}
                  placeholder="e.g. MyTutorPlus Educational Services"
                  className="w-full bg-[#0D1B2A]/50 border border-white/10 focus:border-[#F4A623] focus:ring-[#F4A623] rounded-xl px-4 py-3 text-white transition"
                  required
                />
                {errors.account_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.account_name}</p>
                )}
              </div>

              <div className="pt-6 border-t border-white/5">
                <label className="block text-xs uppercase tracking-widest text-[#2ECC8C] mb-4 font-black">Support Channels</label>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">
                    WhatsApp Support Number
                  </label>
                  <input
                    type="text"
                    value={data.support_whatsapp}
                    onChange={e => setData('support_whatsapp', e.target.value)}
                    placeholder="e.g. 2348100000000"
                    className="w-full bg-[#0D1B2A]/50 border border-white/10 focus:border-[#2ECC8C] focus:ring-[#2ECC8C] rounded-xl px-4 py-3 text-white transition"
                  />
                  <p className="text-[10px] text-gray-500 mt-2">Enter with country code (no + sign). e.g. 2348123456789</p>
                  {errors.support_whatsapp && (
                    <p className="text-red-500 text-xs mt-1">{errors.support_whatsapp}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-4 bg-gradient-to-r from-[#F4A623] to-orange-500 hover:opacity-90 text-black font-black rounded-xl text-xs uppercase tracking-widest transition duration-200 shadow-lg shadow-[#F4A623]/10 disabled:opacity-50"
              >
                {processing ? 'Saving Changes...' : 'Update Platform Configuration'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
