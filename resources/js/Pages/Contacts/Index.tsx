import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { PageProps, Contact as ContactType } from '@/types';
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    DocumentDuplicateIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';
import { showToast } from '@/utils/toast';
import { confirmAction } from '@/utils/sweetAlert';

interface IndexProps {
    auth: PageProps['auth'];
    contacts: {
        data: ContactType[];
        links: any[];
    };
    filters: {
        search?: string;
    };
}

export default function Index({ auth, contacts, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);

        router.get(route('contacts.index'), { search: value }, {
            preserveState: true,
            replace: true,
        });
    };

    const deleteContact = async (contact: ContactType) => {
        const confirmed = await confirmAction(
            'Delete Contact',
            `Are you sure you want to delete ${contact.first_name} ${contact.last_name}? This action cannot be undone.`,
            'Yes, delete it!',
            'Cancel',
            'warning'
        );

        if (confirmed) {
            router.delete(route('contacts.destroy', contact.id), {
                onSuccess: () => {
                    showToast.success('Contact deleted successfully!');
                },
                onError: () => {
                    showToast.error('Failed to delete contact.');
                },
            });
        }
    };

    const duplicateContact = async (contact: ContactType) => {
        const confirmed = await confirmAction(
            'Duplicate Contact',
            `Are you sure you want to duplicate ${contact.first_name} ${contact.last_name}?`,
            'Yes, duplicate it!',
            'Cancel',
            'question'
        );

        if (confirmed) {
            router.post(route('contacts.duplicate', contact.id), {}, {
                onSuccess: () => {
                    showToast.success('Contact duplicated successfully!');
                },
                onError: () => {
                    showToast.error('Failed to duplicate contact.');
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Contacts</h2>}
        >
            <Head title="Contacts" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
                                <Link
                                    href={route('contacts.create')}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                                >
                                    <span>Add Contact</span>
                                    <PlusIcon className="w-4 h-4" />
                                </Link>
                            </div>

                            <div className="mb-6 relative">
                                <div className="relative">
                                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search contacts by name or email..."
                                        value={search}
                                        onChange={handleSearch}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    />
                                </div>
                            </div>

                            {contacts.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <UserGroupIcon className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 text-lg mb-2">No contacts found</p>
                                    <p className="text-gray-400 text-sm mb-6">
                                        {search ? 'Try adjusting your search terms' : 'Get started by creating your first contact'}
                                    </p>
                                    <Link
                                        href={route('contacts.create')}
                                        className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                                    >
                                        <PlusIcon className="w-4 h-4 mr-2" />
                                        Create Your First Contact
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Contact
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Email
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Phone
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                            {contacts.data.map((contact) => (
                                                <tr key={contact.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            {contact.avatar_path ? (
                                                                <img
                                                                    src={`/storage/${contact.avatar_path}`}
                                                                    alt={contact.first_name}
                                                                    className="h-10 w-10 rounded-full object-cover mr-3"
                                                                />
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mr-3">
                                                                    <span className="text-white font-semibold text-sm">
                                                                        {contact.first_name[0]}{contact.last_name[0]}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {contact.first_name} {contact.last_name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-600">{contact.email || '-'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-600">{contact.phone || '-'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-2">
                                                            {/* View Button */}
                                                            <Link
                                                                href={route('contacts.show', contact.id)}
                                                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200 group relative"
                                                                title="View Contact"
                                                            >
                                                                <EyeIcon className="w-5 h-5" />
                                                                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                                                    View
                                                                </span>
                                                            </Link>

                                                            {/* Edit Button */}
                                                            <Link
                                                                href={route('contacts.edit', contact.id)}
                                                                className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors duration-200 group relative"
                                                                title="Edit Contact"
                                                            >
                                                                <PencilIcon className="w-5 h-5" />
                                                                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                                                    Edit
                                                                </span>
                                                            </Link>

                                                            {/* Duplicate Button */}
                                                            <button
                                                                onClick={() => duplicateContact(contact)}
                                                                className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors duration-200 group relative"
                                                                title="Duplicate Contact"
                                                            >
                                                                <DocumentDuplicateIcon className="w-5 h-5" />
                                                                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                                                    Duplicate
                                                                </span>
                                                            </button>

                                                            {/* Delete Button */}
                                                            <button
                                                                onClick={() => deleteContact(contact)}
                                                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200 group relative"
                                                                title="Delete Contact"
                                                            >
                                                                <TrashIcon className="w-5 h-5" />
                                                                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                                                    Delete
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {contacts.links && contacts.links.length > 3 && (
                                        <div className="mt-6 flex justify-center">
                                            <nav className="flex space-x-2">
                                                {contacts.links.map((link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url || '#'}
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                                            link.active
                                                                ? 'bg-blue-500 text-white'
                                                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ))}
                                            </nav>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
