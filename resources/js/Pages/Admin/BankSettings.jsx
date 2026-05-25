// resources/js/Pages/Admin/BankSettings.jsx
import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function BankSettings() {
  const { props } = usePage();
  const { accountNumber } = props; // Provided by controller

  const { data, setData, post, processing, errors } = useForm({
    account_number: accountNumber || '',
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('admin.settings.bank.update'));
  };

  return (
    <AuthenticatedLayout>
      <Head title="Bank Settings" />
      <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Edit Bank Account Details</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bank Account Number
            </label>
            <input
              type="text"
              name="account_number"
              value={data.account_number}
              onChange={e => setData('account_number', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {errors.account_number && (
              <p className="text-red-600 text-sm mt-1">{errors.account_number}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={processing}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {processing ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
