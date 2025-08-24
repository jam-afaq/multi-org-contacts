import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { PageProps, Contact as ContactType } from '@/types';
import { showToast } from '@/utils/toast';
import { confirmAction } from '@/utils/sweetAlert';

interface EditProps {
    auth: PageProps['auth'];
    contact: ContactType;
}

interface FormData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    avatar: File | null;
}

export default function Edit({ auth, contact }: EditProps) {
    const { data, setData, put, errors, processing } = useForm<FormData>({
        first_name: contact.first_name,
        last_name: contact.last_name,
        email: contact.email || '',
        phone: contact.phone || '',
        avatar: null,
    });

    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        contact.avatar_path ? `/storage/${contact.avatar_path}` : null
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Create FormData manually to handle file uploads properly
        const formData = new FormData();
        formData.append('first_name', data.first_name);
        formData.append('last_name', data.last_name);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        formData.append('_method', 'put'); // Required for PUT method with FormData

        if (data.avatar) {
            formData.append('avatar', data.avatar);
        }

        // Use router.post instead of put() for FormData
        router.post(route('contacts.update', contact.id), formData, {
            onSuccess: () => {
                showToast.success('Contact updated successfully!');
                router.visit(route('contacts.index'));
            },
            onError: (errors) => {
                if (errors.code === 'DUPLICATE_EMAIL') {
                    // Handle duplicate email redirect
                    router.visit(route('contacts.show', errors.existing_contact_id), {
                        onSuccess: () => {
                            showToast.error('Duplicate email detected. Contact was not updated.');
                        }
                    });
                } else {
                    showToast.error('Failed to update contact. Please check the form.');
                }
            },
        });
    };

    const handleCancel = async (e: React.MouseEvent) => {
        e.preventDefault();
        const confirmed = await confirmAction(
            'Cancel Changes',
            'Are you sure you want to cancel? Any unsaved changes will be lost.',
            'Yes, cancel',
            'Continue editing'
        );

        if (confirmed) {
            router.visit(route('contacts.index', contact.id));
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const removeAvatar = () => {
        setData('avatar', null);
        setAvatarPreview(null);

    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Contact</h2>}
        >
            <Head title="Edit Contact" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                        />
                                        {errors.first_name && <div className="text-red-500 text-sm mt-1">{errors.first_name}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                        />
                                        {errors.last_name && <div className="text-red-500 text-sm mt-1">{errors.last_name}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                        {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                                        <input
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                        {errors.phone && <div className="text-red-500 text-sm mt-1">{errors.phone}</div>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Avatar</label>
                                        <div className="mt-1 flex items-center space-x-4">
                                            {avatarPreview ? (
                                                <div className="relative">
                                                    <img src={avatarPreview} alt="Avatar preview" className="w-20 h-20 rounded-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={removeAvatar}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ) : contact.avatar_path ? (
                                                <img src={`/storage/${contact.avatar_path}`} alt="Current avatar" className="w-20 h-20 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-400 text-sm">No avatar</span>
                                                </div>
                                            )}
                                            <div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAvatarChange}
                                                    className="py-2 px-3 border border-gray-300 rounded-md text-sm"
                                                    id="avatar-upload"
                                                />
                                                <label htmlFor="avatar-upload" className="ml-2 text-sm text-gray-500">
                                                    {data.avatar ? 'Change image' : 'Upload image'}
                                                </label>
                                            </div>
                                        </div>
                                        {errors.avatar && <div className="text-red-500 text-sm mt-1">{errors.avatar}</div>}
                                    </div>
                                </div>

                                <div className="mt-6 flex space-x-3">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {processing ? 'Updating...' : 'Update Contact'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
